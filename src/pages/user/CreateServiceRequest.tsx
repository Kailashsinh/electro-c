import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { applianceApi } from '@/api/appliances';
import { paymentApi } from '@/api/payments';
import { subscriptionServiceApi, subscriptionApi } from '@/api/subscriptions';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Clock, Smartphone, CreditCard, XCircle, ArrowRight, ArrowLeft, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import ErrorBoundary from '@/components/ErrorBoundary';
import PaymentGatewayModal from '@/components/PaymentGatewayModal';
import { AnimatePresence } from 'framer-motion';

const slots = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 3 PM)', 'Evening (5 PM - 7 PM)', 'Night (7 PM - 9 PM)'];

const CreateServiceRequest: React.FC = () => {
  const [appliances, setAppliances] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    appliance_id: '',
    issue_desc: '',
    preferred_slot: 'Morning (9 AM - 12 PM)',
    scheduled_date: new Date().toISOString().split('T')[0],
    method: 'UPI'
  });
  const [useSubscription, setUseSubscription] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMode, setLocationMode] = useState<'gps' | 'manual'>('gps');
  const [manualAddress, setManualAddress] = useState({ street: '', city: '', pincode: '' });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    Promise.allSettled([applianceApi.getMyAppliances(), subscriptionApi.getMy()])
      .then(([appRes, subRes]) => {
        let loadedAppliances = [];
        if (appRes.status === 'fulfilled') {
          loadedAppliances = appRes.value.data?.appliances || appRes.value.data || [];
          setAppliances(loadedAppliances);
        }
        if (subRes.status === 'fulfilled') setSubscription(subRes.value.data?.subscription || subRes.value.data);

        if (state) {
          const { applianceId, description, category } = state;
          let prefillId = '';
          if (applianceId) {
            prefillId = applianceId;
          }
          else if (category && loadedAppliances.length > 0) {
            const match = loadedAppliances.find((a: any) =>
              a.category?.name?.toLowerCase() === category.toLowerCase() ||
              a.category?.name?.toLowerCase().includes(category.toLowerCase())
            );
            if (match) prefillId = match._id;
          }

          setForm(prev => ({
            ...prev,
            appliance_id: prefillId,
            issue_desc: description || prev.issue_desc
          }));

          if (description) {
            toast({ title: 'Details Pre-filled', description: 'Problem details have been loaded.' });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [state]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 4) {
      toast({ title: 'Limit Exceeded', description: 'Maximum 4 images allowed.', variant: 'destructive' });
      return;
    }
    setImageFiles([...imageFiles, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === 1 && (!form.appliance_id || !form.issue_desc)) {
      toast({ title: 'Missing Information', description: 'Please select an appliance and describe the issue.', variant: 'destructive' });
      return;
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (locationMode === 'gps' && !location) {
      toast({ title: 'Location Required', description: 'Please pin your location on the map.', variant: 'destructive' });
      return;
    }

    if (useSubscription) {
      submitRequest();
    } else {
      setShowPaymentModal(true);
    }
  };

  const submitRequest = async (paymentMethod?: string) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('appliance_id', form.appliance_id);
      formData.append('issue_desc', form.issue_desc);
      formData.append('preferred_slot', form.preferred_slot);
      formData.append('scheduled_date', form.scheduled_date);

      imageFiles.forEach(file => { formData.append('issue_images', file); });

      if (locationMode === 'gps') {
        formData.append('latitude', location!.lat.toString());
        formData.append('longitude', location!.lng.toString());
      } else {
        formData.append('address_details', JSON.stringify({ ...manualAddress, manual: true }));
        formData.append('latitude', '0');
        formData.append('longitude', '0');
      }

      if (useSubscription) {
        await subscriptionServiceApi.create(formData);
      } else {
        formData.append('method', paymentMethod || 'UPI');
        await paymentApi.payVisitFee(formData);
      }
      toast({ title: 'Request Sent!', description: 'A technician will be assigned to your request shortly.' });
      navigate('/user/requests');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create request', variant: 'destructive' });
    } finally {
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="relative min-h-screen">
      {/* Aurora Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f8fafc] overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-500/10 blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-4">
        {/* Progress HUD */}
        <div className="flex items-center justify-between px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4 group">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${step >= s ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                {step > s ? <CheckCircle className="h-6 w-6" /> : s}
              </div>
              {s < 3 && <div className={`h-1 w-12 md:w-24 rounded-full transition-all duration-500 ${step > s ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left px-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight uppercase italic leading-none">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-300% animate-gradient">Request.</span>
          </h1>
          <p className="text-slate-500 mt-4 font-bold italic text-lg pb-6 border-b border-slate-200">Step {step}: {step === 1 ? 'Problem Details' : step === 2 ? 'Schedule Time' : 'Location Details'}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-premium p-8 lg:p-12 border-white/60 shadow-2xl mx-4"
          >
            {step === 1 && (
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                    <Zap className="h-6 w-6 text-indigo-600" /> Select Appliance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appliances.map((a: any) => (
                      <div
                        key={a._id}
                        onClick={() => setForm({ ...form, appliance_id: a._id })}
                        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${form.appliance_id === a._id ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-500/10' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                      >
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${form.appliance_id === a._id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-950 uppercase italic text-sm">{a.model?.name || 'Appliance'}</p>
                          <p className="text-[10px] font-bold text-slate-400 truncate w-32">{a.serial_number || a._id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                    <ImageIcon className="h-6 w-6 text-indigo-600" /> Describe Problem
                  </h2>
                  <textarea
                    value={form.issue_desc}
                    onChange={(e) => setForm({ ...form, issue_desc: e.target.value })}
                    required
                    rows={4}
                    placeholder="What's wrong with the appliance?"
                    className="w-full px-6 py-5 rounded-3xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none resize-none font-bold italic lg:text-lg"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {imagePreviews.map((src, index) => (
                      <motion.div key={index} className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-lg group">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <XCircle className="w-8 h-8" />
                        </button>
                      </motion.div>
                    ))}
                    {imageFiles.length < 4 && (
                      <label className="aspect-square rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600 hover:scale-[1.02]">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{imageFiles.length}/4 Images</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-indigo-600" /> Select Date
                  </h2>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.scheduled_date}
                    onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                    className="w-full px-8 py-6 rounded-3xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-black italic text-2xl uppercase tracking-tighter"
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                    <Clock className="h-6 w-6 text-indigo-600" /> Choose Time Slot
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {slots.map(s => (
                      <div
                        key={s}
                        onClick={() => setForm({ ...form, preferred_slot: s })}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${form.preferred_slot === s ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/5' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'}`}
                      >
                        <span className="font-black text-slate-950 uppercase italic text-sm">{s}</span>
                        <div className={`h-4 w-4 rounded-full border-2 border-indigo-600 flex items-center justify-center ${form.preferred_slot === s ? 'bg-indigo-600' : 'bg-transparent'}`}>
                          {form.preferred_slot === s && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-6">
                  <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-indigo-600" /> Service Location
                  </h2>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
                    <button type="button" onClick={() => setLocationMode('gps')} className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${locationMode === 'gps' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-950'}`}>Use Map</button>
                    <button type="button" onClick={() => setLocationMode('manual')} className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${locationMode === 'manual' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-950'}`}>Enter Manually</button>
                  </div>
                </div>

                {locationMode === 'gps' ? (
                  <div className="space-y-4">
                    <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl relative z-0">
                      <ErrorBoundary fallback={<div className="h-[400px] flex items-center justify-center bg-slate-50 text-red-500 font-black uppercase">Map unavailable.</div>}>
                        <LocationPicker onLocationSelect={setLocation} />
                      </ErrorBoundary>
                    </div>
                    {!location && <p className="text-xs text-fuchsia-600 font-black uppercase tracking-[0.2em] italic text-center">Error: Please select a location on the map.</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Street Name / House No.</label>
                      <input type="text" required value={manualAddress.street} onChange={(e) => setManualAddress({ ...manualAddress, street: e.target.value })} placeholder="e.g. Skyline Avenue" className="w-full px-8 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold italic" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">City</label>
                      <input type="text" required value={manualAddress.city} onChange={(e) => setManualAddress({ ...manualAddress, city: e.target.value })} placeholder="e.g. Neo Tokyo" className="w-full px-8 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold italic" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pincode</label>
                      <input type="text" required pattern="[0-9]{6}" maxLength={6} value={manualAddress.pincode} onChange={(e) => setManualAddress({ ...manualAddress, pincode: e.target.value })} placeholder="635091" className="w-full px-8 py-5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold italic tracking-widest" />
                    </div>
                  </div>
                )}

                {subscription?.status === 'active' && (
                  <div className="group relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-emerald-500 to-teal-500 cursor-pointer shadow-xl shadow-emerald-500/20" onClick={() => setUseSubscription(!useSubscription)}>
                    <div className={`relative p-6 rounded-[22px] transition-all flex items-center gap-6 ${useSubscription ? 'bg-white/0 text-white' : 'bg-white text-slate-900 border border-emerald-100'}`}>
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${useSubscription ? 'bg-white text-emerald-600 rotate-[360deg]' : 'bg-emerald-100 text-emerald-600'}`}>
                        {useSubscription ? <CheckCircle className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-black uppercase italic tracking-tighter text-xl">Premium Plan Active</p>
                        <p className={`text-xs font-bold italic transition-colors ${useSubscription ? 'text-emerald-50' : 'text-slate-500'}`}>Waive visit fee (₹200 savings) via current membership.</p>
                      </div>
                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${useSubscription ? 'border-white scale-110' : 'border-slate-200'}`}>
                        {useSubscription && <div className="h-4 w-4 bg-white rounded-full animate-pulse" />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-12 pt-10 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="h-16 px-8 rounded-2xl bg-slate-100 text-slate-950 font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">
                  <ArrowLeft className="h-5 w-5" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button type="button" onClick={nextStep} className="h-16 px-10 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest">
                  Next <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={submitting}
                  className="h-16 px-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {submitting ? <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                    <>{useSubscription ? <Zap className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />} {useSubscription ? 'Submit Request' : 'Book & Pay ₹200'}</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <PaymentGatewayModal
        amount={200}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={(method) => submitRequest(method)}
      />
    </div>
  );
};

export default CreateServiceRequest;
