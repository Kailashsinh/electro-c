import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/api/auth';
import { Zap, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = role === 'technician' ? authApi.forgotPasswordTechnician : authApi.forgotPasswordUser;
      await fn({ email });
      toast({ title: 'Protocol Initiated', description: 'Access code dispatched to your device.' });
      setStep('reset');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to dispatch code', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = role === 'technician' ? authApi.resetPasswordTechnician : authApi.resetPasswordUser;
      await fn({ email, otp, newPassword });
      toast({ title: 'Identity Restored', description: 'Your new credentials are now active.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Restoration failed', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#fdfdff]">
      {/* Dynamic Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] opacity-30 blur-[130px]"
          animate={{
            background: [
              "radial-gradient(circle at 10% 90%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 90% 10%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 10% 90%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-premium p-10 md:p-14 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-white/40 text-center">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />

            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                <Zap className="h-8 w-8 text-white fill-white" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-950 tracking-[-0.04em] uppercase italic mb-2">
              {step === 'email' ? 'Restore.' : 'Rewrite.'}
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic mb-10">
              {step === 'email' ? 'Identity Recovery Protocol' : 'New credential initialization'}
            </p>

            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">email NUMBER</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ENTER REGISTERED email"
                      className="w-full h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400 placeholder:text-xs tracking-wider"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em] shadow-xl">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Dispatch Code'}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="reset-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleReset}
                  className="space-y-6"
                >
                  <div className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">AUTHENTICATION CODE</label>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        placeholder="••••••"
                        className="w-full h-16 px-6 bg-indigo-50/50 border-2 border-indigo-200 rounded-2xl text-slate-950 font-black text-center tracking-[0.8em] text-2xl focus:outline-none focus:border-indigo-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">NEW PASSWORD</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="INITIATE NEW KEY"
                        className="w-full h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400 placeholder:text-xs"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em] shadow-xl">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'Confirm Rewire'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-12">
              <Link to="/login" className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors italic inline-flex items-center gap-2 group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Return to access point
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
