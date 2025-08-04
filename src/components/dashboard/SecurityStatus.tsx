import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, FileText } from 'lucide-react';

interface SecurityMetric {
  label: string;
  status: 'good' | 'warning' | 'error';
  icon: React.ReactNode;
}

export function SecurityStatus() {
  const securityMetrics: SecurityMetric[] = [
    {
      label: 'Encryption',
      status: 'good',
      icon: <Lock className="w-4 h-4" />
    },
    {
      label: 'Access Control',
      status: 'good',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Audit Trail',
      status: 'good',
      icon: <FileText className="w-4 h-4" />
    },
    {
      label: 'Anomaly Detection',
      status: 'warning',
      icon: <AlertTriangle className="w-4 h-4" />
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Shield className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Security Status</h3>
          <p className="text-slate-400 text-sm">Threat Level: <span className="text-green-400">Low</span></p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="text-slate-400">
                {metric.icon}
              </div>
              <span className="text-slate-300 text-sm">{metric.label}</span>
            </div>
            {getStatusIcon(metric.status)}
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">Security Score</span>
          <span className="text-blue-400 text-sm">98/100</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '98%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
          />
        </div>
        <p className="text-slate-400 text-xs mt-2">Excellent security posture</p>
      </div>
    </motion.div>
  );
}