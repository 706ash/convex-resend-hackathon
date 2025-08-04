import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : {}}
      className={clsx(
        'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6',
        hoverable && 'hover:border-slate-600/50 transition-colors duration-200',
        className
      )}
    >
      {children}
    </motion.div>
  );
}