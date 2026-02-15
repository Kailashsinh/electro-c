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
      {}
      <div className="h-32 md:h-48 bg-gray-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 md:-mt-12 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">

          {}
          <div className="w-full md:w-80 flex-shrink-0 space-y-6">
            {}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}
                </div>
                <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-1.5 rounded-full shadow-md border-2 border-white cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}>
                  <Edit2 className="w-3 h-3" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{role}</p>

              <div className="w-full pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500">Member since</span>
                <span className="font-semibold text-gray-900">
                  {user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
                </span>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button onClick={() => setIsPasswordModalOpen(true)} className="w-full text-left px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-3 transition-colors border-b border-gray-100">
                <Lock className="w-5 h-5" /> Change Password
              </button>
              <button onClick={logout} className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 font-medium flex items-center gap-3 transition-colors">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>

          {}
          <div className="flex-1 space-y-6">
            {}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Wallet</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">₹{user.wallet_balance || 0}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Loyalty</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{user.loyalty_points || 0}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">Plan</span>
                </div>
                <span className="text-lg font-bold text-gray-900 capitalize">{user.subscription?.plan || 'Free'}</span>
              </div>
            </div>

            {}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Save Changes</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Phone className="w-4 h-4 text-gray-400" /> {user.phone}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Address</label>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <MapPin className="w-4 h-4 text-gray-400" /> {user.address || 'No address set'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
