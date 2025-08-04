import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

interface QuotaMeterProps {
  provider: string;
  quotaUsed: number;
  requestsToday: number;
  successRate: number;
  status: 'active' | 'inactive' | 'warning';
}

export function QuotaMeter({
  provider,
  quotaUsed,
  requestsToday,
  successRate,
  status
}: QuotaMeterProps) {
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-slate-500',
    warning: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 max-w-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <span className="text-slate-400 text-sm">API Key Monitor</span>
        </div>
        <span className="text-blue-400 text-sm capitalize">{status}</span>
      </div>
      
      <h3 className="text-white text-lg font-semibold mb-3">{provider}</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Quota Used</span>
          <span className="text-slate-300 text-sm">{quotaUsed}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${quotaUsed}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-blue-500 h-2 rounded-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-orange-400 text-2xl font-bold">{requestsToday.toLocaleString()}</div>
          <div className="text-slate-400 text-xs">Requests Today</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-blue-400 text-2xl font-bold">{successRate}%</div>
          <div className="text-slate-400 text-xs">Success Rate</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center">
        <Activity className="w-4 h-4 text-slate-500" />
      </div>
    </motion.div>
  );
}