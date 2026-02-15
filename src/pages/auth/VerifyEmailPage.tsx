import { useState } from 'react';
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

            toast.success('OTP sent successfully!', {
                description: 'Please check your email for the verification code.',
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
            toast.success('Email verified successfully!');
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
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 min-h-screen bg-muted/50">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/login')}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <CardTitle className="text-2xl">Verify Account</CardTitle>
                            </div>
                            <CardDescription>
                                {otpSent
                                    ? 'Enter the verification code sent to your email.'
                                    : 'Enter your email to receive a verification code.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onVerify)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>I am a...</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-row space-x-4"
                                                        disabled={otpSent}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="user" id="user" />
                                                            <Label htmlFor="user">User</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="technician" id="technician" />
                                                            <Label htmlFor="technician">Technician</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="name@example.com" className="pl-9" {...field} disabled={otpSent} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {otpSent && (
                                        <FormField
                                            control={form.control}
                                            name="otp"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>OTP Code</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <CheckCircle2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input placeholder="123456" className="pl-9 tracking-widest text-lg" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {!otpSent ? (
                                        <Button type="button" onClick={onSendOtp} className="w-full" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                'Send Verification Code'
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button type="submit" className="w-full" disabled={isLoading}>
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    'Verify & Login'
                                                )}
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={() => setOtpSent(false)} className="w-full" disabled={isLoading}>
                                                Change Email / Resend
                                            </Button>
                                        </div>
                                    )}
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
