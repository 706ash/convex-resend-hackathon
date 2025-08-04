import React from 'react';
import { motion } from 'framer-motion';
import { Key, BarChart3, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`text-sm ${changeColors[changeType]} flex items-center`}>
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{title}</div>
    </motion.div>
  );
}

export function StatsGrid() {
  const stats = [
    {
      title: 'Active Keys',
      value: 2,
      change: '+2 this week',
      changeType: 'positive' as const,
      icon: <Key className="w-5 h-5 text-blue-400" />,
      color: 'bg-blue-500/20'
    },
    {
      title: 'Requests',
      value: 6,
      change: '+15% today',
      changeType: 'positive' as const,
      icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
      color: 'bg-purple-500/20'
    },
    {
      title: 'Success Rate',
      value: '100%',
      change: 'Optimal',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      color: 'bg-green-500/20'
    },
    {
      title: 'Alerts',
      value: 0,
      change: '0 pending',
      changeType: 'neutral' as const,
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      color: 'bg-yellow-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}