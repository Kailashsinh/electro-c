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
            {}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-32 md:h-48 bg-gradient-to-r from-gray-900 to-indigo-900 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="px-6 md:px-8 pb-6 relative z-20 flex flex-col md:flex-row items-end gap-6">
                    {}
                    <div className="relative group cursor-pointer mx-auto md:mx-0 -mt-12 md:-mt-16" onClick={() => fileInputRef.current?.click()}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white relative">
                            {user.profile_picture ? (
                                <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl md:text-4xl font-bold text-slate-400">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-1.5 md:p-2 rounded-xl shadow-lg border-2 border-white">
                            <Edit2 className="w-3 h-3" />
                        </div>
                    </div>

                    {}
                    <div className="flex-1 mb-2 text-center md:text-left w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-4 mb-2">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{user.name}</h1>
                            <span className="inline-flex items-center justify-center md:justify-start gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 w-fit mx-auto md:mx-0">
                                <ShieldCheck className="w-3 h-3" /> Verified Pro
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 text-sm md:text-base">
                            <PenTool className="w-4 h-4" /> Senior Technician • {stats.experience} Experience
                        </p>
                    </div>

                    {}
                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center min-w-[100px]">
                            <div className="text-xl md:text-2xl font-black text-gray-900 flex items-center justify-center gap-1">
                                {stats.rating} <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Rating</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center min-w-[100px]">
                            <div className="text-xl md:text-2xl font-black text-gray-900">
                                {stats.jobsCompleted}
                            </div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Jobs Done</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="space-y-6">
                    {}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" /> Contact Info
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Email Address</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4" /></div>
                                    <span className="truncate">{user.email}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Phone Number</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-4 h-4" /></div>
                                    <span>{user.phone}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Service Area</label>
                                <div className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-4 h-4" /></div>
                                    <span>{user.address || 'Not Set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-3 font-semibold text-gray-700">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                Change Password
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
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

                {}
                <div className="lg:col-span-2 space-y-6">

                    {}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-600" /> Expertise & Skills
                            </h3>
                            <button className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors">Add Skill</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.skills && user.skills.length > 0 ? (
                                user.skills.map((skill: string) => (
                                    <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100 flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                ['AC Repair', 'Refrigerator Maintenance', 'Washing Machine', 'Electrical Diagnostics'].map(skill => (
                                    <span key={skill} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100 flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                        {skill}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-indigo-600" /> Personal Details
                            </h3>
                            <button onClick={() => setIsEditing(!isEditing)} className={`font-bold text-sm px-4 py-2 rounded-lg transition-colors ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Service Area / Address</label>
                                    <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                                </div>
                                <div className="md:col-span-2 pt-4 flex justify-end">
                                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                                <p className="text-gray-500 font-medium">Your profile details are currently visible to customers.</p>
                                <p className="text-sm text-gray-400 mt-2">Click "Edit Profile" to make changes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
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
