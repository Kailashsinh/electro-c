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
    <div className="min-h-screen flex relative overflow-hidden">
      {}
      <div className="hidden lg:flex lg:w-1/2 relative section-gradient-bg items-center justify-center p-12">
        <ParticleBackground />
        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">ElectroCare</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Your appliances deserve <span className="gradient-text">the best care</span>
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Professional repair and maintenance platform connecting you with verified technicians.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Shield, text: 'Verified & Trusted Technicians' },
                { icon: Clock, text: 'Real-time Service Tracking' },
                { icon: Wrench, text: 'All Major Appliances Covered' },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 relative">
        {}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ElectroCare</span>
          </div>

          <div className="glass-card p-8 relative overflow-hidden">
            {}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome back</h1>
            <p className="text-gray-500 text-center text-sm mb-8">Sign in to your account to continue</p>

            {}
            <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-8">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRoleTab(r.key)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative ${roleTab === r.key
                    ? 'text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {roleTab === r.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {roleTab === 'admin' ? 'Email' : 'Email or Phone'}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="input-field"
                    placeholder={roleTab === 'admin' ? 'admin@electrocare.com' : 'Enter email or phone'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="input-field pr-10"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {roleTab !== 'admin' && (
                  <div className="text-right">
                    <Link to={`/forgot-password?role=${roleTab}`} className="text-sm text-primary hover:underline font-medium">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                  Sign in
                </button>
              </motion.form>
            </AnimatePresence>

            {roleTab !== 'admin' && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <Link to={`/register?role=${roleTab}`} className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
