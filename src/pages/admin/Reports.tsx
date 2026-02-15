import React, { useState } from 'react';
import { adminApi } from '@/api/admin';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
    const [generating, setGenerating] = useState<string | null>(null);
    const { toast } = useToast();

    const generateCSV = async (type: 'users' | 'technicians' | 'revenue', title: string) => {
        setGenerating(type);
        try {
            const res = await adminApi.getReportData(type);
            const data = res.data;

            if (!data || data.length === 0) {
                toast({ title: 'No Data', description: 'No records found to generate report.', variant: 'default' });
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            let header = "";
            let rows: string[] = [];

            if (type === 'users') {
                header = "Name,Email,Phone,Wallet Balance,Status,Loyalty Points";
                rows = data.map((u: any) =>
                    `"${u.name}","${u.email}","${u.phone}",${u.wallet_balance},"${u.isVerified ? 'Verified' : 'Pending'}",${u.loyalty_points}`
                );
            } else if (type === 'technicians') {
                header = "Name,Email,Phone,Skills,Rating,Completed Jobs,Status";
                rows = data.map((t: any) =>
                    `"${t.name}","${t.email}","${t.phone}","${t.skills?.join(';')}",${t.rating?.toFixed(1) || 'N/A'},${t.completed_jobs},"${t.isVerified ? 'Verified' : 'Unverified'}"`
                );
            } else if (type === 'revenue') {
                header = "Date,User,Type,Amount,Platform Share";
                rows = data.map((r: any) =>
                    `"${new Date(r.date).toLocaleDateString()}","${r.user}","${r.type}",${r.amount},${r.platform_share}`
                );
                
                const totalAmount = data.reduce((sum: number, i: any) => sum + i.amount, 0);
                const totalShare = data.reduce((sum: number, i: any) => sum + i.platform_share, 0);
                rows.push(`"TOTAL","","",${totalAmount},${totalShare}`);
            }

            csvContent += header + "\r\n" + rows.join("\r\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `electrocare_${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({ title: 'Success', description: 'Report downloaded successfully.' });

        } catch (err) {
            console.error(err);
            toast({ title: 'Error', description: 'Failed to generate report.', variant: 'destructive' });
        } finally {
            setGenerating(null);
        }
    };

    const reportTypes = [
        { id: 'users', title: 'User Roster Report', desc: 'List of all registered users and their details.' },
        { id: 'technicians', title: 'Technician Performance Report', desc: 'Ratings, jobs completed, and verification status.' },
        { id: 'revenue', title: 'Revenue & Financial Report', desc: 'Detailed breakdown of earnings from visits and subscriptions.' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports Center</h1>
                <p className="text-gray-500">Generate and download system reports (CSV).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report) => (
                    <div key={report.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{report.title}</h3>
                        <p className="text-sm text-gray-500 mb-6 flex-1">{report.desc}</p>

                        <button
                            onClick={() => generateCSV(report.id as any, report.title)}
                            disabled={!!generating}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {generating === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Download CSV
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
