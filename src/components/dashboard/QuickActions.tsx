import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Settings, Shield, Key, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuickActionsProps {
  onAddKey: () => void;
  onSecurityScan: () => void;
}

export function QuickActions({ onAddKey, onSecurityScan }: QuickActionsProps) {
  const actions = [
    {
      label: 'Add New Key',
      icon: Plus,
      variant: 'primary' as const,
      onClick: onAddKey
    },
    {
      label: 'Export Data',
      icon: Download,
      variant: 'secondary' as const,
      onClick: () => console.log('Export data')
    },
    {
      label: 'Security Settings',
      icon: Shield,
      variant: 'ghost' as const,
      onClick: onSecurityScan
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      variant: 'ghost' as const,
      onClick: () => console.log('View analytics')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Settings className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-white font-semibold">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={action.variant}
              size="sm"
              icon={action.icon}
              onClick={action.onClick}
              className="w-full justify-start"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}