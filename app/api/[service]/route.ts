import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest, { params }: { params: { service: string } }) {
  try {
    const body = await req.json();
    const { appKey, payload } = body;
    const provider = params.service;

    if (!appKey || !payload) {
      return NextResponse.json({ error: "Missing appKey or payload in request body" }, { status: 400 });
    }

    // 1. Verify app key and get linked API key data
    const apiKeyData = await convex.query(api.keys.getApiKeyBySentinelKey, { sentinelKey: appKey });

    if (!apiKeyData) {
      return NextResponse.json({ error: "Unauthorized: Invalid app key" }, { status: 401 });
    }

    if (apiKeyData.provider !== provider) {
      return NextResponse.json(
        { error: `Bad Request: App key is linked to ${apiKeyData.provider}, not ${provider}` },
        { status: 400 }
      );
    }

    const externalApiKey = apiKeyData.apiKey;
    let proxyUrl = "";
    let headers: Record<string, string> = {
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
        proxyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${externalApiKey}`;
        break;
      default:
        return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
    }

    const response = await fetch(proxyUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    externalApiResponse = await response.json();

    // 3. Log usage
    let tokensUsed = 0;
    if (provider === "openai" && externalApiResponse.usage) {
      tokensUsed = externalApiResponse.usage.prompt_tokens || 0;
    } else if (provider === "gemini" && externalApiResponse.usageMetadata) {
      tokensUsed = externalApiResponse.usageMetadata.promptTokenCount || 0;
    }
    await convex.mutation(api.keys.logApiKeyUsage, { apiKeyId: apiKeyData._id, tokensUsed });

    return NextResponse.json(externalApiResponse, { status: response.status });
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
