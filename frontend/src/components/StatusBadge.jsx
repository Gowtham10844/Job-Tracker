// src/components/StatusBadge.jsx
import React from 'react';

const statusConfig = {
  'Applied': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  'Online Assessment': {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  'Interview': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  'Offer Received': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'Rejected': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
  'Withdrawn': {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  };

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'md' 
    ? 'px-3 py-1 text-sm font-medium' 
    : 'px-2.5 py-0.5 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
