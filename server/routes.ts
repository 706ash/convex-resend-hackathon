import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApiKeySchema, insertSentinelKeySchema, insertUsageLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Keys routes
  app.get("/api/keys", async (req, res) => {
    try {
      // In a real app, get ownerId from authenticated session
      const ownerId = "demo-user-1";
      const keys = await storage.getApiKeys(ownerId);
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/keys", async (req, res) => {
    try {
      const data = insertApiKeySchema.parse(req.body);
      const key = await storage.createApiKey(data);
      res.json(key);
    } catch (error) {
      res.status(400).json({ error: "Invalid API key data" });
    }
  });

  app.delete("/api/keys/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteApiKey(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "API key not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete API key" });
    }
  });

  // Sentinel Keys routes
  app.get("/api/sentinel-keys", async (req, res) => {
    try {
      const keys = await storage.getSentinelKeys();
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sentinel keys" });
    }
  });

  app.post("/api/sentinel-keys", async (req, res) => {
    try {
      const data = insertSentinelKeySchema.parse(req.body);
      // Generate unique sentinel key
      const keyPrefix = `sentinel_${data.apiKeyId.slice(-3)}_`;
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      data.key = keyPrefix + randomSuffix;
      
      const key = await storage.createSentinelKey(data);
      res.json(key);
    } catch (error) {
      res.status(400).json({ error: "Invalid sentinel key data" });
    }
  });

  // Usage logs and analytics
  app.get("/api/usage-logs", async (req, res) => {
    try {
      const { sentinelKeyId } = req.query;
      const logs = await storage.getUsageLogs(sentinelKeyId as string);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage logs" });
    }
  });

  app.get("/api/usage-stats", async (req, res) => {
    try {
      const { timeRange } = req.query;
      const stats = await storage.getUsageStats(timeRange as string);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage stats" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const userId = "demo-user-1";
      const alerts = await storage.getAlerts(userId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Proxy endpoint for API requests
  app.all("/api/proxy/*", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
      }

      const sentinelKey = authHeader.substring(7);
      const keyData = await storage.getSentinelKey(sentinelKey);
      
      if (!keyData) {
        return res.status(401).json({ error: "Invalid sentinel key" });
      }

      // Log the request
      await storage.createUsageLog({
        sentinelKeyId: keyData.id,
        ip: req.ip || "unknown",
        country: "US", // Would use IP geolocation in real app
        endpoint: req.path,
        method: req.method,
        statusCode: 200,
        responseTimeMs: Math.floor(Math.random() * 500) + 100,
      });

      // In a real app, this would proxy to the actual API
      res.json({ 
        message: "Proxy response", 
        sentinelKey,
        endpoint: req.path,
        method: req.method 
      });
    } catch (error) {
      res.status(500).json({ error: "Proxy error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
