import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuotaMeter } from '../widgets/QuotaMeter';

export function HeroSection() {
  const stats = [
    { value: '99.9%', label: 'Uptime', color: 'text-blue-400' },
    { value: '10M+', label: 'Requests Secured', color: 'text-orange-400' },
    { value: '500ms', label: 'Avg Response', color: 'text-emerald-400' }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.1),transparent)]" />
      
      <div className="relative container mx-auto px-6 py-20 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-slate-300 text-sm">Enterprise-grade security</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Secure Your
              <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                API Keys
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Professional API key management with advanced monitoring, 
              scoped access controls, and real-time security alerts. Built for 
              developers who prioritize security.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={ArrowRight}
                className="text-lg px-8 py-4"
              >
                Get Started Free
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                icon={Play}
                className="text-lg px-8 py-4"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-8 border-t border-slate-700/50">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <QuotaMeter
              provider="OpenAI GPT-4"
              quotaUsed={65}
              requestsToday={1247}
              successRate={98.2}
              status="active"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}