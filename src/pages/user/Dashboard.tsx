import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { serviceRequestApi } from '@/api/serviceRequests';
import { subscriptionApi } from '@/api/subscriptions';
import { applianceApi } from '@/api/appliances';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { ClipboardList, Wrench, CreditCard, Star, ArrowRight, Sparkles, Plus, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [appliances, setAppliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="relative space-y-10">
      {}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-500 mt-2 text-base md:text-lg">Your home appliances, perfectly managed.</p>
        </div>
        <Link
          to="/user/requests/new"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-xl shadow-indigo-500/20 hover:bg-gray-800 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95 w-full md:w-auto"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md" />
          <Plus className="h-5 w-5" />
          <span>New Request</span>
        </Link>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={ClipboardList}
          delay={0}
          className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-200 border-blue-200 hover:border-blue-300 shadow-blue-500/10"
        />
        <StatCard
          title="Active"
          value={activeRequests.length}
          icon={Sparkles}
          delay={0.1}
          className="bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-200 border-amber-200 hover:border-amber-300 shadow-amber-500/10"
        />
        <StatCard
          title="Appliances"
          value={appliances.length}
          icon={Wrench}
          delay={0.2}
          className="bg-gradient-to-br from-emerald-100 via-green-50 to-teal-200 border-emerald-200 hover:border-emerald-300 shadow-emerald-500/10"
        />
        <StatCard
          title="Loyalty Points"
          value={user?.loyalty_points || 0}
          icon={Star}
          delay={0.3}
          className="bg-gradient-to-br from-purple-100 via-fuchsia-50 to-pink-200 border-purple-200 hover:border-purple-300 shadow-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Active Requests
            </h2>
            <Link to="/user/requests" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {activeRequests.length === 0 ? (
            <div className="glass-card p-12 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No active requests</h3>
              <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">Need a repair or service? Book a new request and track it here.</p>
              <Link to="/user/requests/new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Book a Service &rarr;
              </Link>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {activeRequests.slice(0, 3).map((req: any, i: number) => (
                <motion.div
                  key={req._id || i}
                  variants={item}
                  className="group relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/50 px-5 py-4 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                        <Wrench className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{req.issue_desc || 'General Service'}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                          {req.preferred_slot}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <StatusBadge status={req.status} />
                      <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              My Membership
            </h2>
          </div>

          {}
          <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(120deg,#4c1d95,#9f1239,#92400e,#065f46)] text-white p-1 shadow-2xl shadow-gray-900/50 group transform transition-all hover:scale-[1.01]">

            {}
            <div className="relative h-full bg-black/40 backdrop-blur-xl rounded-[22px] p-7 overflow-hidden border border-white/10">
              {}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-600/40 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 backdrop-blur-md mb-3 shadow-sm">
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Premium Access</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 capitalize drop-shadow-md">
                      {subscription?.plan || 'Free Plan'}
                    </h3>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${subscription ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/50'}`}>
                      <Zap className="h-4 w-4 fill-current" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">Status</p>
                      <p className="text-xs text-white/60">{subscription ? 'Active & Valid' : 'Inactive'}</p>
                    </div>
                  </div>

                  <Link
                    to="/user/subscription"
                    className="relative block w-full py-3.5 px-4 bg-white/10 border border-white/20 text-white text-center rounded-xl font-bold text-sm hover:bg-white/20 hover:scale-[1.02] transition-all active:scale-95 overflow-hidden group/btn backdrop-blur-md"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {subscription ? 'Manage Membership' : 'Upgrade Now'} <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
