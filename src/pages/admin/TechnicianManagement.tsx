import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/admin';
import { Search, UserCog, CheckCircle, XCircle, Star, Pencil, Trash2, Save, FileText, ExternalLink } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const TechnicianManagement: React.FC = () => {
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    // Verification Modal State
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedTech, setSelectedTech] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        loadTechnicians();
    }, []);

    const loadTechnicians = () => {
        setLoading(true);
        adminApi.getAllTechnicians()
            .then(res => setTechnicians(res.data))
            .finally(() => setLoading(false));
    };

    const handleVerificationAction = async (status: 'approved' | 'rejected') => {
        if (!selectedTech) return;
        try {
            await adminApi.verifyTechnician(selectedTech._id, status, status === 'rejected' ? rejectionReason : undefined);
            toast({ title: `Technician ${status}`, description: `Verification has been ${status}.` });
            setVerifyModalOpen(false);
            setRejectionReason('');
            loadTechnicians();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update verification status.', variant: 'destructive' });
        }
    };

    const openVerifyModal = (tech: any) => {
        setSelectedTech(tech);
        setVerifyModalOpen(true);
    };

    const filteredTechnicians = technicians.filter((t) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            approved: 'bg-green-100 text-green-800',
            submitted: 'bg-blue-100 text-blue-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles] || styles.pending}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    if (loading) return <LoadingSkeleton rows={5} />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Technician Management</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-4 pr-4 py-2 border rounded-lg"
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Technician</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Verification</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Documents</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTechnicians.map((tech) => (
                            <tr key={tech._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-bold">{tech.name}</div>
                                    <div className="text-xs text-gray-500">{tech.email}</div>
                                </td>
                                <td className="p-4">
                                    {getStatusBadge(tech.verificationStatus || 'pending')}
                                </td>
                                <td className="p-4">
                                    {tech.verificationStatus === 'submitted' || tech.verificationStatus === 'approved' ? (
                                        <button
                                            onClick={() => openVerifyModal(tech)}
                                            className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"
                                        >
                                            <FileText className="w-4 h-4" /> View Docs
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">Not Uploaded</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    {tech.verificationStatus === 'submitted' && (
                                        <Button size="sm" onClick={() => openVerifyModal(tech)}>Review</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Verification Modal */}
            <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Verify Technician: {selectedTech?.name}</DialogTitle>
                        <DialogDescription>Review the uploaded documents below.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="md:col-span-2 border p-4 rounded-lg bg-gray-50">
                            <h4 className="font-bold text-sm text-gray-500 uppercase">Aadhaar Number</h4>
                            <p className="text-2xl font-mono font-bold tracking-wider text-gray-900">{selectedTech?.aadhaar_number || 'N/A'}</p>
                        </div>

                        <div className="border p-4 rounded-lg">
                            <h4 className="font-bold mb-2">Aadhaar Card (Front)</h4>
                            {selectedTech?.documents?.id_proof ? (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 rounded-lg overflow-hidden h-48 border">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.id_proof}`}
                                            alt="ID Proof"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.id_proof}`}
                                        target="_blank"
                                        className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View Full Size
                                    </a>
                                </div>
                            ) : <p className="text-red-500">Not Uploaded</p>}
                        </div>

                        <div className="border p-4 rounded-lg">
                            <h4 className="font-bold mb-2">Live Photo Capture</h4>
                            {selectedTech?.documents?.live_photo ? (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 rounded-lg overflow-hidden h-48 border">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.live_photo}`}
                                            alt="Live Photo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.live_photo}`}
                                        target="_blank"
                                        className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View Full Size
                                    </a>
                                </div>
                            ) : <p className="text-red-500">Not Captured</p>}
                        </div>

                        <div className="border p-4 rounded-lg md:col-span-2">
                            <h4 className="font-bold mb-2">Certification (Optional)</h4>
                            {selectedTech?.documents?.certification ? (
                                <div className="space-y-2">
                                    <div className="bg-gray-100 rounded-lg overflow-hidden h-64 border">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.certification}`}
                                            alt="Certification"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/${selectedTech.documents.certification}`}
                                        target="_blank"
                                        className="text-blue-600 text-xs flex items-center gap-1 hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View Full Size
                                    </a>
                                </div>
                            ) : <p className="text-gray-400 italic">Not Uploaded</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold">Rejection Reason (If rejecting)</label>
                        <Textarea
                            placeholder="e.g. ID Proof is blurry..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="destructive" onClick={() => handleVerificationAction('rejected')}>
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleVerificationAction('approved')}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TechnicianManagement;
