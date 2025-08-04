export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { appKey, provider, payload } = req.body;

  if (!appKey || !provider || !payload) {
    return res.status(400).json({ error: 'Missing appKey, provider, or payload in request body' });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  console.log("Vercel function using Convex URL:", convexUrl);
  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    return res.status(500).json({ error: 'Convex URL not configured' });
  }

  try {
    // 1. Verify app key and get linked API key data via Convex HTTP API
    const apiKeyDataResponse = await fetch(`${convexUrl}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'keys:fetchApiKeyBySentinelKey', // Fixed: removed .js and used colon syntax
        args: { sentinelKey: appKey },
      }),
    });
    
    const apiKeyData = await apiKeyDataResponse.json();
    console.log("Received apiKeyData from Convex:", apiKeyData);

    if (!apiKeyData || apiKeyData.status === 'error') {
      console.error("Convex query error:", apiKeyData);
      return res.status(401).json({ error: 'Unauthorized: Invalid app key or Convex error' });
    }

    const actualApiKeyData = apiKeyData.value;

    if (!actualApiKeyData) {
      return res.status(401).json({ error: 'Unauthorized: Invalid app key (no value)' });
    }

    if (actualApiKeyData.provider !== provider) {
      return res.status(400).json({ error: `Bad Request: App key is linked to ${actualApiKeyData.provider}, not ${provider}` });
    }

    const externalApiKey = actualApiKeyData.apiKey;
    let proxyUrl = "";
    let headers = {
      "Content-Type": "application/json",
    };
    let externalApiResponse;

    // 2. Dynamically call the external API based on the provider
    switch (provider) {
      case "openai":
        proxyUrl = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${externalApiKey}`;
        break;
      case "gemini":
        proxyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(externalApiKey)}`;
        break;
      default:
        return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    externalApiResponse = await response.json();

    // 3. Log usage via Convex HTTP API
    let tokensUsed = 0;
    if (provider === "openai" && externalApiResponse.usage) {
      tokensUsed = externalApiResponse.usage.prompt_tokens || 0;
    } else if (provider === "gemini" && externalApiResponse.usageMetadata) {
      tokensUsed = externalApiResponse.usageMetadata.promptTokenCount || 0;
    }

    await fetch(`${convexUrl}/api/mutation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: 'keys:logApiKeyUsage',
        args: { apiKeyId: actualApiKeyData._id, tokensUsed },
      }),
    });

    return res.status(response.status || 200).json(externalApiResponse);

  } catch (error) {
    console.error('API Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}