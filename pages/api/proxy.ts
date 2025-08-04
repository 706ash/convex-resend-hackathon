import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from '@convex-dev/client';
import { api } from '../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { appKey, provider, payload } = req.body;

  if (!appKey || !provider || !payload) {
    return res.status(400).json({ error: 'Missing appKey, provider, or payload in request body' });
  }

  try {
    // 1. Verify app key and get linked API key data
    const apiKeyData = await convex.query(api.keys.getApiKeyBySentinelKey, { sentinelKey: appKey });

    if (!apiKeyData) {
      return res.status(401).json({ error: 'Unauthorized: Invalid app key' });
    }

    if (apiKeyData.provider !== provider) {
      return res.status(400).json({ error: `Bad Request: App key is linked to ${apiKeyData.provider}, not ${provider}` });
    }

    const externalApiKey = apiKeyData.apiKey;

    let externalApiResponse;

    // 2. Dynamically call the external API based on the provider
    switch (provider) {
      case 'openai':
        try {
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${externalApiKey}`,
            },
            body: JSON.stringify(payload),
          });
          externalApiResponse = await openaiRes.json();
        } catch (error) {
          console.error('OpenAI API call failed:', error);
          return res.status(500).json({ error: 'Failed to call OpenAI API' });
        }
        break;
      case 'gemini':
        try {
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${externalApiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          externalApiResponse = await geminiRes.json();
        } catch (error) {
          console.error('Gemini API call failed:', error);
          return res.status(500).json({ error: 'Failed to call Gemini API' });
        }
        break;
      // Add more cases for other providers (e.g., 'anthropic', 'cohere')
      default:
        return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    // 3. Log usage
    let tokensUsed = 0;
    if (provider === 'openai' && externalApiResponse.usage) {
      tokensUsed = externalApiResponse.usage.prompt_tokens || 0;
    } else if (provider === 'gemini' && externalApiResponse.usageMetadata) {
      tokensUsed = externalApiResponse.usageMetadata.promptTokenCount || 0;
    }
    await convex.mutation(api.keys.logApiKeyUsage, { apiKeyId: apiKeyData._id, tokensUsed });

    return res.status(200).json(externalApiResponse);

  } catch (error) {
    console.error('API Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
