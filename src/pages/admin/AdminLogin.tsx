import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/api/admin';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await adminApi.login({ email, password });
            login(res.data.token, res.data.admin, 'admin');
            toast({ title: 'Welcome Admin', description: 'Logged in successfully.' });
            navigate('/admin/dashboard');
        } catch (error: any) {
            toast({
                title: 'Access Denied',
                description: error.response?.data?.message || 'Invalid credentials',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8 text-center border-b border-gray-800 bg-gray-900/50">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                    <p className="text-gray-400 mt-2">Restricted Access only</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-gray-600"
                                    placeholder="admin@electrocare.com"
                                />
                                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
