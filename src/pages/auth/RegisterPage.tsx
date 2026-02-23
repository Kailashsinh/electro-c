import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { Zap, Shield, Wrench, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ParticleBackground from '@/components/ParticleBackground';

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleParam = (searchParams.get('role') as UserRole) || 'user';
  const [roleTab, setRoleTab] = useState<'user' | 'technician'>(roleParam === 'technician' ? 'technician' : 'user');

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '', skills: '', latitude: 0, longitude: 0 });
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Error', description: 'Geolocation is not supported by your browser', variant: 'destructive' });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast({ title: 'Success', description: 'Coordinates securely acquired.' });
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        toast({ title: 'Error', description: 'Unable to retrieve your location', variant: 'destructive' });
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (roleTab === 'user') {
        await authApi.registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password, address: form.address });
      } else {
        const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);

        if (form.latitude === 0 && form.longitude === 0) {
          toast({ title: 'Location Required', description: 'Strategic positioning is required for technicians.', variant: 'destructive' });
          setLoading(false);
          return;
        }

        await authApi.registerTechnician({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          skills,
          latitude: form.latitude,
          longitude: form.longitude
        });
      }

      setShowOtp(true);
      toast({ title: 'Protocol Initiated', description: 'Security code dispatched to your email.' });

    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.response?.data?.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (roleTab === 'user') {
        res = await authApi.verifyEmailUser({ email: form.email, otp });
      } else {
        res = await authApi.verifyEmailTechnician({ email: form.email, otp });
      }

      const { token, user: userData, technician } = res.data;
      const u = userData || technician;

      login(token, u, roleTab);
      toast({ title: 'Identity Verified!', description: 'Welcome to the ElectroCare network.' });
      navigate(`/${roleTab}/dashboard`);

    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.response?.data?.message || 'Invalid OTP', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#fdfdff]">
      {/* Dynamic Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] opacity-30 blur-[130px]"
          animate={{
            background: [
              "radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
              Begin your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-300% animate-gradient">Evolution.</span>
            </h2>

            <p className="text-xl font-bold text-slate-500 max-w-md leading-relaxed mb-16 italic">
              Join thousands of experts and homeowners in the most advanced service network.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, text: 'ENCRYPTED DATA PROTOCOL', color: 'text-indigo-600' },
                { icon: Clock, text: 'INSTANT SERVICE ACCESS', color: 'text-violet-600' },
                { icon: Wrench, text: 'GLOBAL RESOURCE NETWORK', color: 'text-fuchsia-600' },
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

      {/* Right side: Modern Register Card */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full max-w-lg relative z-10"
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

            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-4xl font-black text-slate-950 tracking-[-0.04em] uppercase italic mb-2">Initialize.</h1>
              <p className="text-slate-500 font-bold italic">Register your new identity</p>
            </div>

            {!showOtp && (
              <div className="flex bg-slate-200/50 p-2 rounded-2xl mb-8">
                {(['user', 'technician'] as const).map((r) => (
                  <button key={r} onClick={() => setRoleTab(r)} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 relative ${roleTab === r ? 'text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    {roleTab === r && (
                      <motion.div layoutId="regTabPremium" className="absolute inset-0 bg-slate-950 rounded-xl shadow-xl" transition={{ type: 'spring', stiffness: 200, damping: 20 }} />
                    )}
                    <span className="relative z-10">{r === 'user' ? 'User' : 'Technician'}</span>
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {showOtp ? (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="text-center p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                      SECURITY CODE SENT TO <br />
                      <span className="text-indigo-600 font-black uppercase tracking-wider">{form.email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">OTP VERIFICATION</label>
                    <input
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      placeholder="ENTER 6-DIGIT CODE"
                      className="w-full h-16 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-black text-center tracking-[0.5em] text-2xl focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em]">
                    {loading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : 'Finalize Identity'}
                  </button>

                  <button type="button" onClick={() => setShowOtp(false)} className="w-full text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors italic">
                    Return to parameters
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key={roleTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="FULL NAME" className="h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />
                    <input name="phone" value={form.phone} onChange={handleChange} required placeholder="PHONE" className="h-14 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />
                  </div>

                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="E-MAIL ADDRESS" className="h-14 w-full px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />

                  <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="PASSWORD" className="h-14 w-full px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />

                  {roleTab === 'user' ? (
                    <input name="address" value={form.address} onChange={handleChange} placeholder="PRIMARY ADDRESS" className="h-14 w-full px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />
                  ) : (
                    <div className="space-y-4">
                      <input name="skills" value={form.skills} onChange={handleChange} required placeholder="SKILLS (E.G. HVAC, PLUMBING)" className="h-14 w-full px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all uppercase" />

                      <div className="flex gap-4">
                        <input name="pincode" value={(form as any).pincode || ''} onChange={handleChange} required placeholder="BASE PINCODE" className="h-14 flex-1 px-6 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />

                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={locationLoading}
                          className={`flex-1 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 active:scale-95 ${form.latitude !== 0 ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' : 'bg-slate-950 text-white shadow-xl shadow-slate-950/20 hover:scale-105'}`}
                        >
                          {locationLoading ? 'SYNCHRONIZING...' : (form.latitude !== 0 ? 'GEO-SYNCED ✓' : 'SYNC LOCATION')}
                        </button>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em] mt-4">
                    {loading ? <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Identity'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!showOtp && (
              <div className="mt-10 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Already registered?</p>
                <Link to="/login" className="text-xs font-black text-indigo-600 hover:text-fuchsia-600 uppercase tracking-widest transition-colors italic">
                  Return to access point
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default RegisterPage;
