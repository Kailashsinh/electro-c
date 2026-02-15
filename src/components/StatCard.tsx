import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
  className?: string; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, delay = 0, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className="w-24 h-24 text-current rotate-12" />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
          </div>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="p-3.5 rounded-xl bg-white/30 backdrop-blur-md shadow-sm text-gray-900 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-gray-900" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
