import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Eye, Star, Calendar, IndianRupee, ArrowRight } from 'lucide-react';
import { feedbackApi } from '@/api/feedback';
import FeedbackModal from '@/components/FeedbackModal';
import { useToast } from '@/hooks/use-toast';

const MyRequests: React.FC = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    serviceRequestApi.getMyRequests()
      .then((res) => setRequests(res.data?.requests || res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleFeedbackSubmit = async (data: { rating: number; comment: string }) => {
    if (!selectedRequest) return;
    try {
      await feedbackApi.submit(selectedRequest, data);
      toast({ title: 'Feedback Submitted', description: 'Thank you for your rating!' });
      setShowFeedback(false);
      const res = await serviceRequestApi.getMyRequests();
      setRequests(res.data?.requests || res.data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-40 left-0 w-[600px] h-[600px] bg-fuchsia-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="space-y-12 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100 shadow-sm">
              Request History
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-[-0.04em] uppercase italic leading-none">
              Service <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-300% animate-gradient">
                My Requests.
              </span>
            </h1>
            <p className="text-slate-500 mt-4 font-bold italic text-lg">View all your past and current service requests.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Link
              to="/user/requests/new"
              className="group h-16 px-8 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 text-lg"
            >
              New Request <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        {requests.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-premium p-20 text-center border-dashed border-2 border-slate-200 bg-white/40 max-w-4xl mx-auto rounded-[3rem]">
            <div className="h-24 w-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mx-auto mb-8 rotate-12">
              <ClipboardList className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">No Requests Found</h3>
            <p className="text-slate-500 mt-4 mb-10 max-w-sm mx-auto font-bold italic text-lg leading-relaxed">You haven't made any service requests yet. Create your first request to get started.</p>
            <Link to="/user/requests/new" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-950 transition-all shadow-2xl shadow-indigo-500/30">
              Create New Request
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((req: any, i: number) => (
              <motion.div
                key={req._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative glass-premium p-8 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border-white/60"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <StatusBadge status={req.status} />
                      <div className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
                      <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight truncate max-w-xl group-hover:text-indigo-600 transition-colors">
                        {req.issue_desc || 'Service Request'}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 bg-slate-100/50 px-4 py-2 rounded-xl text-slate-600 font-bold italic text-sm border border-slate-200/50">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>{req.scheduled_date ? new Date(req.scheduled_date).toLocaleDateString() : 'Scheduling...'}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-indigo-600">{req.preferred_slot || 'Pending'}</span>
                      </div>

                      {req.estimated_service_cost && (
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 font-black text-sm border border-emerald-100 shadow-sm shadow-emerald-500/5">
                          <IndianRupee className="h-4 w-4" />
                          <span>{req.estimated_service_cost}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <Link
                      to={`/user/requests/${req._id}`}
                      className="flex-1 lg:flex-none h-14 px-6 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm flex items-center justify-center gap-3 group/btn"
                    >
                      <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" /> View Details
                    </Link>

                    {req.status === 'completed' && req.otp_verified && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedRequest(req._id); setShowFeedback(true); }}
                        className="flex-1 lg:flex-none h-14 px-8 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-amber-500 hover:shadow-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20"
                      >
                        <Star className="h-5 w-5 fill-slate-950" /> Submit Rating
                      </button>
                    )}

                    <Link to={`/user/requests/${req._id}`} className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all hidden lg:flex">
                      <ArrowRight className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <FeedbackModal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
        technicianName={requests.find(r => r._id === selectedRequest)?.technician_id?.name}
      />
    </div>
  );
};

export default MyRequests;
