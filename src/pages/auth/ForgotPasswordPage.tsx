import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '@/api/auth';
import { Zap, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const [step, setStep] = useState<'phone' | 'reset'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = role === 'technician' ? authApi.forgotPasswordTechnician : authApi.forgotPasswordUser;
      await fn({ phone });
      toast({ title: 'OTP sent', description: 'Check your phone for the code' });
      setStep('reset');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to send OTP', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = role === 'technician' ? authApi.resetPasswordTechnician : authApi.resetPasswordUser;
      await fn({ phone, otp, newPassword });
      toast({ title: 'Password reset', description: 'You can now log in with your new password' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Reset failed', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full section-gradient-bg blur-3xl opacity-30" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">ElectroCare</span>
        </div>
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            {step === 'phone' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {step === 'phone' ? 'Enter your phone number to receive an OTP' : 'Enter the OTP and your new password'}
          </p>
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone number" className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <input value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter OTP" className="input-field" />
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="New password" className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                Reset Password
              </button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
