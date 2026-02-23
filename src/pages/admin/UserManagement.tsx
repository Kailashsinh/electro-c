import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminApi } from '@/api/admin';
import { Search, User, CheckCircle, Pencil, Trash2, X, Save } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();


    const [editingUser, setEditingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setLoading(true);
        adminApi.getAllUsers()
            .then(res => setUsers(res.data))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await adminApi.deleteUser(id);
            toast({ title: 'User Deleted', description: 'User has been removed successfully.' });
            loadUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' });
        }
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        setEditForm({ ...user });
        setIsEditOpen(true);
    };

    const saveEdit = async () => {
        try {
            await adminApi.updateUser(editingUser._id, editForm);
            toast({ title: 'User Updated', description: 'User details have been updated.' });
            setIsEditOpen(false);
            loadUsers();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update user.', variant: 'destructive' });
        }
    };

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-10 pb-20 relative overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight">User <span className="text-indigo-600">Registry</span></h1>
                    <p className="text-slate-500 font-bold italic text-sm">Citizen asset management & clearance protocols.</p>
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

            {/* User Data Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, idx) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-premium rounded-[2.5rem] p-8 border-white/60 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                                <User className="h-40 w-40 text-indigo-600" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shadow-lg shadow-indigo-500/5">
                                            <span className="text-2xl font-black italic">{user.name?.charAt(0) || 'U'}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-950 uppercase italic tracking-tight leading-tight">{user.name}</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Loyalty: {user.loyalty_points || 0} pts</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</span>
                                        {user.isVerified ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100">
                                                Pending
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Wallet</p>
                                            <p className="text-lg font-black text-slate-900 italic mt-1">₹{user.wallet_balance || 0}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Hash</p>
                                            <p className="text-[10px] font-black text-slate-900 uppercase italic mt-2 truncate">{user.email}</p>
                                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            { }
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                className="w-full p-2 border rounded-md"
                                value={editForm.name || ''}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                className="w-full p-2 border rounded-md"
                                value={editForm.email || ''}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <input
                                className="w-full p-2 border rounded-md"
                                value={editForm.phone || ''}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Wallet Balance (₹)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md"
                                value={editForm.wallet_balance || 0}
                                onChange={e => setEditForm({ ...editForm, wallet_balance: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Loyalty Points</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md"
                                value={editForm.loyalty_points || 0}
                                onChange={e => setEditForm({ ...editForm, loyalty_points: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveEdit}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;
