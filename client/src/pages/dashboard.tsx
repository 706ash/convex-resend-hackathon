import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Key, 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Search, 
  MoreVertical,
  TrendingUp,
  CheckCircle,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassmorphicCard from "@/components/ui/glassmorphic-card";
import SecurityStatus from "@/components/ui/security-status";
import AddKeyDialog from "@/components/ui/add-key-dialog";
import AnalyticsGraph from "@/components/ui/analytics-graph";
import { useToast } from "@/hooks/use-toast";
import type { ApiKey, SentinelKey, UsageLog, Alert } from "@shared/schema";

export default function Dashboard() {
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const { toast } = useToast();

  const { data: apiKeys = [], isLoading: keysLoading } = useQuery<ApiKey[]>({
    queryKey: ["/api/keys"],
  });

  const { data: sentinelKeys = [], isLoading: sentinelLoading } = useQuery<SentinelKey[]>({
    queryKey: ["/api/sentinel-keys"],
  });

  const { data: usageStats, isLoading: statsLoading } = useQuery<{
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    byDay: { date: string; count: number; }[];
  }>({
    queryKey: ["/api/usage-stats"],
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const stats = [
    {
      title: "Active Keys",
      value: sentinelKeys.length,
      change: "+2 this week",
      icon: Key,
      color: "text-sky"
    },
    {
      title: "Requests",
      value: usageStats?.totalRequests || 0,
      change: "+15% today",
      icon: BarChart3,
      color: "text-coral"
    },
    {
      title: "Success Rate",
      value: `${Math.round(usageStats?.successRate || 99.9)}%`,
      change: "Optimal",
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      title: "Alerts",
      value: alerts.filter(alert => !alert.resolved).length,
      change: `${alerts.filter(alert => !alert.resolved).length} pending`,
      icon: AlertTriangle,
      color: "text-yellow-400"
    }
  ];

  const mockApiKeysWithSentinel = apiKeys.map((key: ApiKey) => {
    const relatedSentinel = sentinelKeys.find((sk: SentinelKey) => sk.apiKeyId === key.id);
    return {
      ...key,
      sentinelKey: relatedSentinel?.key || "Not created",
      todayRequests: Math.floor(Math.random() * 1000) + 100,
      status: relatedSentinel ? "active" : "inactive"
    };
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Key copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const recentActivity = [
    { type: "New API key created", time: "2 minutes ago", color: "text-sky" },
    { type: "Rate limit exceeded", time: "5 minutes ago", color: "text-coral" },
    { type: "Security scan completed", time: "1 hour ago", color: "text-green-400" },
    { type: "Anomaly detected", time: "3 hours ago", color: "text-yellow-400" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (keysLoading || sentinelLoading || statsLoading || alertsLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <motion.div
          className="glass p-8 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <Shield className="w-12 h-12 text-sky mx-auto mb-4" />
            <p className="text-lg">Loading your security dashboard...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen pt-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your API keys with advanced security controls</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="glass border-sky/30"
              onClick={() => setShowAddKeyDialog(true)}
              data-testid="button-add-key"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Key
            </Button>
            <Button className="bg-gradient-to-r from-sky to-coral hover:shadow-lg">
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassmorphicCard className="p-6 hover:border-sky/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-sky/20 rounded-lg flex items-center justify-center">
                    <stat.icon className={`${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <motion.div 
                      className="text-2xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs text-gray-400">{stat.title}</div>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400">{stat.change}</span>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* API Keys Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Keys Table */}
            <motion.div variants={itemVariants}>
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">API Keys</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="glass border-sky/30">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="glass border-sky/30">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockApiKeysWithSentinel.map((key, index) => (
                    <motion.div
                      key={key.id}
                      className="flex items-center justify-between p-4 glass-dark rounded-lg cursor-pointer"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(52, 155, 240, 0.05)" }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky to-coral rounded-lg flex items-center justify-center">
                          <Key className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="font-medium">{key.keyName}</div>
                          <div className="text-sm text-gray-400 font-mono flex items-center space-x-2">
                            <span>
                              {key.sentinelKey !== "Not created" ? 
                                `${key.sentinelKey.slice(0, 15)}*****` : 
                                "No sentinel key"
                              }
                            </span>
                            {key.sentinelKey !== "Not created" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(key.sentinelKey)}
                                className="p-1 h-auto"
                                data-testid={`button-copy-key-${index}`}
                              >
                                <Copy className="w-3 h-3 text-gray-400 hover:text-white" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-sky">{key.todayRequests} requests</div>
                          <div className="text-xs text-gray-400">Today</div>
                        </div>
                        <motion.div 
                          className={`w-3 h-3 rounded-full ${
                            key.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                          }`}
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Usage Analytics Chart */}
            <motion.div variants={itemVariants}>
              <GlassmorphicCard className="p-6">
                <AnalyticsGraph 
                  data={usageStats?.byDay || []} 
                  title="API Usage Analytics"
                />
              </GlassmorphicCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Status */}
            <motion.div variants={itemVariants}>
              <SecurityStatus />
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div 
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.color.replace('text-', 'bg-')}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.type}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <GlassmorphicCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: Plus, label: "Create Sentinel Key", color: "text-sky" },
                    { icon: Shield, label: "Run Security Scan", color: "text-coral" },
                    { icon: BarChart3, label: "Export Logs", color: "text-sky" },
                    { icon: Filter, label: "Settings", color: "text-coral" }
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      className="w-full p-3 glass-dark rounded-lg text-left text-sm flex items-center space-x-3 transition-all duration-300"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(52, 155, 240, 0.1)" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <action.icon className={`${action.color} flex-shrink-0`} size={16} />
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Key Dialog */}
      <AddKeyDialog 
        open={showAddKeyDialog} 
        onOpenChange={setShowAddKeyDialog} 
      />
    </motion.div>
  );
}
