import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Terms & Conditions</h1>
                <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">
                    ElectroCare – ElectroCare platform<br />
                    Effective: February 14, 2026 | Last updated: February 14, 2026
                </p>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Introduction</h2>
                        <p>These Terms and Conditions ("Terms") govern your access to and use of ElectroCare platform (the "Service") operated by ElectroCare ("we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service. We reserve the right to modify these Terms at any time, and such modifications shall be effective immediately upon posting. Your continued use of the Service constitutes acceptance of the modified Terms.</p>
                        <p className="mt-4">These Terms constitute the entire agreement between you and ElectroCare regarding the Service and supersede any prior agreements. Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">User Responsibilities</h2>
                        <p>You must be at least the age of legal capacity in your jurisdiction to use the Service. By using the Service, you represent and warrant that you meet this requirement. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information and to update such information as necessary.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Account Usage</h2>
                        <p>An account is required to access and use our Service. You must create an account and provide accurate information to register. You are responsible for safeguarding your password and for any activities under your account. We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.</p>
                        <p className="mt-4">User-generated content is not permitted on our Service. You may not upload, post, or transmit any content except as expressly permitted by us. Any unauthorized content may be removed without notice.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Service Availability</h2>
                        <p>We strive to maintain the availability of the Service but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service or any part thereof at any time, with or without notice. We may make such changes without prior notice. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Limitation of Liability</h2>
                        <p>Our liability is governed by applicable law. We shall not be liable for any indirect or consequential losses. You use the Service at your own risk.</p>
                        <p className="mt-4">The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Termination</h2>
                        <p>Account termination may be subject to our policies and procedures. We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Service will cease immediately. Provisions that by their nature should survive termination shall survive.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of GUJARAT, INDIA, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of GUJARAT, INDIA.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Contact Information</h2>
                        <p>For questions about these Terms, please contact us at kailashsinhrajput25@gmail.com, or write to us at ahmedabad, gujarat, india - 380007. You may also reach us by phone at +91 9712360092. We will respond to your inquiries as promptly as practicable.</p>
                        <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="font-bold">ElectroCare</p>
                            <p>ahmedabad, gujarat, india - 380007</p>
                            <p>Email: <a href="mailto:kailashsinhrajput25@gmail.com" className="text-indigo-600 hover:underline">kailashsinhrajput25@gmail.com</a></p>
                            <p>Customer support: +91 9712360092</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
