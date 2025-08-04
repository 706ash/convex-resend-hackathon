import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';

export function UsageAnalytics() {
  // Changed from days to API providers
  const chartData = [
    { provider: 'OpenAI', requests: 12, color: 'from-green-500 to-emerald-500' },
    { provider: 'Gemini', requests: 8, color: 'from-blue-500 to-cyan-500' },
    { provider: 'Claude', requests: 6, color: 'from-purple-500 to-pink-500' },
    { provider: 'Anthropic', requests: 4, color: 'from-orange-500 to-red-500' },
    { provider: 'Cohere', requests: 2, color: 'from-yellow-500 to-amber-500' }
  ];

  const maxRequests = Math.max(...chartData.map(d => d.requests));
  const totalRequests = chartData.reduce((sum, d) => sum + d.requests, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">API Usage by Provider</h3>
            <p className="text-slate-400 text-sm">Request distribution across providers</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+15% this week</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 space-x-3">
          {chartData.map((data, index) => (
            <div key={data.provider} className="flex flex-col items-center space-y-2 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.requests / maxRequests) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-gradient-to-t ${data.color} rounded-t min-h-[4px] w-full relative group`}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {data.requests} requests
                </div>
              </motion.div>
              <span className="text-slate-400 text-xs text-center leading-tight">
                {data.provider}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold">
              {Math.max(...chartData.map(d => d.requests))}
            </div>
            <div className="text-slate-400 text-xs">Top Provider</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 text-xl font-bold">{totalRequests}</div>
            <div className="text-slate-400 text-xs">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 text-xl font-bold">
              {chartData.length}
            </div>
            <div className="text-slate-400 text-xs">Active Providers</div>
          </div>
        </div>

        {/* Provider breakdown list */}
        <div className="mt-6 space-y-2">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Provider Breakdown</h4>
          {chartData.map((data, index) => (
            <motion.div
              key={data.provider}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${data.color}`} />
                <span className="text-slate-300 text-sm">{data.provider}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">{data.requests} requests</span>
                <span className="text-slate-500 text-xs">
                  ({Math.round((data.requests / totalRequests) * 100)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}