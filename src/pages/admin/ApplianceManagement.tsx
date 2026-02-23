import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { Search, MonitorSmartphone, Trash2, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ApplianceManagement: React.FC = () => {
    const [appliances, setAppliances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadAppliances();
    }, []);

    const loadAppliances = () => {
        setLoading(true);
        adminApi.getAllAppliances()
            .then(res => setAppliances(res.data))
            .catch(err => {
                toast({ title: 'Error', description: 'Failed to load appliances.', variant: 'destructive' });
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this appliance? This action cannot be undone.')) return;
        try {
            await adminApi.deleteAppliance(id);
            toast({ title: 'Appliance Deleted', description: 'Appliance has been removed successfully.' });
            loadAppliances();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete appliance.', variant: 'destructive' });
        }
    };

    const filteredAppliances = appliances.filter((app) =>
        app.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.model?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.model?.brand_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.serial_number?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-10 pb-20 relative overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">Inventory <span className="text-indigo-600">Matrix</span></h1>
                    <p className="text-slate-500 font-bold italic text-sm">Asset tracking and technical history sync.</p>
                </div>
                <div className="relative group w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Scan Registry..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold placeholder:slate-400"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredAppliances.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-premium rounded-[2.5rem] p-8 border-white/60 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                <MonitorSmartphone className="h-40 w-40 text-indigo-600" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shadow-lg shadow-indigo-500/5">
                                            <MonitorSmartphone className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-950 uppercase italic tracking-tight leading-tight">
                                                {app.model?.brand_id?.name} {app.model?.name}
                                            </h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                {app.model?.brand_id?.category_id?.name || 'Asset Unit'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Owner</p>
                                            <p className="text-xs font-black text-slate-900 uppercase italic truncate">{app.user?.name || 'Anonymous'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">{app.user?.email}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Serial Index</p>
                                            <p className="font-mono text-xs font-black text-slate-900 tracking-wider mt-1">{app.serial_number || 'UNASSIGNED'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-indigo-600" />
                                            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Commissioned</span>
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-600 uppercase italic">
                                            {app.purchase_date ? format(new Date(app.purchase_date), 'MMM d, yyyy') : 'N/A'}
                                        </span>
                                    </div>

                                    {app.invoice_url && (
                                        <a
                                            href={app.invoice_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-12 rounded-xl bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1 active:scale-95"
                                        >
                                            <FileText className="w-4 h-4" /> Digital Dossier
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredAppliances.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <MonitorSmartphone className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">No Assets Identified</h3>
                        <p className="text-slate-500 font-bold italic mt-2">Adjust your scan parameters or registry filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplianceManagement;
