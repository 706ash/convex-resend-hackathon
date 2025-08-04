
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
    return await ctx.db.query("api_keys").collect();
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
