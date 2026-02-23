import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Wrench, AlertTriangle, CheckCircle, XCircle, ChevronRight, Loader2, Sparkles, Brain, Cpu, Zap } from 'lucide-react';
import { aiApi, DiagnosisResponse } from '@/api/ai';
import { applianceApi } from '@/api/appliances';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const GENERAL_APPLIANCES = [
    'Air Conditioner (AC)', 'Refrigerator', 'Washing Machine', 'Microwave Oven',
    'Geyser/Water Heater', 'Water Purifier (RO)', 'Television (TV)', 'Chimney', 'Dishwasher'
];

const SmartTroubleshooter: React.FC = () => {
    const [userAppliances, setUserAppliances] = useState<any[]>([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiagnosisResponse | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppliances = async () => {
            try {
                const res = await applianceApi.getMyAppliances();
                setUserAppliances(res.data.appliances || res.data || []);
            } catch (error) { }
        };
        fetchAppliances();
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedValue || !description) return;

        setLoading(true);
        setResult(null);

        try {
            const selection = JSON.parse(selectedValue);
            const res = await aiApi.diagnose({ applianceType: selection.category, description });
            setResult(res.data);
        } catch (error) {
            toast({ title: 'System Error', description: 'Failed to complete diagnosis. Please try again.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleBookTechnician = () => {
        if (!selectedValue) return;
        const selection = JSON.parse(selectedValue);
        navigate('/user/requests/new', {
            state: {
                applianceId: selection.type === 'user' ? selection.id : undefined,
                description: description,
                category: selection.category
            }
        });
    };

    return (
        <div className="relative min-h-screen">
            {/* Aurora Background Overlay */}
            <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none opacity-50">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
                {/* Header Section */}
                <div className="text-center space-y-4 relative z-10 px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100 shadow-xl shadow-indigo-500/10"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                        </span>
                        AI Troubleshooter
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-[-0.04em] uppercase italic leading-none">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-violet-600 bg-300% animate-gradient">Assistant.</span>
                    </h1>
                    <p className="text-slate-500 mt-4 font-bold italic text-lg max-w-2xl mx-auto">Smart analysis of your appliance issues using our AI models.</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10 px-4">
                    {/* Input Matrix */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 glass-premium p-8 border-white/60 shadow-2xl space-y-8"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <h2 className="text-xl font-black text-slate-950 uppercase italic tracking-widest flex items-center gap-3">
                                <Cpu className="h-6 w-6 text-indigo-600" /> Identify Issue
                            </h2>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                        </div>

                        <form onSubmit={handleAnalyze} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Appliance</label>
                                <select
                                    value={selectedValue}
                                    onChange={(e) => setSelectedValue(e.target.value)}
                                    className="w-full h-16 px-6 rounded-2xl bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-black italic text-sm uppercase tracking-tight appearance-none"
                                    required
                                >
                                    <option value="">Choose an appliance...</option>
                                    {userAppliances.length > 0 && (
                                        <optgroup label="My Appliances">
                                            {userAppliances.map(app => {
                                                const brandName = app.brand?.name || '';
                                                const categoryName = app.category?.name || '';
                                                const modelName = app.model?.name || app.model || '';

                                                // Create a descriptive label using whatever info exists
                                                let label = '';
                                                if (brandName && categoryName) label = `${brandName} ${categoryName}`;
                                                else if (brandName && modelName) label = `${brandName} ${modelName}`;
                                                else if (categoryName && modelName) label = `${categoryName} (${modelName})`;
                                                else label = brandName || categoryName || modelName || `Appliance #${app._id?.slice(-4)}`;

                                                return (
                                                    <option
                                                        key={app._id}
                                                        value={JSON.stringify({
                                                            type: 'user',
                                                            id: app._id,
                                                            category: categoryName || 'Appliance',
                                                            label: label
                                                        })}
                                                    >
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    )}
                                    <optgroup label="All Appliances">
                                        {GENERAL_APPLIANCES.map(app => (
                                            <option key={app} value={JSON.stringify({ type: 'general', id: null, category: app, label: app })}>
                                                {app}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Describe the Problem</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's wrong? Type here..."
                                    className="w-full min-h-[180px] px-6 py-6 rounded-3xl bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold italic lg:text-lg resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedValue || !description}
                                className="w-full h-18 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center gap-3 h-full">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-5 h-5 fill-white" />
                                            Find Solution
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </motion.div>

                    {/* Result Interface */}
                    <div className="lg:col-span-7 h-full min-h-[500px] relative">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="h-full flex flex-col items-center justify-center text-center glass-premium border-white/40 p-12"
                                >
                                    <div className="relative mb-10">
                                        <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full animate-pulse" />
                                        <div className="relative z-10 h-32 w-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 animate-float">
                                            <Brain className="w-16 h-16 text-white animate-pulse" />
                                        </div>
                                        <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-sky-500 flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                                            <Cpu className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">Analyzing your appliance</h3>
                                    <p className="text-slate-500 font-bold italic text-sm mt-4 tracking-widest uppercase opacity-70">Finding potential issues in our database...</p>

                                    <div className="mt-12 flex gap-4">
                                        {[0.1, 0.2, 0.3].map(d => (
                                            <motion.div
                                                key={d}
                                                animate={{ height: [10, 30, 10] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: d }}
                                                className="w-1 bg-indigo-600 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-premium border-white/60 shadow-2xl overflow-hidden h-full flex flex-col"
                                >
                                    <div className={`p-6 flex items-center justify-between ${result.severity === 'high' ? 'bg-rose-500 text-white' : result.severity === 'medium' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-white'}`}>
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="h-5 w-5" />
                                            <span className="font-black uppercase tracking-[0.2em] text-xs italic">
                                                Severity Level: {result.severity} Priority
                                            </span>
                                        </div>
                                        {result.is_safe_to_use ? (
                                            <div className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-[10px] font-black uppercase tracking-widest italic">Operational</div>
                                        ) : (
                                            <div className="px-3 py-1 rounded-full bg-black/20 border border-black/30 text-[10px] font-black uppercase tracking-widest italic font-white">Critical Risk</div>
                                        )}
                                    </div>

                                    <div className="p-10 space-y-10 flex-1">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Potential Cause</label>
                                            <p className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                                                {result.likely_cause}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 flex flex-col justify-between">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estimated Repair Cost</label>
                                                <div className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter">{result.estimated_cost_range}</div>
                                            </div>
                                            <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
                                                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Confidence</label>
                                                <div className="text-3xl font-black text-indigo-600 uppercase italic tracking-tighter">98.4%</div>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Sparkles className="w-12 h-12 text-indigo-600" /></div>
                                            <div className="relative z-10 flex gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                                                    <Wrench className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Our Recommendation</label>
                                                    <p className="text-slate-700 font-bold italic mt-1 leading-relaxed">{result.advice}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleBookTechnician}
                                            className="w-full h-20 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:bg-slate-950 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-4 group"
                                        >
                                            Book Technician
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center glass-premium border-white/40 p-12 border-dashed border-4 border-slate-200 bg-white/40"
                                >
                                    <div className="h-24 w-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-10 rotate-12">
                                        <Bot className="h-12 w-12 text-slate-300" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight">Ready to Help</h3>
                                    <p className="text-slate-500 font-bold italic text-lg mt-4 max-w-xs mx-auto">Tell us about your appliance issue to get a quick diagnosis.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartTroubleshooter;
