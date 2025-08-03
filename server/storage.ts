import { 
  type User, type InsertUser, 
  type ApiKey, type InsertApiKey,
  type SentinelKey, type InsertSentinelKey,
  type UsageLog, type InsertUsageLog,
  type TrustedUser, type InsertTrustedUser,
  type Alert, type InsertAlert
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // API Keys
  getApiKeys(ownerId: string): Promise<ApiKey[]>;
  getApiKey(id: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;

  // Sentinel Keys
  getSentinelKeys(apiKeyId?: string): Promise<SentinelKey[]>;
  getSentinelKey(key: string): Promise<SentinelKey | undefined>;
  createSentinelKey(sentinelKey: InsertSentinelKey): Promise<SentinelKey>;
  deleteSentinelKey(id: string): Promise<boolean>;

  // Usage Logs
  getUsageLogs(sentinelKeyId?: string): Promise<UsageLog[]>;
  createUsageLog(log: InsertUsageLog): Promise<UsageLog>;
  getUsageStats(timeRange?: string): Promise<any>;

  // Trusted Users
  getTrustedUsers(ownerId: string): Promise<TrustedUser[]>;
  createTrustedUser(user: InsertTrustedUser): Promise<TrustedUser>;

  // Alerts
  getAlerts(userId: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private apiKeys: Map<string, ApiKey> = new Map();
  private sentinelKeys: Map<string, SentinelKey> = new Map();
  private usageLogs: Map<string, UsageLog> = new Map();
  private trustedUsers: Map<string, TrustedUser> = new Map();
  private alerts: Map<string, Alert> = new Map();

  constructor() {
    // Create a demo user and some sample data
    const demoUser: User = {
      id: "demo-user-1",
      email: "demo@keysentinel.com",
      password: "hashed_password",
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Create sample API keys
    const openAiKey: ApiKey = {
      id: "api-key-1",
      ownerId: demoUser.id,
      provider: "openai",
      encryptedKey: "encrypted_openai_key",
      keyName: "OpenAI GPT-4",
      scopes: ["chat", "completions"],
      revoked: false,
      createdAt: new Date(),
    };

    const geminiKey: ApiKey = {
      id: "api-key-2",
      ownerId: demoUser.id,
      provider: "gemini",
      encryptedKey: "encrypted_gemini_key",
      keyName: "Gemini Pro",
      scopes: ["generate"],
      revoked: false,
      createdAt: new Date(),
    };

    this.apiKeys.set(openAiKey.id, openAiKey);
    this.apiKeys.set(geminiKey.id, geminiKey);

    // Create sentinel keys
    const sentinelKey1: SentinelKey = {
      id: "sentinel-1",
      key: "sentinel_oai_abc123",
      apiKeyId: openAiKey.id,
      rateLimit: 1000,
      trustedOnly: false,
      allowedEndpoints: ["/v1/chat/completions"],
      ipRestrictions: [],
      expiresAt: null,
      createdAt: new Date(),
    };

    const sentinelKey2: SentinelKey = {
      id: "sentinel-2",
      key: "sentinel_gem_xyz789",
      apiKeyId: geminiKey.id,
      rateLimit: 500,
      trustedOnly: false,
      allowedEndpoints: ["/v1/generate"],
      ipRestrictions: [],
      expiresAt: null,
      createdAt: new Date(),
    };

    this.sentinelKeys.set(sentinelKey1.id, sentinelKey1);
    this.sentinelKeys.set(sentinelKey2.id, sentinelKey2);

    // Create sample usage logs
    for (let i = 0; i < 50; i++) {
      const log: UsageLog = {
        id: `log-${i}`,
        sentinelKeyId: Math.random() > 0.5 ? sentinelKey1.id : sentinelKey2.id,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country: ["US", "CA", "GB", "DE", "FR"][Math.floor(Math.random() * 5)],
        endpoint: "/v1/chat/completions",
        method: "POST",
        statusCode: Math.random() > 0.1 ? 200 : 429,
        responseTimeMs: Math.floor(Math.random() * 1000) + 100,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      };
      this.usageLogs.set(log.id, log);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getApiKeys(ownerId: string): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values()).filter(key => key.ownerId === ownerId);
  }

  async getApiKey(id: string): Promise<ApiKey | undefined> {
    return this.apiKeys.get(id);
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const apiKey: ApiKey = { 
      ...insertApiKey, 
      id, 
      createdAt: new Date(),
      scopes: insertApiKey.scopes || [],
      revoked: insertApiKey.revoked || false
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const existing = this.apiKeys.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.apiKeys.set(id, updated);
    return updated;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    return this.apiKeys.delete(id);
  }

  async getSentinelKeys(apiKeyId?: string): Promise<SentinelKey[]> {
    const keys = Array.from(this.sentinelKeys.values());
    return apiKeyId ? keys.filter(key => key.apiKeyId === apiKeyId) : keys;
  }

  async getSentinelKey(key: string): Promise<SentinelKey | undefined> {
    return Array.from(this.sentinelKeys.values()).find(sk => sk.key === key);
  }

  async createSentinelKey(insertSentinelKey: InsertSentinelKey): Promise<SentinelKey> {
    const id = randomUUID();
    const sentinelKey: SentinelKey = { 
      ...insertSentinelKey, 
      id, 
      createdAt: new Date(),
      rateLimit: insertSentinelKey.rateLimit || 1000,
      trustedOnly: insertSentinelKey.trustedOnly || false,
      allowedEndpoints: insertSentinelKey.allowedEndpoints || [],
      ipRestrictions: insertSentinelKey.ipRestrictions || [],
      expiresAt: insertSentinelKey.expiresAt || null
    };
    this.sentinelKeys.set(id, sentinelKey);
    return sentinelKey;
  }

  async deleteSentinelKey(id: string): Promise<boolean> {
    return this.sentinelKeys.delete(id);
  }

  async getUsageLogs(sentinelKeyId?: string): Promise<UsageLog[]> {
    const logs = Array.from(this.usageLogs.values());
    return sentinelKeyId ? logs.filter(log => log.sentinelKeyId === sentinelKeyId) : logs;
  }

  async createUsageLog(insertLog: InsertUsageLog): Promise<UsageLog> {
    const id = randomUUID();
    const log: UsageLog = { 
      ...insertLog, 
      id, 
      timestamp: new Date(),
      country: insertLog.country || null
    };
    this.usageLogs.set(id, log);
    return log;
  }

  async getUsageStats(timeRange?: string): Promise<any> {
    const logs = Array.from(this.usageLogs.values());
    const now = new Date();
    const cutoff = new Date(now.getTime() - (timeRange === '7d' ? 7 : 1) * 24 * 60 * 60 * 1000);
    
    const recentLogs = logs.filter(log => log.timestamp > cutoff);
    
    return {
      totalRequests: recentLogs.length,
      successRate: recentLogs.filter(log => log.statusCode === 200).length / recentLogs.length * 100,
      avgResponseTime: recentLogs.reduce((sum, log) => sum + log.responseTimeMs, 0) / recentLogs.length,
      byDay: this.groupLogsByDay(recentLogs),
    };
  }

  private groupLogsByDay(logs: UsageLog[]) {
    const grouped = logs.reduce((acc, log) => {
      if (log.timestamp) {
        const day = log.timestamp.toISOString().split('T')[0];
        acc[day] = (acc[day] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }

  async getTrustedUsers(ownerId: string): Promise<TrustedUser[]> {
    return Array.from(this.trustedUsers.values()).filter(user => user.ownerId === ownerId);
  }

  async createTrustedUser(insertUser: InsertTrustedUser): Promise<TrustedUser> {
    const id = randomUUID();
    const user: TrustedUser = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      permissions: insertUser.permissions || []
    };
    this.trustedUsers.set(id, user);
    return user;
  }

  async getAlerts(userId: string): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(alert => alert.userId === userId);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const alert: Alert = { 
      ...insertAlert, 
      id, 
      triggeredAt: new Date(),
      severity: insertAlert.severity || "medium",
      resolved: insertAlert.resolved || false
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async resolveAlert(id: string): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    alert.resolved = true;
    return true;
  }
}

export const storage = new MemStorage();
