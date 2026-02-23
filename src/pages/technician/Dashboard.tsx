import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, CheckCircle, Truck, Clock, MapPin, User, Phone, Navigation, Radar, Calendar, TrendingUp, XCircle, MessageCircle, ChevronRight, Loader2, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ImageGallery from '@/components/ImageGallery';
import ChatCard from '@/components/ChatCard';

const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [completeRequestId, setCompleteRequestId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'active' | 'inactive' | 'denied'>('inactive');

  // Redirect if pending verification or rejected
  useEffect(() => {
    if (user) {
      if (user.verificationStatus === 'pending' || user.verificationStatus === 'rejected' || user.verificationStatus === 'submitted') {
        navigate('/technician/verification');
      }
    }
  }, [user, navigate]);

  const loadRequests = async () => {
    try {
      const res = await serviceRequestApi.getTechnicianRequests();
      setRequests(res.data?.requests || res.data || []);
    } catch { } finally { setLoading(false); }
  };

  // Auto-update location on mount
  useEffect(() => {
    loadRequests();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await authApi.updateLocation(latitude, longitude);
            setLocationStatus('active');
            console.log("Location updated:", latitude, longitude);
          } catch (error) {
            console.error("Failed to update location:", error);
            setLocationStatus('inactive');
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === 1) setLocationStatus('denied');
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleAction = async (requestId: string, action: string) => {
    setActionLoading(`${requestId}-${action}`);
    try {
      if (action === 'on_the_way') {
        await serviceRequestApi.markOnTheWay(requestId);
        toast({ title: 'Success', description: 'Status updated to On The Way' });
        loadRequests();
      }
      else if (action === 'estimate') {
        const cost = prompt('Enter estimated service cost:');
        if (!cost) { setActionLoading(null); return; }
        await serviceRequestApi.submitEstimate(requestId, Number(cost));
        toast({ title: 'Success', description: 'Estimate submitted' });
        loadRequests();
      }
      else if (action === 'complete') {
        await serviceRequestApi.complete(requestId);
        setCompleteRequestId(requestId);
        setShowOtpModal(true);
        toast({ title: 'OTP Sent', description: 'Ask the customer for the OTP sent to their email.' });
        // Do NOT loadRequests yet, wait for OTP
      }

    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    } finally { setActionLoading(null); }
  };

  const handleVerifyOtp = async () => {
    if (!completeRequestId || !otp) return;
    setOtpLoading(true);
    try {
      await serviceRequestApi.verifyOtp(completeRequestId, otp);
      toast({ title: 'Success', description: 'Job marked as completed!' });
      setShowOtpModal(false);
      setCompleteRequestId(null);
      setOtp('');
      loadRequests();
    } catch (err: any) {
      toast({ title: 'Verification Failed', description: err.response?.data?.message || 'Invalid OTP', variant: 'destructive' });
    } finally {
      setOtpLoading(false);
    }
  };

  const activeJobs = requests.filter((r: any) => ['accepted', 'on_the_way', 'awaiting_approval', 'approved', 'in_progress'].includes(r.status));
  const pendingJobs = requests.filter((r: any) => ['pending', 'broadcasted'].includes(r.status));




  const myJobs = requests.filter((r: any) => r.technician_id === user?._id || ['accepted', 'on_the_way', 'awaiting_approval', 'approved', 'in_progress', 'completed'].includes(r.status));

  const completedJobs = myJobs.filter((r: any) => r.status === 'completed');

  const totalEarnings = completedJobs.reduce((acc: number, job: any) => {
    const serviceCost = job.estimated_service_cost || 0;
    const visitShare = job.visit_fee_paid ? (job.technician_visit_share || 150) : 0;
    return acc + serviceCost + visitShare;
  }, 0);

  const getActions = (req: any) => {
    const actions: { label: string; action: string; variant: string }[] = [];
    if (req.status === 'accepted') actions.push({ label: 'Start Travel', action: 'on_the_way', variant: 'primary' });
    if (req.status === 'on_the_way') actions.push({ label: 'Submit Estimate', action: 'estimate', variant: 'warning' });
    if (req.status === 'approved' || req.status === 'in_progress') actions.push({ label: 'Complete Job', action: 'complete', variant: 'success' });
    return actions;
  };

  const variantClasses: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/30',
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Animated Aurora Background */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-fuchsia-500/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-10 relative z-10">
        {/* Header Section - Tactical HUD Style */}
        <div className="glass-premium rounded-[2.5rem] p-10 border-white/60 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
            <Radar className="h-32 w-32 text-indigo-600" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Technician Status: Online
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-slate-500 font-bold italic flex items-center gap-2">
                <Clock className="h-4 w-4" /> System Sync: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {locationStatus === 'active' && (
                <div className="px-6 py-3 rounded-2xl glass-premium border-emerald-200/50 text-emerald-700 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                  <Navigation className="h-4 w-4 animate-pulse" /> Location Active
                </div>
              )}
              <div className="px-6 py-3 rounded-2xl glass-premium border-indigo-200/50 text-indigo-700 font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                Status: Verified
              </div>
            </div>
          </div>
        </div>

        {user?.verificationStatus === 'submitted' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-3xl border border-white/20">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">Verification Pending</h3>
                <p className="text-indigo-100 font-medium italic opacity-80 mt-1">Our support team is reviewing your verification documents.</p>
              </div>
            </div>
            <button disabled className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-black uppercase text-xs tracking-widest">In Progress</button>
          </motion.div>
        )}

        {user?.status === 'suspended' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl bg-rose-600 text-white shadow-2xl shadow-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-3xl border border-white/20">
                <XCircle className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tight">Access Restricted</h3>
                <p className="text-rose-100 font-medium italic opacity-80 mt-1">Your account credentials have been temporarily suspended.</p>
              </div>
            </div>
            <button className="px-8 py-4 rounded-2xl bg-white text-rose-600 font-black uppercase text-xs tracking-widest">Contact Command</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column: Active Assignments */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                <Truck className="h-6 w-6 text-indigo-600" /> Current Jobs
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
            </div>

            <AnimatePresence mode="popLayout">
              {activeJobs.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-premium rounded-[3rem] p-20 text-center border-dashed border-2 border-slate-200/50">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <Radar className="h-10 w-10 text-slate-300 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 uppercase italic mb-4">No Nearby Activity</h3>
                  <p className="text-slate-500 font-bold italic mb-10 max-w-xs mx-auto"> technicians are currently on standby. Watch for incoming requests.</p>
                  <Link to="/technician/requests" className="inline-flex h-16 px-10 rounded-2xl bg-slate-950 text-white font-black uppercase text-xs tracking-[0.2em] items-center gap-4 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1">
                    <Radar className="h-5 w-5" /> Look for Jobs
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {activeJobs.map((req: any, i: number) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-premium rounded-[2.5rem] p-8 md:p-10 border-white/60 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                        <Zap className="h-40 w-40 text-indigo-600" />
                      </div>

                      <div className="flex flex-col md:flex-row gap-10">
                        {/* Status Matrix */}
                        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-slate-50/50 border border-slate-200/50 text-slate-950 flex-shrink-0 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Day</span>
                          <span className="text-3xl font-black italic">
                            {req.scheduled_date ? new Date(req.scheduled_date).getDate() : new Date().getDate()}
                          </span>
                        </div>

                        <div className="flex-1 space-y-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                                {req.issue_desc}
                              </h3>
                              <div className="flex items-center gap-4">
                                <StatusBadge status={req.status} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> System ID: #{req._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Asset</p>
                                <p className="text-sm font-black text-slate-900 uppercase italic">{req.user_id?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                                <MapPin className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Location</p>
                                <p className="text-sm font-black text-slate-900 uppercase italic truncate">
                                  {req.address_details?.street || req.user_id?.address}
                                </p>
                              </div>
                            </div>
                          </div>

                          {req.issue_images && req.issue_images.length > 0 && (
                            <div className="pt-4">
                              <ImageGallery images={req.issue_images} />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 pt-4">
                            {getActions(req).map((a) => (
                              <button
                                key={a.action}
                                onClick={() => handleAction(req._id, a.action)}
                                disabled={!!actionLoading}
                                className={`h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-xl ${variantClasses[a.variant]}`}
                              >
                                {actionLoading === `${req._id}-${a.action}` ? <Loader2 className="animate-spin h-4 w-4" /> : a.label}
                              </button>
                            ))}
                            {req.location?.coordinates && (
                              <button
                                onClick={() => window.open(`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`, '_blank')}
                                className="h-14 px-6 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-200 hover:bg-slate-950 hover:text-white transition-all flex items-center gap-3"
                              >
                                <Navigation className="h-4 w-4" /> View Map
                              </button>
                            )}
                            <button
                              onClick={() => setActiveChat(req._id)}
                              className="h-14 px-6 bg-indigo-50 text-indigo-700 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 group/chat"
                            >
                              <MessageCircle className="h-4 w-4 group-hover/chat:scale-110 transition-transform" /> Chat with User
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Tactical Data */}
          <div className="space-y-10">
            {/* Incoming Request Widget */}
            <div className="bg-[#020617] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/30 transition-all duration-700" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-3xl group-hover:rotate-12 transition-transform">
                    <Radar className={`h-7 w-7 ${pendingJobs.length > 0 ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`} />
                  </div>
                  {pendingJobs.length > 0 && (
                    <div className="px-3 py-1 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-tighter animate-bounce shadow-xl shadow-indigo-500/50">
                      {pendingJobs.length} Requests
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">Recent Requests</h3>
                  <p className="text-slate-400 font-medium italic text-sm mt-2 leading-relaxed">Incoming requests ready for assignment.</p>
                </div>
                <Link to="/technician/requests" className="flex h-16 w-full bg-white text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Performance Matrix */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em] italic flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Work Statistics
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="glass-premium p-6 rounded-3xl border-white/60 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Jobs</p>
                    <p className="text-3xl font-black text-slate-900 italic mt-1">{completedJobs.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="glass-premium p-6 rounded-3xl border-white/60 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                    <p className="text-3xl font-black text-emerald-600 italic mt-1">₹{totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Card Overlay */}
      {activeChat && (
        <ChatCard
          requestId={activeChat}
          currentUserId={user?._id || ''}
          currentUserRole="technician"
          onClose={() => setActiveChat(null)}
        />
      )}

      {/* OTP Verification Modal */}
      {
        showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-indigo-600 p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Verify Completion</h3>
                <p className="text-indigo-100 text-sm mt-1">Enter the OTP sent to the customer's email</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">OTP Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowOtpModal(false); setOtp(''); }}
                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.length < 6}
                    className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Verify & Complete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )
      }
    </div >
  );
};

export default TechnicianDashboard;
