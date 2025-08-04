import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavigationProps {
  onNavigate?: (page: 'home' | 'dashboard') => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' }
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="flex items-center space-x-2">
        <Shield className="w-8 h-8 text-blue-500" />
        <span className="text-xl font-bold text-white">KeySentinel</span>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="text-slate-300 hover:text-white transition-colors duration-200"
          >
            {item.label}
          </a>
        ))}
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate?.('home')}
        >
          Home
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => onNavigate?.('dashboard')}
        >
          Dashboard
        </Button>
      </div>
    </motion.nav>
  );
}