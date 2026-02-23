import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, CheckCircle, AlertCircle, Loader2, Clock, Shield, UserCheck, FileText } from 'lucide-react';
import { technicianApi } from '@/api/technician';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const VerificationPage: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const webcamRef = useRef<Webcam>(null);

    const [step, setStep] = useState(1);
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [idProof, setIdProof] = useState<File | null>(null);
    const [livePhoto, setLivePhoto] = useState<Blob | null>(null);
    const [certification, setCertification] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Camera Handlers
    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                // Convert base64 to blob
                fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => setLivePhoto(blob));
            }
        }
    }, [webcamRef]);

    useEffect(() => {
        if (user?.verificationStatus === 'approved') {
            navigate('/technician/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aadhaarNumber || !idProof || !livePhoto) {
            toast.error("Please complete all required fields.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('aadhaar_number', aadhaarNumber);
        if (idProof) formData.append('id_proof', idProof);
        if (livePhoto) formData.append('live_photo', livePhoto, 'live-capture.jpg');
        if (certification) {
            formData.append('certification', certification);
        }

        try {
            await technicianApi.uploadDocuments(formData);
            toast.success("Verification documents submitted successfully!");
            await refreshProfile(); // Refresh profile to update status
            // navigate('/technician/dashboard'); // Don't redirect, let the UI update to "Pending"
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user?.verificationStatus === 'submitted') {
        return (
            <div className="min-h-screen pb-20 relative overflow-hidden flex items-center justify-center p-6">
                {/* Animated Aurora Background */}
                <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full"
                >
                    <div className="glass-premium rounded-[3rem] p-12 text-center border-white/60 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                            <Shield className="h-40 w-40 text-indigo-600" />
                        </div>

                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-100 relative shadow-xl shadow-indigo-500/10">
                            <Clock className="h-10 w-10 text-indigo-600 animate-pulse" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-indigo-500/30 rounded-[2rem]"
                            />
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                                Verification: Under Review
                            </div>
                            <h2 className="text-4xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">
                                Verification <span className="text-indigo-600">Pending</span>
                            </h2>
                            <p className="text-slate-500 font-bold italic leading-relaxed">
                                Your application documents are currently being reviewed by our verification system. Return here once approved.
                            </p>
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100 relative z-10">
                            <button
                                onClick={() => window.location.reload()}
                                className="h-14 px-10 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 mx-auto"
                            >
                                <Loader2 className="h-4 w-4 animate-spin" /> Refresh Status
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden px-6 pt-10">
            {/* Animated Aurora Background */}
            <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header HUD */}
                <div className="glass-premium rounded-[2.5rem] p-10 border-white/60 shadow-2xl relative overflow-hidden group mb-10">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <UserCheck className="h-32 w-32 text-indigo-600" />
                    </div>
                    <div className="relative z-10 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                            Status: Loading
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
                            Verification <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Process</span>
                        </h1>
                        <p className="text-slate-500 font-bold italic max-w-xl">
                            Identity verification required before starting your work. Upload valid documents to activate your account.
                        </p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {user?.verificationStatus === 'rejected' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass-premium rounded-[2rem] p-6 border-rose-100 bg-rose-50/30 flex items-start gap-4"
                            >
                                <div className="h-10 w-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 flex-shrink-0">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-rose-900 uppercase italic">Verification Rejected</h3>
                                    <p className="text-xs font-bold text-rose-700/80 mt-1 italic leading-relaxed">
                                        {user.documents?.rejection_reason || "Your documentation did not meet our requirements. Please re-upload valid documents."}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <div className="glass-premium rounded-[3rem] p-10 border-white/60 shadow-2xl space-y-10">
                            {/* Step 1: Aadhaar */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic text-sm">01</div>
                                    <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">ID Verification</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-2 block group-focus-within:text-indigo-600 transition-colors">Aadhaar Number</label>
                                        <input
                                            type="text"
                                            value={aadhaarNumber}
                                            onChange={(e) => setAadhaarNumber(e.target.value)}
                                            className="w-full h-14 pl-6 pr-6 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all font-black text-slate-900 placeholder:slate-400"
                                            placeholder="XXXX XXXX XXXX"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 mb-3 block">Upload ID Photo</label>
                                        <div className="relative group/upload">
                                            <input
                                                id="id-proof-upload"
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => setIdProof(e.target.files?.[0] || null)}
                                                required
                                            />
                                            <label
                                                htmlFor="id-proof-upload"
                                                className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 group-hover/upload:border-indigo-400 group-hover/upload:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden p-6"
                                            >
                                                {idProof ? (
                                                    <div className="text-center group-hover/upload:scale-110 transition-transform">
                                                        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-900 uppercase italic truncate max-w-[200px]">{idProof.name}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-slate-400 mb-3 group-hover/upload:text-indigo-500 group-hover/upload:animate-bounce" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload ID Card Front</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Live Photo */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic text-sm">02</div>
                                    <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">Take a Photo</h3>
                                </div>

                                <div className="rounded-[2rem] overflow-hidden bg-slate-950 aspect-video relative shadow-2xl group/camera border-4 border-white shadow-indigo-500/10">
                                    <AnimatePresence mode="wait">
                                        {livePhoto ? (
                                            <motion.div
                                                key="capture"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="relative h-full w-full"
                                            >
                                                <img src={URL.createObjectURL(livePhoto)} alt="Live Capture" className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-6">
                                                    <button
                                                        type="button"
                                                        onClick={() => setLivePhoto(null)}
                                                        className="h-12 px-6 bg-rose-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-700 transition-all active:scale-95"
                                                    >
                                                        Discard & Retake
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="webcam"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="h-full w-full"
                                            >
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    className="w-full h-full object-cover opacity-80"
                                                    videoConstraints={{ facingMode: "user" }}
                                                />
                                                {/* Shutter Effect Overlay */}
                                                <div className="absolute inset-0 pointer-events-none border-[30px] border-slate-950/20" />
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 border border-white/20 rounded-full flex items-center justify-center">
                                                    <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping" />
                                                </div>

                                                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={capture}
                                                        className="h-16 w-16 bg-white text-slate-950 rounded-full font-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all group/shutter"
                                                    >
                                                        <Camera className="h-7 w-7 group-active/shutter:scale-75 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center italic leading-relaxed">
                                    Your face must be clear for verification. Background should be neutral.
                                </p>
                            </div>

                            {/* Step 3: Certification */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black italic text-sm">03</div>
                                    <h3 className="text-xl font-black text-slate-950 uppercase italic tracking-tight">Work Certification <span className="text-slate-400 font-bold">(Optional)</span></h3>
                                </div>

                                <div className="relative group/upload">
                                    <input
                                        id="cert-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={(e) => setCertification(e.target.files?.[0] || null)}
                                    />
                                    <label
                                        htmlFor="cert-upload"
                                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30 group-hover/upload:border-indigo-400 group-hover/upload:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden p-6"
                                    >
                                        {certification ? (
                                            <div className="text-center group-hover/upload:scale-110 transition-transform">
                                                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                                                <p className="text-xs font-black text-slate-900 uppercase italic truncate max-w-[200px]">{certification.name}</p>
                                            </div>
                                        ) : (
                                            <>
                                                <FileText className="h-7 w-7 text-slate-400 mb-2 group-hover/upload:text-indigo-500" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Certification Photo</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-20 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:bg-slate-950 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" /> Submitting...
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-6 h-6" /> Submit for Verification
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;
