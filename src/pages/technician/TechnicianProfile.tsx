import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Edit2, LogOut, ShieldCheck, PenTool, Award, Briefcase, Star, Settings, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/api/auth';
import { serviceRequestApi } from '@/api/serviceRequests';
import { useToast } from '@/hooks/use-toast';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";

const TechnicianProfile: React.FC = () => {
    const { user, refreshProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const [stats, setStats] = useState({
        rating: 4.8,
        jobsCompleted: 0,
        experience: '1 Year',
        badge: 'Verified Pro'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await serviceRequestApi.getTechnicianRequests();
                const reqs = res.data?.requests || res.data || [];
                const completed = reqs.filter((r: any) => r.status === 'completed').length;
                const memberSince = user?.created_at ? new Date(user.created_at) : new Date();
                const yearDiff = new Date().getFullYear() - memberSince.getFullYear();
                const exp = yearDiff < 1 ? 'Fresh' : `${yearDiff} Year${yearDiff > 1 ? 's' : ''}`;
                setStats(prev => ({ ...prev, jobsCompleted: completed, experience: exp }));
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, [user]);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: ''
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
        }
    }, [user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast({ title: 'File too large', description: 'Max 2MB', variant: 'destructive' });
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await authApi.updateTechnicianProfile({ profile_picture: reader.result as string });
                await refreshProfile();
                toast({ title: 'Avatar Updated' });
            } catch (error) {
                toast({ title: 'Upload Failed', variant: 'destructive' });
            } finally { setUploading(false); }
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authApi.updateTechnicianProfile(formData);
            await refreshProfile();
            setIsEditing(false);
            toast({ title: 'Profile Updated' });
        } catch { toast({ title: 'Update Failed', variant: 'destructive' }); }
    };

    if (!user) return <LoadingSkeleton rows={5} />;

    return (
        <div className="min-h-screen pb-20 relative">
            {/* Background elements */}
            <div className="fixed inset-0 -z-10 bg-[#fbfcfd] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-6xl mx-auto px-4 pt-10 space-y-8">
                {/* Unified Dossier Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-premium border-white/60 shadow-2xl rounded-[3rem] overflow-hidden"
                >
                    <div className="h-40 bg-slate-950 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-slate-950 to-purple-900/50" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    </div>
                    <br />
                    <br />
                    <div className="px-8 md:px-12 pb-12 relative flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20">
                        <div className="relative group">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="w-44 h-44 rounded-[2.5rem] border-[8px] border-white shadow-2xl overflow-hidden bg-white relative">
                                {user.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-5xl font-black text-indigo-200 italic">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer"
                                >
                                    <Camera className="w-8 h-8 text-white" />
                                </button>
                                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left pb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                Certified Technician
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase italic tracking-tighter mb-4 leading-none">{user.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-bold italic text-sm uppercase tracking-wide">
                                <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100/50 border border-slate-200/50"><Briefcase className="w-4 h-4" /> Senior Lead</span>
                                <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100/50 border border-slate-200/50"><Award className="w-4 h-4" /> {stats.experience} Exp</span>
                            </div>
                        </div>

                        <div className="flex gap-4 md:pb-4">
                            <div className="glass-premium px-6 py-4 rounded-3xl text-center border-white/40 shadow-xl min-w-[120px]">
                                <p className="text-2xl font-black text-slate-950 flex items-center justify-center gap-1 leading-none italic">{stats.rating}<Star className="w-5 h-5 text-amber-500 fill-amber-500 mb-1" /></p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Rating</p>
                            </div>
                            <div className="glass-premium px-6 py-4 rounded-3xl text-center border-white/40 shadow-xl min-w-[120px]">
                                <p className="text-2xl font-black text-slate-950 leading-none italic">{stats.jobsCompleted}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Jobs Done</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Essential Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-premium p-8 rounded-[2.5rem] border-white/60 shadow-xl space-y-8"
                        >
                            <h3 className="text-sm font-black text-slate-950 uppercase italic tracking-widest flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-600" /> Identification
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { label: 'Uplink Address', val: user.email, icon: Mail },
                                    { label: 'Direct Line', val: user.phone, icon: Phone },
                                    { label: 'Sector Hub', val: user.address || 'Not Set', icon: MapPin }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-white group-hover:border-indigo-100 transition-all duration-300">
                                            <item.icon className="w-4 h-4 text-indigo-500" />
                                            <span className="font-bold text-slate-900 italic text-sm truncate">{item.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-premium p-4 rounded-[2rem] border-white/60 shadow-lg space-y-2"
                        >
                            <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                                <span className="flex items-center gap-3 font-black text-slate-600 uppercase italic text-[10px] tracking-widest">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"><Lock className="w-4 h-4" /></div>
                                    Update Security
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                            </button>
                            <button onClick={logout} className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-all group">
                                <span className="flex items-center gap-3 font-black text-rose-600 uppercase italic text-[10px] tracking-widest">
                                    <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all"><LogOut className="w-4 h-4" /></div>
                                    End Session
                                </span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Mastery & Config */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-premium p-10 rounded-[3rem] border-white/60 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-widest flex items-center gap-3">
                                    <PenTool className="w-6 h-6 text-emerald-600" /> Technical Mastery
                                </h3>
                                <div className="h-10 px-4 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl flex items-center gap-2 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" /> Verified Skills
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {(user.skills?.length > 0 ? user.skills : ['Mechanical Repair', 'System Tuning', 'Circuit Board Repair', 'Diagnostic Scan']).map((skill: string) => (
                                    <span key={skill} className="px-5 py-3 bg-white/50 border border-slate-100 rounded-2xl text-xs font-black text-slate-900 italic uppercase flex items-center gap-3 hover:border-emerald-200 transition-colors shadow-sm">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-premium p-10 rounded-[3rem] border-white/60 shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-widest flex items-center gap-3">
                                        <Settings className="w-6 h-6 text-indigo-600" /> Operative Dossier
                                    </h3>
                                    <p className="text-slate-500 font-bold italic text-sm mt-1">Configure your profile parameters.</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white' : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-xl active:scale-95'}`}
                                >
                                    {isEditing ? 'Abort' : 'Edit Profile'}
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { label: 'Full Name', key: 'name' },
                                        { label: 'Email Address', key: 'email' },
                                        { label: 'Phone Line', key: 'phone' },
                                        { label: 'Operating Sector', key: 'address' }
                                    ].map(field => (
                                        <div key={field.key} className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{field.label}</label>
                                            <input
                                                value={(formData as any)[field.key]}
                                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                                className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-black text-slate-900"
                                            />
                                        </div>
                                    ))}
                                    <div className="md:col-span-2 pt-6">
                                        <button type="submit" className="w-full h-16 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-950 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">
                                            Commit Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center bg-slate-50/30">
                                    <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 border border-slate-100">
                                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <p className="text-lg font-black text-slate-950 uppercase italic mb-1">Dossier Encrypted</p>
                                    <p className="text-xs text-slate-500 font-bold italic">Profile is securely active on the technician grid.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="rounded-[2.5rem] border-white/60 p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
                    <div className="bg-slate-950 p-10 text-center">
                        <Lock className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Security Protocol</h2>
                    </div>
                    <div className="p-10 text-center space-y-6">
                        <p className="text-slate-500 font-bold italic leading-relaxed text-sm">
                            Password resets are currently handled via administrative uplink. Please contact HQ support for credentials modification.
                        </p>
                        <button
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all"
                        >
                            Back to Command
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TechnicianProfile;
