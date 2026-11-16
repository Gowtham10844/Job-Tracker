// src/components/ApplicationDetailsModal.jsx
import React from 'react';
import {
  X,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Clock,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden transition-all animate-in fade-in duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xl shrink-0 border border-blue-200">
              {application.companyName ? application.companyName[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900">{application.companyName}</h3>
                <StatusBadge status={application.status} size="sm" />
              </div>
              <p className="text-sm font-medium text-slate-600 mt-0.5">{application.jobRole}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status Quick Switch */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Quick Stage Update:</span>
            <select
              value={application.status}
              onChange={e => onStatusChange(application._id, e.target.value)}
              className="text-xs font-medium bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Key Meta Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Briefcase className="w-3.5 h-3.5" /> Job Type & Mode
              </span>
              <p className="font-semibold text-slate-800">
                {application.jobType} • {application.workMode}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <p className="font-semibold text-slate-800">{application.location || 'Not Specified'}</p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Applied On
              </span>
              <p className="font-semibold text-slate-800">
                {new Date(application.applicationDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
              <span className="text-slate-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Compensation
              </span>
              <p className="font-semibold text-slate-800">{application.salary || 'Not Disclosed'}</p>
            </div>
          </div>

          {/* Scheduled Interview Card */}
          {application.interviewDate && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-900">Scheduled Interview</p>
                  <p className="text-xs text-amber-700">
                    {new Date(application.interviewDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-200/70 text-amber-800">
                Upcoming
              </span>
            </div>
          )}

          {/* Job Post URL */}
          {application.jobLink && (
            <div>
              <span className="text-xs font-semibold text-slate-500 mb-1 block">External Posting</span>
              <a
                href={application.jobLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline break-all"
              >
                <span>{application.jobLink}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

          {/* Notes */}
          <div>
            <span className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Notes & Checklist
            </span>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {application.notes || 'No notes added for this application.'}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(application._id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(application);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
