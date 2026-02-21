import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/auth';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, CheckCircle, Truck, Clock, MapPin, User, Phone, Navigation, Radar, Calendar, TrendingUp, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen pb-20 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Hello, <span className="text-indigo-600">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </div>
            {locationStatus === 'active' && (
              <div className="bg-blue-50 text-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 border border-blue-100">
                <Navigation className="w-3 h-3" /> GPS Active
              </div>
            )}
            {locationStatus === 'denied' && (
              <div className="bg-red-50 text-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 border border-red-100">
                <Navigation className="w-3 h-3" /> GPS Denied
              </div>
            )}
            <div className="text-xs md:text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {user?.verificationStatus === 'submitted' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Verification Under Review</h3>
              <p className="text-sm text-blue-700">You have submitted your documents. Admin is reviewing your profile. You will be notified once approved.</p>
            </div>
          </div>
        </div>
      )}

      {user?.status === 'suspended' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-red-900">Account Suspended</h3>
              <p className="text-sm text-red-700">Your account is currently suspended. Please contact support.</p>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Column: Active Jobs (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-5 w-5 text-indigo-600" />
              Active Assignments
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-black">{activeJobs.length}</span>
            </h2>
          </div>

          {activeJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No active jobs</h3>
              <p className="text-gray-500 mb-6">You're currently free. Check incoming broadcasts!</p>
              <Link to="/technician/requests" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                <Radar className="w-4 h-4" /> Find New Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((req: any, i: number) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Date Box */}
                    <div className="hidden md:flex flex-col items-center justify-center w-20 h-20 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-700 flex-shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {req.scheduled_date ? new Date(req.scheduled_date).toLocaleString('default', { month: 'short' }) : 'TODAY'}
                      </span>
                      <span className="text-2xl font-black">
                        {req.scheduled_date ? new Date(req.scheduled_date).getDate() : new Date().getDate()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">{req.issue_desc}</h3>
                        <StatusBadge status={req.status} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" /> <span className="font-medium">{req.user_id?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" /> <span>{req.user_id?.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">
                            {req.address_details && (req.address_details.street || req.address_details.city)
                              ? `${req.address_details.street || ''}, ${req.address_details.city || ''} ${req.address_details.pincode || ''}`
                              : req.user_id?.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2 md:hidden">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {req.scheduled_date ? new Date(req.scheduled_date).toLocaleDateString() : 'Today'} • {req.preferred_slot}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {getActions(req).map((a) => (
                          <button
                            key={a.action}
                            onClick={() => handleAction(req._id, a.action)}
                            disabled={!!actionLoading}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50 ${variantClasses[a.variant]}`}
                          >
                            {actionLoading === `${req._id}-${a.action}` ? 'Processing...' : a.label}
                          </button>
                        ))}
                        {req.location?.coordinates && (
                          <button
                            onClick={() => window.open(`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`, '_blank')}
                            className="px-4 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Navigation className="w-4 h-4" /> Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Stats & Broadcasts (1/3 width) */}
        <div className="space-y-8">
          {/* Incoming Request Widget */}
          <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-gray-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                  <Radar className={`w-6 h-6 ${pendingJobs.length > 0 ? 'text-indigo-400 animate-pulse' : 'text-gray-400'}`} />
                </div>
                {pendingJobs.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">{pendingJobs.length} New</span>}
              </div>
              <h3 className="text-xl font-bold mb-1">Incoming Broadcasts</h3>
              <p className="text-gray-400 text-sm mb-6">New service requests in your area.</p>

              <Link to="/technician/requests" className="block w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-center hover:bg-gray-50 transition-colors">
                {pendingJobs.length > 0 ? 'View Requests' : 'Check for new jobs'}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Performance</h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Report</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Completed</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{completedJobs.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Jobs</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{myJobs.length}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Earnings (Real)</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">₹{totalEarnings.toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
