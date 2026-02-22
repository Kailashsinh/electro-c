import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Upload, Camera, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
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
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sm:mx-auto sm:w-full sm:max-w-md"
                >
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Verification Pending</h2>
                        <p className="text-slate-600 mb-6">
                            Your documents have been submitted and are currently under review by our admin team.
                            You will be notified once your account is approved.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Refresh Status
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Technician Verification</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            We need to verify your identity before you can start accepting jobs.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {user?.verificationStatus === 'rejected' && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Verification Rejected</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{user.documents?.rejection_reason || "Your documents were rejected. Please upload valid documents."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Step 1: Aadhaar Number & Upload */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Aadhaar Number <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={aadhaarNumber}
                                    onChange={(e) => setAadhaarNumber(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Enter 12-digit Aadhaar Number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Upload Aadhaar Card (Front) <span className="text-red-500">*</span></label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-indigo-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                        <div className="flex text-sm text-slate-600">
                                            <label htmlFor="id-proof-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="id-proof-upload" name="id-proof" type="file" className="sr-only" accept="image/*" onChange={(e) => setIdProof(e.target.files?.[0] || null)} required />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                                        {idProof && <p className="text-sm text-emerald-600 font-semibold mt-2">{idProof.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Live Photo */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Live Photo Verification <span className="text-red-500">*</span></label>
                            <div className="border rounded-lg overflow-hidden bg-black aspect-video relative">
                                {livePhoto ? (
                                    <div className="relative h-full w-full">
                                        <img src={URL.createObjectURL(livePhoto)} alt="Live Capture" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setLivePhoto(null)}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs"
                                        >
                                            Retake
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-full object-cover"
                                            videoConstraints={{ facingMode: "user" }}
                                        />
                                        <button
                                            type="button"
                                            onClick={capture}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-slate-100"
                                        >
                                            <Camera className="w-5 h-5" /> Capture
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Please ensure your face is clearly visible.</p>
                        </div>

                        {/* Step 3: Certification (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Certification (Optional)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-indigo-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <label htmlFor="cert-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="cert-upload" name="id-proof" type="file" className="sr-only" accept="image/*" onChange={(e) => setCertification(e.target.files?.[0] || null)} />
                                        </label>
                                    </div>
                                    {certification && <p className="text-sm text-emerald-600 font-semibold mt-2">{certification.name}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit for Verification"
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default VerificationPage;
