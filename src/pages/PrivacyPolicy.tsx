import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Privacy Policy</h1>
                <p className="text-slate-500 mb-8 border-b border-slate-100 pb-8">
                    ElectroCare – ElectroCare platform<br />
                    Effective: February 14, 2026 | Last updated: February 14, 2026
                </p>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Introduction</h2>
                        <p>This Privacy Policy describes how ElectroCare ("we," "us," or "our") collects, uses, discloses, and protects information when you access or use ElectroCare platform (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your privacy and handling your data in an open and transparent manner. This policy applies to all users of our Service, including visitors, registered users, and customers.</p>
                        <p className="mt-4">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes your acceptance of the revised policy. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Information We Collect</h2>
                        <p>We may collect certain personal and technical information when you interact with our Service. This information may include identifiers such as email addresses, names and identifiers, phone numbers, account credentials and profile information, payment and billing information, and other data that help us understand how the Service is used. Collecting this information enables us to operate the Service efficiently, improve functionality, maintain security, and comply with our legal obligations. We collect information that you provide directly to us, as well as information that we obtain automatically through your use of the Service.</p>
                        <p className="mt-4">The purposes for which we use your personal data include providing and maintaining the Service, communicating with you, processing transactions where applicable, improving our offerings, ensuring the security and integrity of our systems, and complying with applicable laws and regulations. We will not use your personal data for purposes incompatible with those described in this policy without obtaining your consent where required by law. We take reasonable steps to ensure that your data is accurate, complete, and kept up to date.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">How We Use Information</h2>
                        <p>We retain your personal data for as long as necessary to provide the Service and fulfil the purposes described in this policy. Specifically, we retain user data for: Until account deletion. After this period, we will delete or anonymize your data unless we are required or permitted to retain it for legal, regulatory, or legitimate business purposes. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">User Rights</h2>
                        <p>You may have certain rights regarding your personal data under applicable data protection laws, including the right to access, correct, or request restriction of processing. The extent of these rights depends on your jurisdiction. To exercise any applicable rights, please contact us at kailashsinhrajput25@gmail.com. We will respond to your request in accordance with applicable law.</p>
                        <p className="mt-4">We may collect data from children under 13 only with verifiable parental consent and in compliance with applicable laws, including the Children's Online Privacy Protection Act (COPPA) where applicable. Parents may review, correct, or request deletion of their child's data. If you believe we have collected data from a child without appropriate consent, please contact us immediately at kailashsinhrajput25@gmail.com.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-slate-900">Contact Information</h2>
                        <p>For privacy-related inquiries, to exercise your rights, or to contact our data protection contact, please write to us at: kailashsinhrajput25@gmail.com. You may also reach us at ahmedabad, gujarat, india - 380007 or by phone at +91 9712360092. We will respond within the timeframes required by applicable law. Our data protection team is available to assist you with any questions or concerns regarding this policy or your personal data.</p>
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

export default PrivacyPolicy;
