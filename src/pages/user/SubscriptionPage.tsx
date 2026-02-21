import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { subscriptionApi } from '@/api/subscriptions';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'gold',
      name: 'Gold',
      price: 0,
      color: 'from-amber-200 via-yellow-400 to-amber-500',
      text: 'text-amber-900',
      icon: Shield,
      features: ['Standard Priority', 'Access Nearest Technicians', 'Unlimited Service Requests', 'Pay Per Visit (₹200)'],
      highlight: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 399,
      color: 'from-blue-400 via-indigo-500 to-purple-600',
      text: 'text-white',
      icon: Star,
      features: ['High Priority Status', '2 Free Visits / Month', 'No Cancellation Penalty', 'Unlimited Service Requests'],
      highlight: true,
      badge: 'BEST VALUE'
    },
    {
      id: 'premium_pro',
      name: 'Premium Pro',
      price: 999,
      color: 'from-slate-900 via-indigo-900 to-slate-900',
      text: 'text-white',
      icon: Crown,
      features: ['Top Priority (VIP)', '6 Free Visits / Month', 'No Cancellation Penalty', 'Dedicated Support'],
      highlight: false,
      cosmic: true,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) return navigate('/login');
    if (planId === 'gold') return;

    setLoading(planId);
    try {

      await subscriptionApi.buy(planId);
      await refreshProfile();
      toast({ title: 'Welcome to the Club!', description: `You are now a ${planId.replace('_', ' ').toUpperCase()} member.` });
      setLoading(null);
    } catch (error: any) {
      toast({ title: 'Subscription Failed', description: error.response?.data?.message || 'Something went wrong', variant: 'destructive' });
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative overflow-hidden">
      { }
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-fuchsia-300/20 rounded-full blur-[100px] -z-10" />

      { }
      <div className="text-center pt-16 md:pt-20 pb-12 md:pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-gray-800 tracking-wide uppercase">Unlock Premium Features</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter mb-6"
        >
          Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Lifestyle.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
        >
          Choose a plan that fits your home needs. Priority service, exclusive discounts, and peace of mind.
        </motion.p>
      </div>

      { }

      { }
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -10 }}
            className={`relative p-1 rounded-[2.5rem] ${plan.highlight ? 'ring-4 ring-amber-400/30 z-10 scale-105' : ''}`}
          >
            { }
            <div className={`relative h-full rounded-[2.3rem] overflow-hidden p-8 flex flex-col ${plan.cosmic ? 'bg-slate-900 text-white' : 'bg-white border border-gray-100 text-gray-900 shadow-xl shadow-indigo-500/5'
              }`}>
              {plan.cosmic && (
                <>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />
                </>
              )}

              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-[10px] font-black px-3 py-1 rounded-b-lg tracking-widest uppercase shadow-lg shadow-amber-500/20">
                  {plan.badge}
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${plan.color} shadow-lg`}>
                <plan.icon className={`h-8 w-8 ${plan.text === 'text-white' ? 'text-white' : 'text-gray-900'}`} />
              </div>

              <h3 className={`text-2xl font-black mb-2 ${plan.cosmic ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-black ${plan.cosmic ? 'text-white' : 'text-gray-900'}`}>₹{plan.price}</span>
                <span className={`text-sm font-bold opacity-60 ${plan.cosmic ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${plan.cosmic ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-sm font-medium leading-relaxed ${plan.cosmic ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || user?.subscription?.plan === plan.id}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${plan.cosmic
                  ? 'bg-white text-slate-900 hover:bg-gray-100 shadow-lg shadow-white/10'
                  : plan.highlight
                    ? 'bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-xl hover:shadow-black/20'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {loading === plan.id ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : user?.subscription?.plan === plan.id ? (
                  'Current Plan'
                ) : (
                  <>
                    Get Started <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
