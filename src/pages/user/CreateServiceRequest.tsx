import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { applianceApi } from '@/api/appliances';
import { paymentApi } from '@/api/payments';
import { subscriptionServiceApi, subscriptionApi } from '@/api/subscriptions';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, Clock, PenTool, Smartphone, CreditCard } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import ErrorBoundary from '@/components/ErrorBoundary';
import PaymentGatewayModal from '@/components/PaymentGatewayModal';

const slots = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 3 PM)', 'Evening (5 PM - 7 PM)', 'Night (7 PM - 9 PM)'];

const CreateServiceRequest: React.FC = () => {
  const [appliances, setAppliances] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [form, setForm] = useState({
    appliance_id: '',
    issue_desc: '',
    preferred_slot: 'Morning (9 AM - 12 PM)',
    scheduled_date: new Date().toISOString().split('T')[0],
    method: 'UPI'
  });
  const [useSubscription, setUseSubscription] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (!slots.includes(form.preferred_slot)) {
      setForm(prev => ({ ...prev, preferred_slot: slots[0] }));
    }
  }, []);

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
            toast({ title: 'Detals Pre-filled', description: 'We copied your issue description from the troubleshooter.' });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast({ title: 'Location Required', description: 'Please select a location on the map.', variant: 'destructive' });
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
      const payload = {
        appliance_id: form.appliance_id,
        issue_desc: form.issue_desc,
        preferred_slot: form.preferred_slot,
        scheduled_date: form.scheduled_date,
        latitude: location!.lat,
        longitude: location!.lng,
      };

      if (useSubscription) {
        await subscriptionServiceApi.create(payload);
      } else {
        await paymentApi.payVisitFee({
          ...payload,
          method: paymentMethod || 'UPI'
        });
      }
      toast({ title: 'Service request created!', description: 'Technicians will be notified.' });
      navigate('/user/requests');
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create request', variant: 'destructive' });
    } finally {
      setSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={3} />;

  return (
    <div className="relative max-w-3xl mx-auto space-y-8">
      {}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Request</h1>
        <p className="text-gray-500 mt-2">Request a technician for your appliance</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 border border-white/60 shadow-xl shadow-indigo-500/5">
        <form onSubmit={handleSubmit} className="space-y-8">

          {}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              Appliance Details
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Appliance</label>
                <div className="relative">
                  <select
                    value={form.appliance_id}
                    onChange={(e) => setForm({ ...form, appliance_id: e.target.value })}
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                  >
                    <option value="">Select appliance</option>
                    {appliances.map((a: any) => (
                      <option key={a._id} value={a._id}>{a.model?.name || a.serial_number || a._id}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
                <textarea
                  value={form.issue_desc}
                  onChange={(e) => setForm({ ...form, issue_desc: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Scheduling
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={form.scheduled_date}
                  onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <div className="relative">
                  <select
                    value={form.preferred_slot}
                    onChange={(e) => setForm({ ...form, preferred_slot: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                  >
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Location
            </h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <ErrorBoundary fallback={<div className="h-[300px] flex items-center justify-center bg-gray-50 text-red-500 p-4 text-center">Failed to load map.</div>}>
                <LocationPicker onLocationSelect={setLocation} />
              </ErrorBoundary>
            </div>
          </div>

          {}
          {subscription?.status === 'active' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 cursor-pointer hover:bg-emerald-50 transition-colors" onClick={() => setUseSubscription(!useSubscription)}>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${useSubscription ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300 bg-white'}`}>
                  {useSubscription && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <p className="font-semibold text-gray-900 sm:hidden">Use Premium Subscription</p>
              </div>
              <div className="flex-1 ml-9 sm:ml-0">
                <p className="font-semibold text-gray-900 hidden sm:block">Use Premium Subscription</p>
                <p className="text-sm text-gray-500">Waive the ₹200 visit fee with your active plan.</p>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {useSubscription ? <CheckCircle className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                {useSubscription ? 'Submit Request (Free)' : 'Proceed to Pay ₹200'}
              </>
            )}
          </button>
        </form>
      </motion.div>

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
