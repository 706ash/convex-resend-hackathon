import { motion } from "framer-motion";
import { useMemo } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface DataPoint {
  date: string;
  count: number;
  label?: string;
}

interface AnalyticsGraphProps {
  data?: DataPoint[];
  title?: string;
  className?: string;
}

export default function AnalyticsGraph({ 
  data, 
  title = "API Usage Analytics",
  className = ""
}: AnalyticsGraphProps) {
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Generate realistic usage data for the last 30 days
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create more realistic usage patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseUsage = isWeekend ? 300 : 800;
      const variance = Math.random() * 400 - 200;
      const count = Math.max(50, Math.floor(baseUsage + variance));
      
      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return days;
  }, [data]);

  const maxValue = Math.max(...chartData.map(item => item.count));
  const minValue = Math.min(...chartData.map(item => item.count));
  const avgValue = chartData.reduce((sum, item) => sum + item.count, 0) / chartData.length;
  
  // Calculate trend (last 7 days vs previous 7 days)
  const recent7Days = chartData.slice(-7);
  const previous7Days = chartData.slice(-14, -7);
  const recentAvg = recent7Days.reduce((sum, item) => sum + item.count, 0) / 7;
  const previousAvg = previous7Days.reduce((sum, item) => sum + item.count, 0) / 7;
  const trendPercentage = ((recentAvg - previousAvg) / previousAvg) * 100;
  const isPositiveTrend = trendPercentage > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-sky" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-sky">{Math.round(avgValue).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Avg/Day</div>
          </div>
          <div className="flex items-center space-x-1">
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${
              isPositiveTrend ? 'text-green-400' : 'text-red-400'
            }`}>
              {Math.abs(trendPercentage).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>{maxValue.toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.75).toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxValue * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-64 flex items-end justify-between space-x-1 px-2 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="border-t border-gray-700/30 w-full"
                style={{ opacity: i === 4 ? 0 : 0.3 }}
              />
            ))}
          </div>

          {/* Bars */}
          {chartData.map((item, index) => {
            const height = (item.count / maxValue) * 100;
            const isRecent = index >= chartData.length - 7;
            
            return (
              <div key={item.date} className="flex flex-col items-center space-y-2 flex-1 group relative">
                {/* Tooltip */}
                <motion.div
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-glass-dark px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-max"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  <div className="text-white font-medium">{item.count.toLocaleString()} requests</div>
                  <div className="text-gray-400">{item.label || item.date}</div>
                </motion.div>

                {/* Bar */}
                <motion.div
                  className={`w-full rounded-t-sm relative overflow-hidden ${
                    isRecent 
                      ? "bg-gradient-to-t from-sky to-coral" 
                      : "bg-gradient-to-t from-sky/60 to-coral/60"
                  }`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.03,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    filter: "brightness(1.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                    initial={{ y: "100%" }}
                    animate={{ y: "-100%" }}
                    transition={{
                      duration: 2,
                      delay: index * 0.05 + 1,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Pulse effect for recent data */}
                  {isRecent && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{
                        duration: 2,
                        delay: index * 0.1 + 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  )}
                </motion.div>
                
                {/* X-axis label */}
                <motion.span 
                  className="text-xs text-gray-400 transform -rotate-45 origin-center whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.02 + 1.5 }}
                >
                  {index % 3 === 0 ? item.date : ''}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/30">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="text-lg font-bold text-green-400">{maxValue.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Peak Day</div>
        </motion.div>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1 }}
        >
          <div className="text-lg font-bold text-coral">
            {chartData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Requests</div>
        </motion.div>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <div className="text-lg font-bold text-sky">{Math.round(avgValue).toLocaleString()}</div>
          <div className="text-xs text-gray-400">Daily Average</div>
        </motion.div>
      </div>
    </div>
  );
}