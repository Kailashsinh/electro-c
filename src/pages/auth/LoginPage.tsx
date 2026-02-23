import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { Zap, Eye, EyeOff, Shield, Wrench, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ParticleBackground from '@/components/ParticleBackground';

const LoginPage: React.FC = () => {
  const [roleTab, setRoleTab] = useState<UserRole>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (roleTab === 'user') {
        res = await authApi.loginUser({ identifier, password });
      } else if (roleTab === 'technician') {
        res = await authApi.loginTechnician({ identifier, password });
      } else {
        res = await authApi.loginAdmin({ email: identifier, password });
      }
      const { token, user: userData, technician, admin } = res.data;
      const u = userData || technician || admin;
      login(token, u, roleTab);
      navigate(`/${roleTab}/dashboard`);
    } catch (err: any) {
      if (err.response?.status === 403 && (err.response?.data?.message?.toLowerCase().includes('verify') || err.response?.data?.message?.toLowerCase().includes('email'))) {
        toast({
          title: 'Verification Required',
          description: 'Redirecting to verification page...',
          variant: 'destructive',
        });
        setTimeout(() => {
          navigate(`/verify-email?email=${identifier}&role=${roleTab}`);
        }, 1500);
        return;
      }
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles: { key: UserRole; label: string }[] = [
    { key: 'user', label: 'User' },
    { key: 'technician', label: 'Technician' },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#fdfdff]">
      {/* Dynamic Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] opacity-30 blur-[130px]"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Left side: Branding & Visuals (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-20 pointer-events-none">
        <div className="relative z-10 max-w-xl">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, type: "spring" }}>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12">
                <Zap className="h-8 w-8 text-white fill-white" />
              </div>
              <span className="text-4xl font-black text-slate-950 tracking-tighter uppercase italic">ElectroCare</span>
            </div>

            <h2 className="text-7xl font-black text-slate-950 leading-[0.85] tracking-tight uppercase italic mb-8">
              Welcome to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-300% animate-gradient">Future of service.</span>
            </h2>

            <p className="text-xl font-bold text-slate-500 max-w-md leading-relaxed mb-16 italic">
              Access the most advanced field intelligence platform for home maintenance.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, text: 'SECURE AUTHENTICATION', color: 'text-indigo-600' },
                { icon: Clock, text: 'REAL-TIME DASHBOARD', color: 'text-violet-600' },
                { icon: Wrench, text: 'SMART RESOURCE ALLOCATION', color: 'text-fuchsia-600' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  className="flex items-center gap-6 group"
                >
                  <div className="p-4 rounded-2xl bg-white shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <span className="text-sm font-black text-slate-950 tracking-[0.2em]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side: Modern Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo for mobile only */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">ElectroCare</span>
          </div>

          <div className="glass-premium p-10 md:p-14 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-white/40">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />

            <div className="mb-12 text-center lg:text-left">
              <h1 className="text-4xl font-black text-slate-950 tracking-[-0.04em] uppercase italic mb-2">Identify.</h1>
              <p className="text-slate-500 font-bold italic">Secure entry into the ecosystem</p>
            </div>

            {/* Role Switcher - Redesigned */}
            <div className="flex bg-slate-200/50 p-2 rounded-2xl mb-10">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRoleTab(r.key)}
                  className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 relative ${roleTab === r.key
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {roleTab === r.key && (
                    <motion.div
                      layoutId="activeTabLogin"
                      className="absolute inset-0 bg-slate-950 rounded-xl shadow-xl"
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                  )}
                  <span className="relative z-10">{r.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={roleTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">
                    {roleTab === 'admin' ? 'E-MAIL' : 'IDENTIFIER'}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                      placeholder={roleTab === 'admin' ? 'admin@electrocare.co' : 'Email or Phone Number'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">PASSWORD</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 pr-14"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="remember" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keep Session</label>
                  </div>
                  {roleTab !== 'admin' && (
                    <Link to={`/forgot-password?role=${roleTab}`} className="text-xs font-black text-indigo-600 hover:text-fuchsia-600 transition-colors uppercase tracking-wider">
                      Lost Code?
                    </Link>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em]"
                >
                  {loading ? (
                    <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Initiate Login'
                  )}
                </button>
              </motion.form>
            </AnimatePresence>

            {roleTab !== 'admin' && (
              <div className="mt-12 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">New to the system?</p>
                <Link to={`/register?role=${roleTab}`}>
                  <button className="w-full h-14 rounded-2xl border-2 border-slate-950 text-slate-950 font-black uppercase italic tracking-widest hover:bg-slate-950 hover:text-white transition-all duration-500 active:scale-95">
                    Create Identity
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
