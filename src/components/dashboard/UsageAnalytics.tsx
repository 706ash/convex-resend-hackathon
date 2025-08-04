import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Generate distinct gradient colors
const generateColorPalette = (numColors: number): string[] => {
  return [
    'from-green-500 to-emerald-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500',
    'from-teal-500 to-cyan-400',
    'from-indigo-500 to-violet-500',
  ].slice(0, numColors);
};

export function UsageAnalytics() {
  const apiKeys = useQuery(api.keys.getApiKeys, undefined);

  if (!apiKeys) return <div>Loading...</div>;

  const colors = generateColorPalette(apiKeys.length);

  const chartData = apiKeys.map((key, index) => ({
    name: key.name,
    requests: key.requests,
    color: colors[index % colors.length],
  }));

  const maxRequests = Math.max(...chartData.map((d) => d.requests), 1);
  const totalRequests = chartData.reduce((sum, d) => sum + d.requests, 0);
  const topKey = chartData.reduce((prev, curr) => curr.requests > prev.requests ? curr : prev, chartData[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">API Usage by Key Name</h3>
            <p className="text-slate-400 text-sm">Request distribution across your API keys</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>+15% this week</span>
        </div>
      </div>

      {/* Histogram */}
      <div className="relative h-64 mb-6 bg-slate-900/30 rounded-lg p-4">
        <div className="h-full flex items-end justify-center gap-8">
          {chartData.map((data, index) => {
            // Calculate height as percentage of container
            const heightPercentage = maxRequests > 0 ? (data.requests / maxRequests) * 100 : 0;
            const minHeight = data.requests > 0 ? Math.max(heightPercentage, 5) : 0; // Minimum 5% height for non-zero values
            
            return (
              <div key={data.name} className="flex flex-col items-center group relative min-w-0 flex-1 max-w-24">
                {/* Bar Container */}
                <div className="relative w-full h-48 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${minHeight}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                    className={`w-full bg-gradient-to-t ${data.color} rounded-t-lg border-t border-x border-slate-600/50 min-h-1 relative`}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 border border-slate-700">
                      {data.requests} requests
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-slate-900"></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Label */}
                <span className="text-xs text-slate-400 mt-2 text-center truncate w-full px-1" title={data.name}>
                  {data.name}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* No data message */}
        {chartData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
            No API keys found
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-700/50 pt-4">
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold">{topKey?.name || 'N/A'}</div>
          <div className="text-slate-400 text-xs">Top Key</div>
        </div>
        <div className="text-center">
          <div className="text-purple-400 text-xl font-bold">{totalRequests.toLocaleString()}</div>
          <div className="text-slate-400 text-xs">Total Requests</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 text-xl font-bold">{chartData.length}</div>
          <div className="text-slate-400 text-xs">Active Keys</div>
        </div>
      </div>
    </motion.div>
  );
}