
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addApiKey = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    provider: v.string(),
    apiKey: v.string(),
    description: v.optional(v.string()),
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
      await ctx.db.patch(args.apiKeyId, {
        requests: apiKey.requests + 1,
        lastUsed: Date.now(),
      });
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
