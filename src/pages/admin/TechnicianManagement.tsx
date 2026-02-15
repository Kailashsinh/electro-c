import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { Search, UserCog, CheckCircle, XCircle, Star, Pencil, Trash2, Save } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

const TechnicianManagement: React.FC = () => {
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    
    const [editingTech, setEditingTech] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        loadTechnicians();
    }, []);

    const loadTechnicians = () => {
        setLoading(true);
        adminApi.getAllTechnicians()
            .then(res => setTechnicians(res.data))
            .finally(() => setLoading(false));
    };

    const handleVerify = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentStatus) return; 
        try {
            await adminApi.verifyTechnician(id);
            toast({ title: 'Success', description: 'Technician verified successfully.' });
            loadTechnicians();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to verify technician.', variant: 'destructive' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this technician? This action cannot be undone.')) return;
        try {
            await adminApi.deleteTechnician(id);
            toast({ title: 'Technician Deleted', description: 'Technician has been removed successfully.' });
            loadTechnicians();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete technician.', variant: 'destructive' });
        }
    };

    const handleEdit = (tech: any) => {
        setEditingTech(tech);
        setEditForm({ ...tech });
        setIsEditOpen(true);
    };

    const saveEdit = async () => {
        try {
            await adminApi.updateTechnician(editingTech._id, editForm);
            toast({ title: 'Technician Updated', description: 'Technician details have been updated.' });
            setIsEditOpen(false);
            loadTechnicians();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update technician.', variant: 'destructive' });
        }
    };


    const filteredTechnicians = technicians.filter((t) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase()) ||
        t.skills?.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Technician Management</h1>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search technicians..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Technician</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Performance</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Verification</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTechnicians.map((tech) => (
                            <tr key={tech._id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                            <UserCog className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{tech.name}</p>
                                            <p className="text-xs text-gray-500">{tech.skills?.join(', ') || 'No skills'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tech.status === 'active' ? 'bg-green-50 text-green-700' :
                                        tech.status === 'busy' ? 'bg-orange-50 text-orange-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${tech.status === 'active' ? 'bg-green-500' :
                                            tech.status === 'busy' ? 'bg-orange-500' :
                                                'bg-gray-500'
                                            }`} />
                                        {tech.status?.charAt(0).toUpperCase() + tech.status?.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium">{tech.rating?.toFixed(1) || 'N/A'}</span>
                                        <span className="text-gray-400 text-xs">({tech.completed_jobs} jobs)</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {tech.isVerified ? (
                                        <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" /> Verified
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleVerify(tech._id, tech.isVerified, e)}
                                            className="inline-flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            Verify Now
                                        </button>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(tech)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Technician"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tech._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Technician"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Technician</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <input
                                className="w-full px-3 py-2 border rounded-md"
                                value={editForm.phone || ''}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                className="w-full px-3 py-2 border rounded-md"
                                value={editForm.status || 'active'}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            >
                                <option value="active">Active</option>
                                <option value="busy">Busy</option>
                                <option value="suspended">Suspended</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Is Verified?</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editForm.isVerified || false}
                                    onChange={(e) => setEditForm({ ...editForm, isVerified: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-600">Verified</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveEdit}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default TechnicianManagement;
