import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, DollarSign, Navigation, CheckCircle, XCircle, AlertCircle, Radar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageGallery from '@/components/ImageGallery';

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
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Animated Aurora Background */}
            <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-10 relative z-10">
                {/* Radar HUD Header */}
                <div className="glass-premium rounded-[2.5rem] p-10 border-white/60 shadow-2xl relative overflow-hidden group mb-12">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <div className="relative">
                            <Radar className="h-32 w-32 text-indigo-600 animate-pulse" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-indigo-500/30 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            Sector Scanning Active
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                            Incoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Broadcasts</span>
                        </h1>
                        <p className="text-slate-500 font-bold italic max-w-xl">
                            High-priority service requests detected in your current radius. Deploy immediately for maximum yield.
                        </p>
                    </div>
                </div>

                {/* Broadcast List */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="popLayout">
                        {requests.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-premium rounded-[3rem] p-20 text-center border-dashed border-2 border-slate-200/50"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                                    <Radar className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-950 uppercase italic mb-2">No Active Signals</h3>
                                <p className="text-slate-500 font-bold italic">
                                    Horizon is currently clear. Maintain position for new sector data.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {requests.map((req, i) => (
                                    <motion.div
                                        key={req._id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-premium rounded-[2.5rem] border-white/60 shadow-xl overflow-hidden group hover:shadow-2xl transition-all"
                                    >
                                        {/* Priority Scanner Line */}
                                        <div className="h-1.5 w-full bg-slate-100 relative overflow-hidden">
                                            <motion.div
                                                animate={{ x: ['-100%', '100%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2"
                                            />
                                        </div>

                                        <div className="p-8 md:p-12">
                                            <div className="flex flex-col lg:flex-row gap-10 justify-between items-start">
                                                <div className="flex-1 space-y-8">
                                                    <div className="flex items-center gap-4">
                                                        <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                            New Broadcast
                                                        </span>
                                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            Detection: {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-3xl font-black text-slate-950 mb-3 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">
                                                            {req.issue_desc}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4">
                                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-bold text-sm italic">
                                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                                {req.address_details?.street || 'Sector Encrypted'}
                                                            </div>
                                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 font-bold text-sm italic">
                                                                <Clock className="w-4 h-4 text-indigo-500" />
                                                                Deployment: {req.scheduled_date ? new Date(req.scheduled_date).toLocaleDateString() : 'Immediate'}
                                                            </div>
                                                            {req.estimated_service_cost && (
                                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-sm uppercase tracking-wider">
                                                                    <DollarSign className="w-4 h-4" /> Est. Yield: ₹{req.estimated_service_cost}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 w-fit">
                                                        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-500/20">
                                                            {req.user_id?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Authenticated</p>
                                                            <p className="font-black text-slate-900 uppercase italic">{req.user_id?.name || 'Authorized User'}</p>
                                                        </div>
                                                    </div>

                                                    {req.issue_images && req.issue_images.length > 0 && (
                                                        <div className="pt-6 border-t border-slate-100">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Intel Imagery</p>
                                                            <ImageGallery images={req.issue_images} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full lg:w-fit flex flex-col gap-4">
                                                    {req.location?.coordinates && (
                                                        <button
                                                            onClick={() => window.open(`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`, '_blank')}
                                                            className="h-16 px-8 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-200 hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center gap-3"
                                                        >
                                                            <Navigation className="h-4 h-4" /> Vector Scope
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAccept(req._id)}
                                                        disabled={actionLoading === req._id}
                                                        className="h-20 px-10 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:bg-slate-950 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                                    >
                                                        {actionLoading === req._id ? (
                                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-6 h-6" /> Deploy Protocol
                                                            </>
                                                        )}
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
            </div>
        </div>
    );
};

export default IncomingRequests;
