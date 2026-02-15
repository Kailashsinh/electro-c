import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { Search, Wrench, Calendar, Trash2 } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';

const RequestManagement: React.FC = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = () => {
        setLoading(true);
        adminApi.getAllServiceRequests()
            .then(res => setRequests(res.data))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service request? This action cannot be undone.')) return;
        try {
            await adminApi.deleteServiceRequest(id);
            toast({ title: 'Request Deleted', description: 'Service request has been removed successfully.' });
            loadRequests();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete request.', variant: 'destructive' });
        }
    };

    const filteredRequests = requests.filter((r) =>
        r.user_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.appliance_type?.toLowerCase().includes(search.toLowerCase()) ||
        r.status?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search requests..."
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
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Service</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Technician</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredRequests.map((req) => (
                            <tr key={req._id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <p className="font-medium text-gray-900">{req.user_id?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-500">{req.user_id?.phone}</p>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Wrench className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-700">{req.appliance_type}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{req.issue_description?.substring(0, 30)}...</p>
                                </td>
                                <td className="p-4">
                                    {req.technician_id ? (
                                        <>
                                            <p className="text-sm font-medium text-gray-900">{req.technician_id.name}</p>
                                            <p className="text-xs text-gray-500">{req.technician_id.phone}</p>
                                        </>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            req.status === 'pending' || req.status === 'broadcasted' ? 'bg-yellow-100 text-yellow-800' :
                                                req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                        }`}>
                                        {req.status?.charAt(0).toUpperCase() + req.status?.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span className="text-sm">{new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(req._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Request"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestManagement;
