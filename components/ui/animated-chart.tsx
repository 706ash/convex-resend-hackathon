import { motion } from "framer-motion";
import { useMemo } from "react";

interface ChartData {
  date: string;
  count: number;
}

interface AnimatedChartProps {
  data: ChartData[];
}

export default function AnimatedChart({ data }: AnimatedChartProps) {
  const mockData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Generate mock data for 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      date: day,
      count: Math.floor(Math.random() * 800) + 200,
    }));
  }, [data]);

  const maxValue = Math.max(...mockData.map(item => item.count));

  return (
    <div className="h-64 flex items-end justify-between space-x-2 px-4">
      {mockData.map((item, index) => {
        const height = (item.count / maxValue) * 100;
        
        return (
          <div key={item.date} className="flex flex-col items-center space-y-2 flex-1">
            <motion.div
              className="w-full bg-gradient-to-t from-sky to-coral rounded-t relative overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(52, 155, 240, 0.3)"
              }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                initial={{ y: "100%" }}
                animate={{ y: "-100%" }}
                transition={{
                  duration: 2,
                  delay: index * 0.3 + 1,
                  ease: "easeInOut"
                }}
              />
              
              {/* Tooltip on hover */}
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-glass-dark px-2 py-1 rounded text-xs opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
              >
                {item.count}
              </motion.div>
            </motion.div>
            
            <motion.span 
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
            >
              {item.date}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
