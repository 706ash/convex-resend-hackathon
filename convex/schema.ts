// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  api_keys: defineTable({
    userId: v.string(),                // Owner of the key
    name: v.string(),                 // Key name (e.g., "Production OpenAI")
    provider: v.string(),             // e.g., "openai", "gemini", "qloo"
    apiKey: v.string(),               // Encrypted key string
    description: v.optional(v.string()),
    rateLimit: v.number(),     // User-defined limit
    scopes: v.array(v.string()),
    trustedPeople: v.optional(v.array(v.string())),
    createdAt: v.number(),            // Timestamp
    lastUsed: v.optional(v.number()),
    requests: v.number(),
    status: v.string(),
  }).index("by_user", ["userId"]),

  trusted_people: defineTable({
    ownerId: v.string(),
    trustedEmail: v.string(),         // Person given access
    provider: v.optional(v.string()), // Optional scoping to specific key provider
  }).index("by_owner", ["ownerId"]),

  app_keys: defineTable({
    sentinelKey: v.string(),          // Public-facing proxy key
    mapsToKeyId: v.id("api_keys"),    // Internal key ref
    createdAt: v.number(),
  }).index("by_key", ["mapsToKeyId"]),

  recovery_links: defineTable({
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),            // Unix timestamp expiry
  }).index("by_email", ["email"]),
});
