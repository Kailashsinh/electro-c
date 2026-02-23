import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Star, IndianRupee, MapPin, Zap, Clock, Shield, AlertCircle, ChevronRight, Phone, MessageSquare, XCircle, Loader2 } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import { useAuth } from '@/context/AuthContext';

const statusFlow = ['pending', 'broadcasted', 'accepted', 'on_the_way', 'awaiting_approval', 'approved', 'in_progress', 'completed'];
const statusLabels = ['Request Received', 'Finding Technician', 'Technician Assigned', 'On the Way', 'Awaiting Approval', 'Estimate Approved', 'Work in Progress', 'Job Completed'];

const RequestDetails: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    serviceRequestApi.getMyRequests()
      .then((res) => {
        const all = res.data?.requests || res.data || [];
        const found = all.find((r: any) => r._id === requestId);
        setRequest(found);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [requestId]);

  const handleAction = async (action: string) => {
    if (action === 'cancel') {
      if (request.status === 'on_the_way') {
        if (!window.confirm('Technician is on the way. Cancelling now will deduct 15 loyalty points. Do you want to proceed?')) return;
      } else if (!window.confirm('Are you sure you want to cancel this request?')) {
        return;
      }
    }

    setActionLoading(action);
    try {
      if (action === 'cancel') await serviceRequestApi.cancel(requestId!);
      else if (action === 'approve') await serviceRequestApi.approveEstimate(requestId!);
      else if (action === 'verify') await serviceRequestApi.verifyOtp(requestId!, otp);
      toast({ title: 'Success', description: `Request Updated` });
      const res = await serviceRequestApi.getMyRequests();
      const all = res.data?.requests || res.data || [];
      setRequest(all.find((r: any) => r._id === requestId));
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'System Error', variant: 'destructive' });
    } finally { setActionLoading(''); }
  };

  if (loading) return <LoadingSkeleton rows={4} />;
  if (!request) return <div className="glass-premium p-20 text-center font-black uppercase text-slate-400 max-w-lg mx-auto mt-20">Request Not Found</div>;

  const currentStep = statusFlow.indexOf(request.status);

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 px-4">
          <div>
            <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight uppercase italic leading-none">
              Request <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-violet-600 bg-300% animate-gradient">Details.</span>
            </h1>
            <p className="text-slate-500 mt-4 font-bold italic text-lg lg:text-xl">Tracking status for Request ID: <span className="text-indigo-600">#{request._id?.slice(-8).toUpperCase()}</span></p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start px-4">
          {/* Status HUD (Vertical Path) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 order-2 lg:order-1">
            <div className="glass-premium p-8 border-white/60 shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Shield className="h-16 w-16 text-indigo-600" /></div>
              <h2 className="text-lg font-black text-slate-950 uppercase italic tracking-widest flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-indigo-600" /> Current Status
              </h2>

              <div className="space-y-4">
                {statusFlow.map((s, i) => (
                  <div key={s} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 ${i <= currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 rotate-0' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200 rotate-45'}`}>
                        {i <= currentStep ? <CheckCircle className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-slate-400" />}
                      </div>
                      {i < statusFlow.length - 1 && (
                        <div className={`w-[3px] h-10 transition-all duration-500 my-1 ${i < currentStep ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-100'}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${i <= currentStep ? 'text-slate-950' : 'text-slate-300'}`}>
                        {statusLabels[i]}
                      </p>
                      {i === currentStep && (
                        <p className="text-[10px] font-bold text-indigo-600 animate-pulse mt-1 tracking-widest uppercase">Live Status Active</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            {/* Main Info Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-premium border-white/60 shadow-2xl p-10 space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" /> Problem Reported
                  </label>
                  <p className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">{request.issue_desc}</p>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> Scheduled For
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-950 uppercase italic tracking-tighter">{request.preferred_slot}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{new Date(request.scheduled_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-colors">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Repair Estimate</label>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-indigo-600" />
                      <span className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">{request.estimated_service_cost || 'Awaiting Data'}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Zap className="h-5 w-5 text-indigo-600" /></div>
                </div>
                <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between group shadow-xl shadow-slate-200/40">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Service Fee</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">PAID</span>
                      <span className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">₹{request.visit_fee_amount || '0'}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
                </div>
              </div>

              {request.issue_images && request.issue_images.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Photos</label>
                  <ImageGallery images={request.issue_images} />
                </div>
              )}
            </motion.div>

            {/* Technician Hub */}
            {request.technician_id && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-premium border-white/60 shadow-2xl p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><Zap className="h-24 w-24 text-indigo-600" /></div>
                <h3 className="text-sm font-black text-slate-950 uppercase italic tracking-widest mb-8 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-indigo-600" /> Technician Details
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="h-24 w-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 border-4 border-white">
                    <p className="text-4xl font-black text-white italic">{request.technician_id.name?.[0]}</p>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <p className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">{request.technician_id.name}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black text-amber-900">{request.technician_id.rating || '4.8'}</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {request.technician_id.completed_jobs || 142} Completed Jobs
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 hover:bg-slate-950 hover:text-white transition-all group/call">
                      <Phone className="h-6 w-6 group-hover/call:rotate-12 transition-transform" />
                    </button>
                    <button className="h-14 px-6 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-slate-950 transition-all flex items-center gap-3">
                      <MessageSquare className="h-5 w-5" /> Chat with Technician
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Matrix */}
            <div className="flex flex-wrap gap-6 pt-4">
              {request.status === 'awaiting_approval' && (
                <div className="flex w-full gap-4">
                  <button onClick={() => handleAction('approve')} disabled={!!actionLoading} className="flex-1 h-20 rounded-[2rem] bg-indigo-600 text-white font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:bg-slate-950 transition-all flex items-center justify-center gap-4 group">
                    {actionLoading === 'approve' ? <Loader2 className="animate-spin h-6 w-6" /> : <><CheckCircle className="h-6 w-6" /> Approve Estimate</>}
                  </button>
                  <button onClick={() => handleAction('cancel')} disabled={!!actionLoading} className="h-20 px-10 rounded-[2rem] bg-rose-50 text-rose-600 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all border border-rose-100">
                    Cancel Request
                  </button>
                </div>
              )}

              {request.status === 'completed' && !request.otp_verified && (
                <div className="w-full flex flex-col md:flex-row items-center gap-6 glass-premium p-8 border-white/60">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Completion OTP</label>
                    <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" className="w-full h-16 px-8 rounded-2xl bg-slate-50/50 border border-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 font-black tracking-[1em] text-center text-2xl" />
                  </div>
                  <button onClick={() => handleAction('verify')} disabled={!!actionLoading} className="w-full md:w-auto px-12 h-16 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-slate-950 transition-all">
                    Verify & Close
                  </button>
                </div>
              )}

              {!['completed', 'cancelled', 'approved', 'in_progress', 'awaiting_approval'].includes(request.status) && (
                <button onClick={() => handleAction('cancel')} disabled={!!actionLoading} className="h-16 px-10 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-slate-100 flex items-center gap-3">
                  <XCircle className="h-5 w-5" /> Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
