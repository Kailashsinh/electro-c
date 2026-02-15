import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus, Eye, Star, Calendar, IndianRupee } from 'lucide-react';
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
    <div className="relative space-y-8 min-h-screen overflow-hidden">
      { }
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Requests</h1>
          <p className="text-gray-500 mt-1">Track and manage your service history</p>
        </div>
        <Link
          to="/user/requests/new"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-xl shadow-indigo-500/20 hover:bg-gray-800 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95 w-full md:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>New Request</span>
        </Link>
      </div>

      {requests.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-16 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No service requests yet</h3>
          <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">Create your first request to get started with our premium appliance care service.</p>
          <Link to="/user/requests/new" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline">
            Create Your First Request &rarr;
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req: any, i: number) => (
            <motion.div
              key={req._id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group glass-card p-6 border border-white/60 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{req.issue_desc || 'Service Request'}</h3>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span>{req.scheduled_date ? new Date(req.scheduled_date).toLocaleDateString() : 'Date Pending'}</span>
                      <span className="text-gray-300">|</span>
                      <span>{req.preferred_slot || 'Time Pending'}</span>
                    </div>

                    {req.estimated_service_cost && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg text-emerald-700 font-medium">
                        <IndianRupee className="h-4 w-4" />
                        <span>{req.estimated_service_cost}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <Link
                    to={`/user/requests/${req._id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                  >
                    <Eye className="h-4 w-4" /> View Details
                  </Link>

                  {req.status === 'completed' && req.otp_verified && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedRequest(req._id); setShowFeedback(true); }}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 text-sm font-semibold hover:bg-amber-100 hover:shadow-sm transition-all"
                    >
                      <Star className="h-4 w-4" /> Rate
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
