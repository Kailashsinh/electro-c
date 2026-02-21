import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Camera, Edit2, LogOut, Shield, Star, Wallet, CreditCard, ChevronRight } from 'lucide-react';
import { authApi } from '@/api/auth';
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

const ProfilePage: React.FC = () => {
  const { user, role, refreshProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: ''
  });


  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast({ title: 'Password Changed Successfully' });
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to change password', variant: 'destructive' });
    }
  };

  React.useEffect(() => { refreshProfile(); }, [refreshProfile]);

  React.useEffect(() => {
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
        await authApi.updateProfile({ profile_picture: reader.result as string });
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
      await authApi.updateProfile(formData);
      await refreshProfile();
      setIsEditing(false);
      toast({ title: 'Profile Updated' });
    } catch { toast({ title: 'Update Failed', variant: 'destructive' }); }
  };

  if (!user) return <LoadingSkeleton rows={5} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      { }
      <div className="h-32 md:h-48 bg-gray-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col items-center text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-white -z-10" />

              <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-[6px] border-white shadow-2xl relative bg-white">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white cursor-pointer hover:bg-indigo-700 transition-transform hover:scale-105" onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}>
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-1 px-2 truncate max-w-full" title={user.name}>{user.name}</h2>
              <div className="flex items-center gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100">
                  {role}
                </span>
              </div>

              <div className="w-full pt-6 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Member since</span>
                <span className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                  {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Settings</h3>
              </div>
              <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-3 transition-colors border-b border-gray-50 group">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                Change Password
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-gray-400" />
              </button>
              <button onClick={logout} className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 font-medium flex items-center gap-3 transition-colors group">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-full blur-xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 text-gray-400 mb-3 relative z-10">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Wallet className="w-5 h-5" /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Wallet</span>
                </div>
                <span className="text-3xl font-black text-gray-900 relative z-10">₹{user.wallet_balance || 0}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 text-gray-400 mb-3 relative z-10">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Star className="w-5 h-5" /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Loyalty</span>
                </div>
                <span className="text-3xl font-black text-gray-900 relative z-10">{user.loyalty_points || 0}</span>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center sm:items-start text-center sm:text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-xl -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 text-gray-400 mb-3 relative z-10">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><Shield className="w-5 h-5" /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Plan</span>
                </div>
                <span className="text-3xl font-black text-gray-900 capitalize relative z-10 truncate max-w-full" title={user.subscription?.plan?.replace('_', ' ') || 'Free'}>
                  {user.subscription?.plan?.replace('_', ' ') || 'Free'}
                </span>
              </div>
            </div>

            {/* Personal Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h3>
                  <p className="text-sm text-gray-500">Manage your personal details and contact info.</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-900 text-white hover:bg-black hover:shadow-md'}`}>
                  {isEditing ? <><LogOut className="w-4 h-4 rotate-180" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Email</label>
                      <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Phone</label>
                      <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Address</label>
                      <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">Save Changes</button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                  <div className="group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <div className="text-gray-900 font-semibold p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50/50 transition-colors truncate" title={user.email}>
                      {user.email}
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <div className="text-gray-900 font-semibold p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50/50 transition-colors">
                      {user.phone}
                    </div>
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Installation Address
                    </label>
                    <div className="text-gray-900 font-semibold p-4 bg-gray-50 rounded-2xl group-hover:bg-indigo-50/50 transition-colors flex items-start gap-2">
                      <span className="break-words w-full">{user.address || 'No address set'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Password
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
