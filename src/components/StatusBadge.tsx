import React from 'react';
import { cn } from '@/lib/utils';

type StatusType =
  | 'pending' | 'broadcasted' | 'accepted' | 'on_the_way'
  | 'awaiting_approval' | 'approved' | 'in_progress'
  | 'completed' | 'cancelled'
  | 'active' | 'expired' | 'success' | 'failed';

const statusStyles: Record<string, string> = {
  pending: 'bg-gray-50 text-gray-600 border-gray-200',
  broadcasted: 'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
  on_the_way: 'bg-amber-50 text-amber-700 border-amber-200',
  awaiting_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  broadcasted: 'Broadcasted',
  accepted: 'Accepted',
  on_the_way: 'On the Way',
  awaiting_approval: 'Awaiting Approval',
  approved: 'Approved',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  active: 'Active',
  expired: 'Expired',
  success: 'Success',
  failed: 'Failed',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  const label = statusLabels[status] || status;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm transition-all duration-300 hover:shadow-md', style, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', {
        'bg-gray-500': status === 'pending',
        'bg-blue-500': ['broadcasted', 'accepted', 'on_the_way'].includes(status),
        'bg-indigo-500': ['awaiting_approval', 'approved', 'in_progress'].includes(status),
        'bg-emerald-500': ['completed', 'active', 'success'].includes(status),
        'bg-red-500': ['cancelled', 'expired', 'failed'].includes(status),
      })} />
      {label}
    </span>
  );
};

export default StatusBadge;
