import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  provider: text("provider").notNull(), // "gemini", "openai", "claude"
  encryptedKey: text("encrypted_key").notNull(),
  keyName: text("key_name").notNull(),
  scopes: json("scopes").$type<string[]>().default([]),
  revoked: boolean("revoked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sentinelKeys = pgTable("sentinel_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // e.g. sentinel_abc123
  apiKeyId: varchar("api_key_id").notNull().references(() => apiKeys.id),
  rateLimit: integer("rate_limit").default(1000), // requests per hour
  trustedOnly: boolean("trusted_only").default(false),
  allowedEndpoints: json("allowed_endpoints").$type<string[]>().default([]),
  ipRestrictions: json("ip_restrictions").$type<string[]>().default([]),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usageLogs = pgTable("usage_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sentinelKeyId: varchar("sentinel_key_id").notNull().references(() => sentinelKeys.id),
  ip: text("ip").notNull(),
  country: text("country"),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTimeMs: integer("response_time_ms").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const trustedUsers = pgTable("trusted_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  email: text("email").notNull(),
  permissions: json("permissions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "anomaly", "rate_limit", "recovery", "security"
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").default("medium"), // "low", "medium", "high", "critical"
  resolved: boolean("resolved").default(false),
  triggeredAt: timestamp("triggered_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true });
export const insertSentinelKeySchema = createInsertSchema(sentinelKeys).omit({ id: true, createdAt: true });
export const insertUsageLogSchema = createInsertSchema(usageLogs).omit({ id: true, timestamp: true });
export const insertTrustedUserSchema = createInsertSchema(trustedUsers).omit({ id: true, createdAt: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, triggeredAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type SentinelKey = typeof sentinelKeys.$inferSelect;
export type InsertSentinelKey = z.infer<typeof insertSentinelKeySchema>;
export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
export type TrustedUser = typeof trustedUsers.$inferSelect;
export type InsertTrustedUser = z.infer<typeof insertTrustedUserSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
