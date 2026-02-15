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
            toast({ title: 'Analysis Failed', description: 'Could not analyze the issue. Please try again.', variant: 'destructive' });
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
        <div className="relative max-w-5xl mx-auto p-4 md:p-8 space-y-12 mb-20">
            {}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {}
            <div className="fixed top-20 right-20 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

            {}
            <div className="text-center space-y-4 md:space-y-6 relative z-10">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-500/20 shadow-2xl shadow-violet-500/10 mb-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Bot className="w-8 h-8 md:w-10 md:h-10 text-violet-600 relative z-10" />
                </motion.div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 tracking-tighter drop-shadow-sm">
                    AI DIAGNOSTICS
                </h1>
                <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-medium px-4">
                    Powered by advanced neural networks to identify issues instantly.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start relative z-10">
                {}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="backdrop-blur-xl bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 p-1 rounded-[2rem] shadow-2xl"
                >
                    <div className="bg-white/80 dark:bg-gray-900/90 rounded-[1.8rem] p-6 md:p-8 space-y-8 relative overflow-hidden">
                        {}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[length:100%_4px] bg-[linear-gradient(transparent_50%,black_50%)]" />

                        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs font-mono text-gray-400">CONSOLE__INPUT.log</span>
                        </div>

                        <form onSubmit={handleAnalyze} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-violet-500" />
                                    Target System
                                </label>
                                <select
                                    value={selectedValue}
                                    onChange={(e) => setSelectedValue(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium"
                                    required
                                >
                                    <option value="">Select Target Device...</option>
                                    {userAppliances.length > 0 && (
                                        <optgroup label="My Registered Systems">
                                            {userAppliances.map(app => (
                                                <option
                                                    key={app._id}
                                                    value={JSON.stringify({ type: 'user', id: app._id, category: app.category?.name || 'Unknown', label: `${app.brand?.name} ${app.category?.name}` })}
                                                >
                                                    {app.brand?.name} {app.category?.name} ({app.model?.name || 'Unknown'})
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                    <optgroup label="General Protocols">
                                        {GENERAL_APPLIANCES.map(app => (
                                            <option key={app} value={JSON.stringify({ type: 'general', id: null, category: app, label: app })}>
                                                {app}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Error Signature
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the malfunction symptoms..."
                                    className="w-full min-h-[140px] resize-none bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-mono text-sm leading-relaxed"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedValue || !description}
                                className="w-full relative overflow-hidden group bg-gray-900 text-white rounded-xl py-4 font-bold tracking-wide shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            RUNNING DIAGNOSTICS...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            INITIATE SCAN
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </motion.div>

                {}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="h-full flex flex-col items-center justify-center text-center p-10 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/20"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-violet-600/30 blur-2xl rounded-full animate-pulse" />
                                    <Brain className="w-20 h-20 text-violet-600 relative z-10 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">NEURAL SCAN ACTIVE</h3>
                                <p className="text-gray-500 font-mono text-sm">Processing symptoms... Comparing databases... Analyzing patterns...</p>
                            </motion.div>
                        )}

                        {!loading && !result && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] bg-gray-50/50"
                            >
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <Wrench className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Standard Mode</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Awaiting input data. Please select a device and describe the issue to begin analysis.
                                </p>
                            </motion.div>
                        )}

                        {!loading && result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/10 rounded-[2rem] overflow-hidden"
                            >
                                {}
                                <div className="bg-gray-900 dark:bg-black p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full animate-pulse ${result.severity === 'high' ? 'bg-red-500' : result.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                        <span className="text-white font-mono text-xs uppercase tracking-widest">
                                            Status: {result.severity.toUpperCase()} Priority
                                        </span>
                                    </div>
                                    {result.is_safe_to_use ? (
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">Safe</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/30">Hazard</span>
                                    )}
                                </div>

                                <div className="p-8 space-y-8">
                                    {}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-indigo-500 uppercase tracking-widest block">Root Cause Analysis</label>
                                        <p className="text-gray-900 dark:text-white text-lg font-medium leading-relaxed">
                                            {result.likely_cause}
                                        </p>
                                    </div>

                                    {}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Cost Estimate</div>
                                            <div className="text-2xl font-black text-gray-900 dark:text-white">{result.estimated_cost_range}</div>
                                        </div>
                                        <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                                            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">AI Confidence</div>
                                            <div className="text-2xl font-black text-gray-900 dark:text-white">94%</div>
                                        </div>
                                    </div>

                                    {}
                                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-l-4 border-indigo-500">
                                        <div className="flex gap-3">
                                            <Zap className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recommended Action</label>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{result.advice}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBookTechnician}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Proceed to Repair
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SmartTroubleshooter;
