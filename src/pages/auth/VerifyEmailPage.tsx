import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/api/auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

const formSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['user', 'technician']),
    otp: z.string().optional(),
});

export default function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const { login } = useAuth();

    const defaultRole = (searchParams.get('role') as 'user' | 'technician') || 'user';
    const defaultEmail = searchParams.get('email') || '';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: defaultEmail,
            role: defaultRole,
            otp: '',
        },
    });

    async function onSendOtp() {
        const values = form.getValues();
        if (!values.email) {
            form.setError('email', { message: 'Email is required' });
            return;
        }

        setIsLoading(true);
        try {
            if (values.role === 'user') {
                await authApi.resendVerificationUser({ email: values.email });
            } else {
                await authApi.resendVerificationTechnician({ email: values.email });
            }

            toast.success('Protocol Initiated', {
                description: 'Verification code dispatched to your inbox.',
            });
            setOtpSent(true);
        } catch (error: any) {
            toast.error('Failed to send OTP', {
                description: error.response?.data?.message || 'Please check your email and try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function onVerify(values: z.infer<typeof formSchema>) {
        if (!values.otp) {
            form.setError('otp', { message: 'OTP is required' });
            return;
        }

        setIsLoading(true);
        try {
            let res;
            if (values.role === 'user') {
                res = await authApi.verifyEmailUser({ email: values.email, otp: values.otp });
            } else {
                res = await authApi.verifyEmailTechnician({ email: values.email, otp: values.otp });
            }

            const { token, user: userData, technician } = res.data;
            const u = userData || technician;

            login(token, u, values.role);
            toast.success('Identity Verified', {
                description: 'Welcome to the ElectroCare network.',
            });
            navigate(`/${values.role}/dashboard`);

        } catch (error: any) {
            toast.error('Verification failed', {
                description: error.response?.data?.message || 'Invalid OTP.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-[#fdfdff]">
            {/* Dynamic Aurora Background Overlay */}
            <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
                <motion.div
                    className="absolute -inset-[100px] opacity-30 blur-[130px]"
                    animate={{
                        background: [
                            "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)",
                            "radial-gradient(circle at 10% 10%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)",
                            "radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)",
                            "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.4) 0%, transparent 50%)"
                        ]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className="container relative flex items-center justify-center min-h-screen p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="glass-premium p-10 md:p-14 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-white/40">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />

                        <div className="mb-10 flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 hover:bg-slate-950 hover:text-white transition-all duration-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-950 tracking-[-0.04em] uppercase italic">Verify.</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Identity Validation Protocol</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onVerify)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">SUBJECT ROLE</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-row gap-4 h-14 bg-slate-100 p-2 rounded-2xl"
                                                    disabled={otpSent}
                                                >
                                                    <div className={`flex-1 flex items-center justify-center rounded-xl transition-all duration-500 relative ${field.value === 'user' ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}>
                                                        <RadioGroupItem value="user" id="user" className="sr-only" />
                                                        <Label htmlFor="user" className="sr-only">User</Label>
                                                        <span className="text-xs font-black uppercase tracking-widest cursor-pointer">User</span>
                                                    </div>
                                                    <div className={`flex-1 flex items-center justify-center rounded-xl transition-all duration-500 relative ${field.value === 'technician' ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}>
                                                        <RadioGroupItem value="technician" id="technician" className="sr-only" />
                                                        <Label htmlFor="technician" className="sr-only">Technician</Label>
                                                        <span className="text-xs font-black uppercase tracking-widest cursor-pointer">Technician</span>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold uppercase tracking-widest italic text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1">E-MAIL ADDRESS</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                                    <Input
                                                        placeholder="name@nexus.co"
                                                        className="h-14 pl-14 bg-white/50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold placeholder:text-slate-400 focus:outline-none focus-visible:ring-0 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                                                        {...field}
                                                        disabled={otpSent}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold uppercase tracking-widest italic text-rose-500" />
                                        </FormItem>
                                    )}
                                />

                                <AnimatePresence mode="wait">
                                    {otpSent && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="otp"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-xs font-black text-slate-950 tracking-widest uppercase ml-1 text-center block">SECURITY CODE</FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <CheckCircle2 className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                                                <Input
                                                                    placeholder="••••••"
                                                                    className="h-16 pl-14 bg-indigo-50/50 border-2 border-indigo-200 rounded-2xl text-slate-950 font-black tracking-[0.8em] text-2xl focus:outline-none focus-visible:ring-0 focus:border-indigo-600 transition-all text-center"
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-bold uppercase tracking-widest italic text-rose-500" />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={onSendOtp}
                                        className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em]"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            'Dispatch Code'
                                        )}
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <button
                                            type="submit"
                                            className="btn-premium w-full h-16 text-lg uppercase italic tracking-[0.2em]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                'Finalize'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="w-full text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors italic"
                                            disabled={isLoading}
                                        >
                                            Parameters / Re-dispatch
                                        </button>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
