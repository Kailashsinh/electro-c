import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { serviceRequestApi } from '@/api/serviceRequests';
import { subscriptionApi } from '@/api/subscriptions';
import { applianceApi } from '@/api/appliances';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { ClipboardList, Wrench, CreditCard, Star, ArrowRight, Sparkles, Plus, Zap, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatCard from '@/components/ChatCard';
import { AnimatePresence } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [appliances, setAppliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [reqRes, subRes, appRes] = await Promise.allSettled([
          serviceRequestApi.getMyRequests(),
          subscriptionApi.getMy(),
          applianceApi.getMyAppliances(),
        ]);
        if (reqRes.status === 'fulfilled') setRequests(reqRes.value.data?.requests || reqRes.value.data || []);
        if (subRes.status === 'fulfilled') setSubscription(subRes.value.data?.subscription || subRes.value.data);
        if (appRes.status === 'fulfilled') setAppliances(appRes.value.data?.appliances || appRes.value.data || []);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  const activeRequests = requests.filter((r: any) => !['completed', 'cancelled'].includes(r.status));

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background Overlay for Dashboard Content Area */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="space-y-12 pb-20">
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              System Status: Running Smoothly
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-[-0.04em] uppercase italic leading-none">
              Welcome, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-300% animate-gradient">
                {user?.name?.split(' ')[0]}.
              </span>
            </h1>
            <p className="text-slate-500 mt-4 font-bold italic text-lg">Welcome to your home dashboard.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            <Link
              to="/user/requests/new"
              className="group h-16 px-8 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 text-lg"
            >
              New Request <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* HUD Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ongoing Requests"
            value={activeRequests.length}
            icon={Zap}
            delay={0}
            className="glass-premium border-indigo-100/50 hover:border-indigo-500/30 shadow-indigo-500/5"
          />
          <StatCard
            title="My Appliances"
            value={appliances.length}
            icon={Wrench}
            delay={0.1}
            className="glass-premium border-fuchsia-100/50 hover:border-fuchsia-500/30 shadow-fuchsia-500/5"
          />
          <StatCard
            title="Trust Score"
            value={user?.loyalty_points || 0}
            icon={Star}
            delay={0.2}
            className="glass-premium border-emerald-100/50 hover:border-emerald-500/30 shadow-emerald-500/5"
          />
          <StatCard
            title="Total Requests"
            value={requests.length}
            icon={ClipboardList}
            delay={0.3}
            className="glass-premium border-slate-200 hover:border-slate-400 shadow-slate-500/5"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed: Active Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase italic flex items-center gap-3">
                <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                Your Recent Requests
              </h2>
              <Link to="/user/requests" className="text-xs font-black text-indigo-600 hover:text-fuchsia-600 transition-colors uppercase tracking-[0.2em] flex items-center gap-2 italic">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {activeRequests.length === 0 ? (
              <div className="glass-premium p-16 text-center border-dashed border-2 border-slate-200 bg-white/40">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mx-auto mb-6 rotate-12">
                  <ClipboardList className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight">No Active Requests Found</h3>
                <p className="text-slate-500 mt-3 mb-8 max-w-sm mx-auto font-bold italic">The home environment is stable. Initialize a request if maintenance is required.</p>
                <Link to="/user/requests/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-950 transition-all shadow-xl shadow-indigo-500/20">
                  Create Request
                </Link>
              </div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-6">
                {activeRequests.slice(0, 4).map((req: any, i: number) => (
                  <motion.div
                    key={req._id || i}
                    variants={item}
                    className="group relative glass-premium p-6 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-white/60"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                          <Zap className="h-8 w-8 fill-indigo-600/10" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight truncate max-w-[200px] md:max-w-md">{req.issue_desc || 'Service Request'}</h3>
                            <StatusBadge status={req.status} />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            Scheduled for {req.preferred_slot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-auto md:ml-0">
                        {req.technician_id && ['accepted', 'on_the_way', 'awaiting_approval', 'approved', 'in_progress'].includes(req.status) && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveChat(req._id);
                            }}
                            className="h-12 px-5 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Chat
                          </button>
                        )}
                        <Link to={`/user/requests/${req._id}`} className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white transition-all duration-300">
                          <ArrowRight className="h-6 w-6" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Side Panel: Membership Card & Quick Diagnostics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase italic flex items-center gap-3">
                <span className="w-2 h-6 bg-fuchsia-600 rounded-full" />
                Membership Plan
              </h2>

              <div className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-indigo-950 animate-gradient bg-300% rounded-[2.5rem]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-[2.5rem]" />

                <div className="relative p-10 h-full flex flex-col justify-between min-h-[300px]">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-3xl border border-white/20">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Premium Member</span>
                      </div>
                      <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        {subscription?.plan || 'Standard'}
                      </h3>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center">
                      <CreditCard className="h-7 w-7 text-white" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${subscription ? 'bg-emerald-400/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                        <Zap className="h-5 w-5 fill-current" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Subscription Status</p>
                        <p className="text-sm font-bold text-white capitalize">{subscription ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>

                    <Link
                      to="/user/subscription"
                      className="h-14 w-full bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95 shadow-2xl"
                    >
                      {subscription ? 'Change Plan' : 'Get Premium'} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Diagnosis CTA */}
            <div className="glass-premium p-8 border-indigo-200 bg-indigo-50/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-950 uppercase italic leading-tight">AI Troubleshooter</h3>
              </div>
              <p className="text-xs font-bold text-slate-500 italic mb-6 leading-relaxed">
                Is something not working? Try our AI helper for quick solutions.
              </p>
              <Link to="/user/troubleshooter" className="text-xs font-black text-indigo-600 hover:text-fuchsia-600 uppercase tracking-widest transition-colors flex items-center gap-2 italic">
                Start Troubleshooting <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveChat(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <ChatCard
                requestId={activeChat}
                currentUserId={user?._id || ''}
                currentUserRole="user"
                onClose={() => setActiveChat(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
