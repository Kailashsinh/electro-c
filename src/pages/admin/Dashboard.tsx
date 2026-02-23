import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/admin';
import { Users, Wrench, Activity, IndianRupee } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={4} />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Technicians', value: stats?.totalTechnicians || 0, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Active Requests', value: stats?.activeRequests || 0, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-12 relative overflow-hidden pb-10">
      {/* Aurora Background for Admin HUD */}
      <div className="absolute top-0 right-0 -z-10 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-[30%] h-[30%] bg-fuchsia-500/5 blur-[100px] rounded-full" />

      {/* Control Hub Header */}
      <div className="glass-premium rounded-[2.5rem] p-10 border-white/60 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Activity className="h-32 w-32 text-indigo-600" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Operational Status: Nominal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Ops Center</span>
          </h1>
          <p className="text-slate-500 font-bold italic">
            Command & Control Interface. System-wide telemetry synchronized at: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Main Stats HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-premium p-8 rounded-[2rem] border-white/60 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <card.icon className="h-24 w-24 text-indigo-600" />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} border-2 border-white shadow-lg`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                  <p className="text-4xl font-black text-slate-950 italic mt-1">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Strategic Actions Matrix */}
      <div className="glass-premium rounded-[3rem] border-white/60 shadow-2xl p-10 overflow-hidden relative">
        <div className="absolute bottom-0 right-0 p-10 opacity-[0.02]">
          <Activity className="h-40 w-40" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-black text-slate-950 uppercase italic mb-8 flex items-center gap-3">
            Strategic Protocols
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="h-14 px-8 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1">
              Initialize Data Export
            </button>
            <button className="h-14 px-8 bg-white text-slate-950 border-2 border-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
              Audit System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
