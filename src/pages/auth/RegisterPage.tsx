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
        toast({ title: 'Success', description: 'Location fetched successfully' });
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
          toast({ title: 'Location Required', description: 'Please fetch your current location to register.', variant: 'destructive' });
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
      toast({ title: 'Registration Successful', description: 'Please check your email for the OTP.' });

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
      toast({ title: 'Verified!', description: 'Your email has been verified successfully.' });
      navigate(`/${roleTab}/dashboard`);

    } catch (err: any) {
      toast({ title: 'Verification failed', description: err.response?.data?.message || 'Invalid OTP', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      { }
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
              Join the <span className="gradient-text">ElectroCare</span> community
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Create your account and start managing your appliances with professional care.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { icon: Shield, text: 'Secure & Encrypted Platform' },
                { icon: Clock, text: 'Quick & Easy Registration' },
                { icon: Wrench, text: 'Instant Access to Services' },
              ].map((item, i) => (
                <motion.div key={item.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.15 }} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><item.icon className="h-4 w-4 text-primary" /></div>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      { }
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 relative">
        { }
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative z-10">
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">ElectroCare</span>
          </div>

          <div className="glass-card p-8 relative overflow-hidden">
            { }
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create account</h1>
            <p className="text-gray-500 text-center text-sm mb-8">Get started with ElectroCare today</p>

            { }
            {!showOtp && (
              <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6">
                {(['user', 'technician'] as const).map((r) => (
                  <button key={r} onClick={() => setRoleTab(r)} className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative ${roleTab === r ? 'text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}>
                    {roleTab === r && (
                      <motion.div layoutId="regTab" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
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
                  transition={{ duration: 0.2 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">We've sent a verification code to <b>{form.email}</b></p>
                  </div>
                  <input
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter OTP"
                    className="input-field text-center tracking-widest text-lg"
                  />
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                    Verify & Login
                  </button>
                  <button type="button" onClick={() => setShowOtp(false)} className="w-full text-sm text-muted-foreground hover:text-foreground mt-2">
                    Back (Resend if needed)
                  </button>
                </motion.form>
              ) : (
                // REGISTRATION FORM
                <motion.form
                  key={roleTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" className="input-field" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="input-field" />
                  <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="input-field" />
                  <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" className="input-field" />
                  {roleTab === 'user' ? (
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Address (optional)" className="input-field" />
                  ) : (
                    <>
                      <input name="skills" value={form.skills} onChange={handleChange} required placeholder="Skills (comma-separated)" className="input-field" />
                      <input name="pincode" value={(form as any).pincode || ''} onChange={handleChange} required placeholder="Base Pincode (for requests)" className="input-field" />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={locationLoading}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${form.latitude !== 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                        >
                          {locationLoading ? 'Fetching Location...' : (form.latitude !== 0 ? 'Location Saved ✓' : 'Get Current Location')}
                        </button>
                      </div>
                    </>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading && <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                    Create account
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {!showOtp && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default RegisterPage;
