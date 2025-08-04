import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, AlertTriangle, Shield, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'key_created' | 'rate_limit' | 'security_scan' | 'anomaly';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'key_created',
      message: 'New API key created',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'rate_limit',
      message: 'Rate limit exceeded',
      timestamp: '5 minutes ago',
      status: 'warning'
    },
    {
      id: '3',
      type: 'security_scan',
      message: 'Security scan completed',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'anomaly',
      message: 'Anomaly detected',
      timestamp: '3 hours ago',
      status: 'warning'
    }
  ];

  const getActivityIcon = (type: string, status: string) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
      case 'key_created':
        return <Plus className={`${iconClass} text-green-400`} />;
      case 'rate_limit':
        return <Clock className={`${iconClass} text-yellow-400`} />;
      case 'security_scan':
        return <Shield className={`${iconClass} text-blue-400`} />;
      case 'anomaly':
        return <AlertTriangle className={`${iconClass} text-yellow-400`} />;
      default:
        return <Activity className={`${iconClass} text-slate-400`} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {getActivityIcon(activity.type, activity.status)}
                <span className="text-slate-300 text-sm">{activity.message}</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">{activity.timestamp}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}