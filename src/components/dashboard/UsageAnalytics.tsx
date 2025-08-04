import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';

export function UsageAnalytics() {
  const chartData = [
    { day: 'Mon', requests: 2 },
    { day: 'Tue', requests: 4 },
    { day: 'Wed', requests: 3 },
    { day: 'Thu', requests: 6 },
    { day: 'Fri', requests: 5 },
    { day: 'Sat', requests: 4 },
    { day: 'Sun', requests: 6 }
  ];

  const maxRequests = Math.max(...chartData.map(d => d.requests));

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
            <h3 className="text-white font-semibold">API Usage Analytics</h3>
            <p className="text-slate-400 text-sm">Weekly overview</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Infinity%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between h-32 space-x-2">
          {chartData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center space-y-2 flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.requests / maxRequests) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t min-h-[4px] w-full"
              />
              <span className="text-slate-400 text-xs">{data.day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <div className="text-blue-400 text-xl font-bold">6</div>
            <div className="text-slate-400 text-xs">Peak Day</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 text-xl font-bold">6</div>
            <div className="text-slate-400 text-xs">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold">6</div>
            <div className="text-slate-400 text-xs">Daily Average</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}