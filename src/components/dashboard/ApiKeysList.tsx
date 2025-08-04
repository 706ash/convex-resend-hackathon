import React from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, MoreVertical, Activity, Edit, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import { useClipboard } from '../../hooks/useClipboard';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  maskedKey: string;
  requests: number;
  status: 'active' | 'inactive';
  lastUsed: string;
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onEdit: (apiKey: ApiKey) => void;
  onViewUsage: (apiKey: ApiKey) => void;
}

function ApiKeyCard({ apiKey, onEdit, onViewUsage }: ApiKeyCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-slate-500'
  };

  const { copied, copyToClipboard } = useClipboard();

  const handleCopy = async () => {
    const success = await copyToClipboard(`sentinel_${apiKey.provider}_${apiKey.id}`);
    if (success) {
      toast.success('Sentinel key copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Key className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{apiKey.name}</h3>
            <p className="text-slate-400 text-sm">{apiKey.provider}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[apiKey.status]}`} />
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <code className="text-slate-300 text-sm bg-slate-700/50 px-2 py-1 rounded">
            {apiKey.maskedKey}
          </code>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className={`w-3 h-3 ${copied ? 'text-green-400' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <div className="text-blue-400 font-semibold">
            {apiKey.requests} requests
          </div>
          <div className="text-slate-400">Today</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onViewUsage(apiKey)}>
            <Eye className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(apiKey)}>
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface ApiKeysListProps {
  onEditKey: (apiKey: ApiKey) => void;
  onViewUsage: (apiKey: ApiKey) => void;
}

export function ApiKeysList({ onEditKey, onViewUsage }: ApiKeysListProps) {
  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'OpenAI GPT-4',
      provider: 'OpenAI',
      maskedKey: 'sentinel_oai_ab*****',
      requests: 1023,
      status: 'active',
      lastUsed: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Gemini Pro',
      provider: 'Google',
      maskedKey: 'sentinel_gem_xy*****',
      requests: 246,
      status: 'active',
      lastUsed: '5 minutes ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">API Keys</h2>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="sm">
            <Key className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ApiKeyCard 
              apiKey={apiKey} 
              onEdit={onEditKey}
              onViewUsage={onViewUsage}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}