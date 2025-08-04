
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const addApiKey = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    provider: v.string(),
    apiKey: v.string(),
    description: v.optional(v.string()),
    email: v.optional(v.string()), // New email field
    rateLimit: v.number(),
    scopes: v.array(v.string()),
    trustedPeople: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const newKey = await ctx.db.insert("api_keys", {
      userId: args.userId,
      name: args.name,
      provider: args.provider,
      apiKey: args.apiKey, // In a real app, you'd encrypt this
      description: args.description,
      email: args.email, // Save the email
      rateLimit: args.rateLimit,
      scopes: args.scopes,
      trustedPeople: args.trustedPeople,
      createdAt: Date.now(),
      lastUsed: args.lastUsed ?? undefined,
      requests: 0,
      status: "active",
    });
    return newKey;
  },
});

export const getApiKeys = query({
  handler: async (ctx) => {
    const apiKeys = await ctx.db.query("api_keys").collect();
    const apiKeysWithSentinel = await Promise.all(
      apiKeys.map(async (apiKey) => {
        const sentinelKey = await ctx.db
          .query("app_keys")
          .filter((q) => q.eq(q.field("mapsToKeyId"), apiKey._id))
          .first();
        return { ...apiKey, sentinelKey: sentinelKey?.sentinelKey };
      })
    );
    return apiKeysWithSentinel;
  },
});

export const fetchApiKeyBySentinelKey = query({
  args: {
    sentinelKey: v.string(),
  },
  handler: async (ctx, args) => {
    // This function retrieves an API key by its sentinel key.
    const appKey = await ctx.db
      .query("app_keys")
      .filter((q) => q.eq(q.field("sentinelKey"), args.sentinelKey))
      .first();

    if (!appKey) {
      return null;
    }

    const apiKey = await ctx.db.get(appKey.mapsToKeyId);
    return apiKey;
  },
});

export const logApiKeyUsage = mutation({
  args: {
    apiKeyId: v.id("api_keys"),
    tokensUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const apiKey = await ctx.db.get(args.apiKeyId);
    if (apiKey) {
      const newRequests = apiKey.requests + 1; // Increment requests by 1 for simplicity, can use tokensUsed
      const now = Date.now();

      await ctx.db.patch(args.apiKeyId, {
        requests: newRequests,
        lastUsed: now,
      });

      // Check for usage limits and send email
      const usagePercentage = (newRequests / apiKey.rateLimit) * 100;
      const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

      // Send email if usage exceeds 80% and no email sent today
      if (
        apiKey.email &&
        usagePercentage >= 80 &&
        (!apiKey.lastEmailSent || now - apiKey.lastEmailSent > oneDay)
      ) {
                await ctx.scheduler.runAfter(0, api.resend.sendEmail, {
          to: apiKey.email,
          subject: `API Key Usage Alert: ${apiKey.name}`,
          html: `Your API key "${apiKey.name}" has reached ${usagePercentage.toFixed(2)}% of its rate limit (${newRequests}/${apiKey.rateLimit} requests).`,
        });

        // Update lastEmailSent to prevent spamming
        await ctx.db.patch(args.apiKeyId, {
          lastEmailSent: now,
        });
      }
    }
  },
});

export const addSentinelKey = mutation({
  args: {
    sentinelKey: v.string(),
    mapsToKeyId: v.id("api_keys"),
  },
  handler: async (ctx, args) => {
    const newSentinelKey = await ctx.db.insert("app_keys", {
      sentinelKey: args.sentinelKey,
      mapsToKeyId: args.mapsToKeyId,
      createdAt: Date.now(),
    });
    return newSentinelKey;
  },
});

export const addTrustedPerson = mutation({
  args: {
    ownerId: v.string(),
    trustedEmail: v.string(),
    provider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newTrustedPerson = await ctx.db.insert("trusted_people", {
      ownerId: args.ownerId,
      trustedEmail: args.trustedEmail,
      provider: args.provider,
    });
    return newTrustedPerson;
  },
});
