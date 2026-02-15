import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { Search, MonitorSmartphone, Trash2, Calendar, FileText } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ApplianceManagement: React.FC = () => {
    const [appliances, setAppliances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadAppliances();
    }, []);

    const loadAppliances = () => {
        setLoading(true);
        adminApi.getAllAppliances()
            .then(res => setAppliances(res.data))
            .catch(err => {
                toast({ title: 'Error', description: 'Failed to load appliances.', variant: 'destructive' });
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this appliance? This action cannot be undone.')) return;
        try {
            await adminApi.deleteAppliance(id);
            toast({ title: 'Appliance Deleted', description: 'Appliance has been removed successfully.' });
            loadAppliances();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete appliance.', variant: 'destructive' });
        }
    };

    const filteredAppliances = appliances.filter((app) =>
        app.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.model?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.model?.brand_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.serial_number?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Appliance Management</h1>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search user, model, serial..."
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
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Appliance</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Details</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredAppliances.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                            <MonitorSmartphone className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {app.model?.brand_id?.name} {app.model?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {app.model?.brand_id?.category_id?.name || 'Unknown Type'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{app.user?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500">{app.user?.email}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-gray-700">Serial:</span>
                                            {app.serial_number || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            Purchased: {app.purchase_date ? format(new Date(app.purchase_date), 'MMM d, yyyy') : 'N/A'}
                                        </div>
                                        {app.invoice_url && (
                                            <a
                                                href={app.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                            >
                                                <FileText className="w-3 h-3" /> View Invoice
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Appliance"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAppliances.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No appliances found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplianceManagement;
