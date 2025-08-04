// app/api/[service]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser"; 
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ✅ Optional CORS support (for curl, third-party calls)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { service: string } }
) {
  try {
    const body = await req.json();
    const { appKey, payload } = body;
    const provider = params.service;

    if (!appKey || !payload) {
      return NextResponse.json(
        { error: "Missing appKey or payload in request body" },
        { status: 400 }
      );
    }

    // 1. Lookup the API key from Convex
    const apiKeyData = await convex.query(api.keys.getApiKeyBySentinelKey, {
      sentinelKey: appKey,
    });

    if (!apiKeyData) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid app key" },
        { status: 401 }
      );
    }

    if (apiKeyData.provider !== provider) {
      return NextResponse.json(
        {
          error: `Bad Request: App key is linked to ${apiKeyData.provider}, not ${provider}`,
        },
        { status: 400 }
      );
    }

    const externalApiKey = apiKeyData.apiKey;
    let proxyUrl = "";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 2. Set provider-specific endpoint and headers
    switch (provider) {
      case "openai":
        proxyUrl = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${externalApiKey}`;
        break;

      case "gemini":
        proxyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${encodeURIComponent(
          externalApiKey
        )}`;
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported provider: ${provider}` },
          { status: 400 }
        );
    }

    // 3. Forward request to third-party provider
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const externalApiResponse = await response.json();

    // 4. Log token usage to Convex (if supported)
    let tokensUsed = 0;
    if (provider === "openai" && externalApiResponse.usage) {
      tokensUsed = externalApiResponse.usage.prompt_tokens || 0;
    } else if (
      provider === "gemini" &&
      externalApiResponse.usageMetadata
    ) {
      tokensUsed = externalApiResponse.usageMetadata.promptTokenCount || 0;
    }

    await convex.mutation(api.keys.logApiKeyUsage, {
      apiKeyId: apiKeyData._id,
      tokensUsed,
    });

    return NextResponse.json(externalApiResponse, {
      status: response.status || 200,
    });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
