import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, DollarSign, Navigation, CheckCircle, XCircle, AlertCircle, Radar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncomingRequests: React.FC = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const loadRequests = async () => {
        try {
            const res = await serviceRequestApi.getTechnicianRequests();
            const allRequests = res.data?.requests || res.data || [];
            
            const incoming = allRequests.filter((r: any) => ['pending', 'broadcasted'].includes(r.status));
            setRequests(incoming);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRequests(); }, []);

    const handleAccept = async (requestId: string) => {
        setActionLoading(requestId);
        try {
            await serviceRequestApi.accept(requestId);
            toast({ title: 'Request Accepted', description: 'You can now start this job from your Dashboard.' });
            
            setRequests(prev => prev.filter(r => r._id !== requestId));
            setTimeout(() => navigate('/technician/dashboard'), 1000); 
        } catch (error: any) {
            toast({ title: 'Accept Failed', description: error.response?.data?.message || 'Could not accept request', variant: 'destructive' });
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <LoadingSkeleton rows={3} />;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {}
            <div className="bg-gray-900 text-white pt-8 pb-20 px-4 md:pt-10 md:pb-24 md:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                            <Radar className="w-5 h-5 md:w-6 md:h-6 text-indigo-400 animate-pulse" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Incoming Broadcasts</h1>
                    </div>
                    <p className="text-gray-400 max-w-xl text-sm md:text-base">
                        High-priority service requests in your area. Accept them quickly before other technicians do.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
                {requests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Radar className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Incoming Requests</h3>
                        <p className="text-gray-500">
                            You're all caught up! Wait for new broadcasts or check your <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => navigate('/technician/dashboard')}>Active Jobs</span>.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {requests.map((req, i) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 group"
                                >
                                    {/* Urgency Stripe */}
                                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />

                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                                                        New Request
                                                    </span>
                                                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                    </span>
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {req.issue_desc}
                                                </h3>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <MapPin className="w-4 h-4 text-indigo-500" />
                                                        <span className="font-medium">{req.user_id?.address?.split(',')[0] || 'Location Hidden'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                        <Clock className="w-4 h-4 text-indigo-500" />
                                                        <span className="font-medium">
                                                            {req.scheduled_date ? new Date(req.scheduled_date).toLocaleDateString() : 'Today'} • {req.preferred_slot}
                                                        </span>
                                                    </div>
                                                    {req.estimated_service_cost && (
                                                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700">
                                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-bold">Est: ₹{req.estimated_service_cost}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Customer (Blurred if strictly private, but usually visible to tech before accept for location context) */}
                                                <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-100">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                        {req.user_id?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{req.user_id?.name || 'Customer'}</p>
                                                        <p className="text-xs text-gray-500">Verified User</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="w-full md:w-auto flex flex-col gap-3 min-w-[160px]">
                                                {req.location?.coordinates && (
                                                    <button
                                                        onClick={() => window.open(`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`, '_blank')}
                                                        className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Navigation className="w-4 h-4" /> View Map
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAccept(req._id)}
                                                    disabled={actionLoading === req._id}
                                                    className="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {actionLoading === req._id ? (
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-5 h-5" /> Accept Job
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncomingRequests;
