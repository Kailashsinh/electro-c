import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceRequestApi } from '@/api/serviceRequests';
import StatusBadge from '@/components/StatusBadge';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react';

const statusFlow = ['pending', 'broadcasted', 'accepted', 'on_the_way', 'awaiting_approval', 'approved', 'in_progress', 'completed'];
const statusLabels = ['Pending', 'Broadcasted', 'Accepted', 'On the Way', 'Awaiting', 'Approved', 'In Progress', 'Completed'];

const RequestDetails: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    serviceRequestApi.getMyRequests()
      .then((res) => {
        const all = res.data?.requests || res.data || [];
        const found = all.find((r: any) => r._id === requestId);
        setRequest(found);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [requestId]);

  const handleAction = async (action: string) => {
    if (action === 'cancel') {
      if (request.status === 'on_the_way') {
        if (!window.confirm('Technician is on the way. Cancelling now will deduct 15 loyalty points. Do you want to proceed?')) return;
      } else if (!window.confirm('Are you sure you want to cancel this request?')) {
        return;
      }
    }

    setActionLoading(action);
    try {
      if (action === 'cancel') await serviceRequestApi.cancel(requestId!);
      else if (action === 'approve') await serviceRequestApi.approveEstimate(requestId!);
      else if (action === 'verify') await serviceRequestApi.verifyOtp(requestId!, otp);
      toast({ title: 'Success', description: `Action completed` });
      const res = await serviceRequestApi.getMyRequests();
      const all = res.data?.requests || res.data || [];
      setRequest(all.find((r: any) => r._id === requestId));
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Action failed', variant: 'destructive' });
    } finally { setActionLoading(''); }
  };

  if (loading) return <LoadingSkeleton rows={4} />;
  if (!request) return <div className="glass-card p-12 text-center text-muted-foreground">Request not found</div>;

  const currentStep = statusFlow.indexOf(request.status);

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors font-medium">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-foreground">Request Details</h1>
          <StatusBadge status={request.status} />
        </div>

        {}
        <div className="mb-8">
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {statusFlow.map((s, i) => (
              <div key={s} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= currentStep
                    ? 'gradient-bg text-primary-foreground shadow-md shadow-primary/20'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    {i <= currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1.5 max-w-[60px] text-center leading-tight">{statusLabels[i]}</span>
                </div>
                {i < statusFlow.length - 1 && (
                  <div className={`h-0.5 w-6 mx-1 mt-[-16px] ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="p-4 rounded-xl bg-muted/50">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Issue</span>
            <p className="text-foreground mt-1 font-medium">{request.issue_desc}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Preferred Slot</span>
            <p className="text-foreground mt-1 font-medium">{request.preferred_slot}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Estimated Cost</span>
            <p className="text-foreground mt-1 font-medium">{request.estimated_service_cost ? `₹${request.estimated_service_cost}` : 'Pending'}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Visit Fee</span>
            <p className="text-foreground mt-1 font-medium">{request.visit_fee_paid ? `₹${request.visit_fee_amount}` : 'N/A'}</p>
          </div>
        </div>

        {}
        {request.technician_id && (
          <div className="mt-6 p-4 rounded-xl border border-border bg-card/50">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              🔧 Technician Assigned
            </h3>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {request.technician_id.name?.[0] || 'T'}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{request.technician_id.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Star className="h-3 w-3 fill-current" />
                    {request.technician_id.rating || 'N/A'}
                    <span className="text-muted-foreground/50">({request.technician_id.completed_jobs || 0} jobs)</span>
                  </span>
                  <span>📞 {request.technician_id.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="mt-8 flex flex-wrap gap-3">
          {request.status === 'awaiting_approval' && (
            <>
              <button onClick={() => handleAction('approve')} disabled={!!actionLoading} className="px-5 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-success/20">
                {actionLoading === 'approve' ? 'Approving...' : 'Approve Estimate'}
              </button>
              <button onClick={() => handleAction('cancel')} disabled={!!actionLoading} className="px-5 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 disabled:opacity-50 transition-all">
                {actionLoading === 'cancel' ? 'Declining...' : 'Decline Estimate'}
              </button>
            </>
          )}
          {request.status === 'completed' && !request.otp_verified && (
            <div className="flex items-center gap-2">
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="input-field w-32" />
              <button onClick={() => handleAction('verify')} disabled={!!actionLoading} className="px-5 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 shadow-md shadow-success/20">
                Verify
              </button>
            </div>
          )}
          {!['completed', 'cancelled', 'approved', 'in_progress', 'awaiting_approval'].includes(request.status) && (
            <button onClick={() => handleAction('cancel')} disabled={!!actionLoading} className="px-5 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 disabled:opacity-50 transition-all">
              Cancel Request
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RequestDetails;
