import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/admin';
import { Search, Wrench, Calendar, Trash2 } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/StatusBadge';

const RequestManagement: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        setLoading(true);
        adminApi.getAllServiceRequests()
            .then(res => setRequests(res.data))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service request? This action cannot be undone.')) return;
        try {
            await adminApi.deleteServiceRequest(id);
            toast({ title: 'Request Deleted', description: 'Service request has been removed successfully.' });
            loadRequests();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete request.', variant: 'destructive' });
        }
    };

    const filteredRequests = requests.filter((r) =>
        r.user_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.appliance_type?.toLowerCase().includes(search.toLowerCase()) ||
        r.status?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-10 pb-20 relative overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Request <span className="text-indigo-600">Matrix</span></h1>
                    <p className="text-slate-500 font-bold italic text-sm">Centralized mission control for all service operations.</p>
                </div>
                <div className="relative group w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Scan Requests..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold placeholder:slate-400"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
            </div>

            {/* Data Matrix Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredRequests.map((req, idx) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-premium rounded-[2rem] p-8 border-white/60 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                <Wrench className="h-40 w-40 text-indigo-600" />
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                {/* Customer Profile */}
                                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex-shrink-0">
                                    <span className="text-3xl font-black italic">{req.user_id?.name?.charAt(0) || 'U'}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">Client</span>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">{req.user_id?.name || 'Unknown Protocol'}</h3>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <StatusBadge status={req.status} />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    ID: #{req._id.slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(req._id)}
                                            className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-lg shadow-rose-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appliance Module</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase italic">
                                                <Wrench className="h-3.5 w-3.5 text-indigo-500" /> {req.appliance_type}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Window</p>
                                            <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase italic">
                                                <Calendar className="h-3.5 w-3.5 text-indigo-500" /> {new Date(req.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1 sm:col-span-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Assignment</p>
                                            <div className="text-sm font-black text-slate-900 uppercase italic flex items-center gap-2">
                                                {req.technician_id ? (
                                                    <span className="text-indigo-600">Operative: {req.technician_id.name}</span>
                                                ) : (
                                                    <span className="text-slate-400 italic">Unassigned (Standby)</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RequestManagement;
