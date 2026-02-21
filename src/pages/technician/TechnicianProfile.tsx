import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Edit2, LogOut, ShieldCheck, PenTool, Award, Briefcase, Star, Settings, ChevronRight, CheckCircle } from 'lucide-react';
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
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

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
                console.error(error);
                toast({ title: 'Upload Failed', description: 'Could not update profile picture.', variant: 'destructive' });
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

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({ title: 'Passwords do not match', variant: 'destructive' });
            return;
        }
        try {

            await authApi.resetPasswordTechnician({
                email: user?.email,


















                otp: '000000', newPassword: passwordForm.newPassword
            });


            toast({ title: 'Functionality pending backend update', variant: 'destructive' });
        } catch (error: any) {
            toast({ title: 'Error', description: 'Failed to change password', variant: 'destructive' });
        }
    };

    if (!user) return <LoadingSkeleton rows={5} />;

    return (
        <div className="min-h-screen pb-20 space-y-8">
            { }
            {/* Header Banner */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-32 md:h-52 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="px-6 md:px-10 pb-8 relative z-20 flex flex-col md:flex-row items-end gap-6 lg:gap-8">
                    {/* Avatar */}
                    <div className="relative group cursor-pointer mx-auto md:mx-0 -mt-16 md:-mt-20" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <div className="w-32 h-32 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-3xl border-[6px] border-white shadow-2xl overflow-hidden bg-white relative">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 mb-2 text-center md:text-left w-full min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-4 mb-2">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 truncate">{user.name}</h1>
                            <span className="inline-flex items-center justify-center md:justify-start gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 w-fit mx-auto md:mx-0 whitespace-nowrap">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Pro
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                            <Briefcase className="w-4 h-4 text-gray-400" /> Senior Technician <span className="text-gray-300">•</span> <Award className="w-4 h-4 text-gray-400" /> {stats.experience} Exp
                        </p>
                    </div>

                    {/* Stats Compact */}
                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center min-w-[110px] group hover:-translate-y-1 transition-transform">
                            <div className="text-2xl font-black text-gray-900 flex items-center justify-center gap-1 group-hover:text-amber-500 transition-colors">
                                {stats.rating} <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Rating</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center min-w-[110px] group hover:-translate-y-1 transition-transform">
                            <div className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {stats.jobsCompleted}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Jobs Done</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Col */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Contact Info Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><User className="w-5 h-5" /></div>
                            Contact Info
                        </h3>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5 ml-1">Email Address</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50/30 transition-colors">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><Mail className="w-4 h-4 text-indigo-500" /></div>
                                    <span className="truncate flex-1" title={user.email}>{user.email}</span>
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5 ml-1">Phone Number</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50/30 transition-colors">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><Phone className="w-4 h-4 text-indigo-500" /></div>
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1.5 ml-1">Service Area</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium p-3 bg-gray-50 rounded-xl group-hover:bg-indigo-50/30 transition-colors">
                                    <div className="p-2 bg-white rounded-lg shadow-sm"><MapPin className="w-4 h-4 text-indigo-500" /></div>
                                    <span className="truncate flex-1">{user.address || 'Not Set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-2">
                        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                Change Password
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={logout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-2xl transition-colors group text-red-600">
                            <div className="flex items-center gap-3 font-semibold">
                                <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                Sign Out
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Col */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Skills */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><PenTool className="w-5 h-5" /></div> Expertise
                            </h3>
                            <button className="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors uppercase tracking-wide">
                                + Add New
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2.5 relative z-10">
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill: string) => (
                                    <span key={skill} className="px-4 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-100 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                ['AC Repair', 'Refrigerator Maintenance', 'Washing Machine', 'Electrical Diagnostics'].map(skill => (
                                    <span key={skill} className="px-4 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-bold border border-gray-100 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Edit Profile */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-gray-400" /> Personal Details
                                </h3>
                                <p className="text-sm text-gray-500">Update your personal information for better reach.</p>
                            </div>
                            <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-black hover:shadow-md'}`}>
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
                                    <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</label>
                                    <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address</label>
                                    <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="md:col-span-2 pt-4 flex justify-end border-t border-gray-50 mt-2">
                                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50/80 dashed-border border-2 border-gray-200 border-dashed rounded-2xl p-8 text-center">
                                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                    <ShieldCheck className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-gray-900 font-bold mb-1">View Only Mode</p>
                                <p className="text-sm text-gray-500">Your profile details are currently visible to customers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            { }
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-500">Feature currently under maintenance. Please contact support to reset password.</p>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TechnicianProfile;
