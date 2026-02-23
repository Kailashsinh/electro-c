import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin';
import { FileText, Download, Loader2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
    const [generating, setGenerating] = useState<string | null>(null);
    const { toast } = useToast();

    const generatePDF = async (type: 'users' | 'technicians' | 'revenue', title: string) => {
        setGenerating(`${type}-pdf`);
        try {
            const res = await adminApi.getReportData(type);
            const data = res.data;

            if (!data || data.length === 0) {
                toast({ title: 'No Data', description: 'No records found to generate report.', variant: 'default' });
                return;
            }

            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text(`ElectroCare - ${title}`, 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            let head: string[][] = [];
            let body: any[][] = [];

            if (type === 'users') {
                head = [['Name', 'Email', 'Phone', 'Wallet', 'Status', 'Points']];
                body = data.map((u: any) => [
                    u.name, u.email, u.phone, u.wallet_balance, u.isVerified ? 'Verified' : 'Pending', u.loyalty_points
                ]);
            } else if (type === 'technicians') {
                head = [['Name', 'Phone', 'Skills', 'Rating', 'Jobs', 'Status']];
                body = data.map((t: any) => [
                    t.name, t.phone, t.skills?.join(', '), t.rating?.toFixed(1) || 'N/A', t.completed_jobs, t.isVerified ? 'Verified' : 'Unverified'
                ]);
            } else if (type === 'revenue') {
                head = [['Date', 'User', 'Type', 'Amount', 'Platform Share']];
                body = data.map((r: any) => [
                    new Date(r.date).toLocaleDateString(), r.user, r.type, r.amount, r.platform_share
                ]);

                const totalAmount = data.reduce((sum: number, i: any) => sum + i.amount, 0);
                const totalShare = data.reduce((sum: number, i: any) => sum + i.platform_share, 0);
                body.push(['TOTAL', '', '', totalAmount, totalShare]);
            }

            autoTable(doc, {
                head: head,
                body: body,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [79, 70, 229] } // Indigo-600
            });

            doc.save(`electrocare_${type}_report_${new Date().toISOString().split('T')[0]}.pdf`);
            toast({ title: 'Success', description: 'PDF Report downloaded successfully.' });

        } catch (err) {
            console.error(err);
            toast({ title: 'Error', description: 'Failed to generate PDF report.', variant: 'destructive' });
        } finally {
            setGenerating(null);
        }
    };

    const generateCSV = async (type: 'users' | 'technicians' | 'revenue', title: string) => {
        setGenerating(`${type}-csv`);
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
                    `"${new Date(r.date).toISOString().split('T')[0]}","${r.user}","${r.type}",${r.amount},${r.platform_share}`
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

            toast({ title: 'Success', description: 'CSV Report downloaded successfully.' });

        } catch (err) {
            console.error(err);
            toast({ title: 'Error', description: 'Failed to generate CSV report.', variant: 'destructive' });
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
        <div className="space-y-12 pb-20 relative overflow-hidden">
            {/* Intelligence Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
            >
                <h1 className="text-3xl font-black text-slate-950 uppercase italic tracking-tight flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-lg shadow-indigo-500/10">
                        <FileDown className="w-8 h-8" />
                    </div>
                    Intelligence <span className="text-indigo-600">Center</span>
                </h1>
                <p className="text-slate-500 font-bold italic text-sm pl-16">Generate and extract operational data dossiers across the grid.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reportTypes.map((report, idx) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-premium p-8 rounded-[2.5rem] border-white/60 shadow-xl flex flex-col items-start hover:shadow-2xl transition-all group relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                            <FileText className="h-40 w-40 text-indigo-600" />
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/5 group-hover:scale-110 transition-transform relative z-10">
                            <FileText className="w-8 h-8 text-indigo-600" />
                        </div>

                        <div className="space-y-2 relative z-10 flex-1">
                            <h3 className="font-black text-xl text-slate-950 uppercase italic tracking-tight">{report.title}</h3>
                            <p className="text-sm text-slate-500 font-bold italic leading-relaxed">{report.desc}</p>
                        </div>

                        <div className="grid grid-cols-2 w-full gap-4 mt-10 relative z-10">
                            <button
                                onClick={() => generatePDF(report.id as any, report.title)}
                                disabled={!!generating}
                                className="h-14 flex items-center justify-center gap-3 bg-indigo-600 text-white rounded-2xl hover:bg-slate-950 transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95"
                            >
                                {generating === `${report.id}-pdf` ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                                PDF Dossier
                            </button>
                            <button
                                onClick={() => generateCSV(report.id as any, report.title)}
                                disabled={!!generating}
                                className="h-14 flex items-center justify-center gap-3 bg-slate-100 text-slate-900 border border-slate-200 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest active:scale-95"
                            >
                                {generating === `${report.id}-csv` ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                CSV Data
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Support Message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-premium p-8 rounded-[2rem] border-white/60 shadow-xl text-center max-w-2xl mx-auto"
            >
                <p className="text-slate-500 font-bold italic text-xs uppercase tracking-widest">
                    Need custom data extraction? Contact system administration for advanced SQL vectors.
                </p>
            </motion.div>
        </div>
    );
};

export default Reports;
