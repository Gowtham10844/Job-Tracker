// src/pages/Kanban.jsx
import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import {
  KanbanSquare,
  PlusCircle,
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'Applied', title: 'Applied', color: 'border-blue-500 text-blue-700 bg-blue-50' },
  { id: 'Online Assessment', title: 'Online Assessment', color: 'border-purple-500 text-purple-700 bg-purple-50' },
  { id: 'Interview', title: 'Interview', color: 'border-amber-500 text-amber-700 bg-amber-50' },
  { id: 'Offer Received', title: 'Offer Received', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
  { id: 'Rejected', title: 'Rejected', color: 'border-rose-500 text-rose-700 bg-rose-50' },
  { id: 'Withdrawn', title: 'Withdrawn', color: 'border-slate-500 text-slate-700 bg-slate-100' },
];

const Kanban = ({ onOpenAddModal, onOpenDetailsModal }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAll();
      if (res.success) {
        setApplications(res.data);
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching applications for Kanban');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await applicationService.update(appId, { status: newStatus });
      if (res.success) {
        setApplications(prev =>
          prev.map(item => (item._id === appId ? { ...item, status: newStatus } : item))
        );
        toast.success(`Moved to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update stage');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Loading Kanban board...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KanbanSquare className="w-5 h-5 text-blue-600" />
            Recruitment Pipeline (Kanban)
          </h2>
          <p className="text-xs text-slate-500">
            Visualize and transition your applications across hiring milestones
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Application</span>
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);
          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-slate-100/80 rounded-xl p-3 border border-slate-200/80 flex flex-col max-h-[calc(100vh-220px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[0].replace('border-', 'bg-')}`} />
                  <span className="text-xs font-bold text-slate-800 tracking-tight">{col.title}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {colApps.length}
                </span>
              </div>

              {/* Column Application Cards */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg bg-white/50">
                    No applications
                  </div>
                ) : (
                  colApps.map(app => (
                    <div
                      key={app._id}
                      onClick={() => onOpenDetailsModal(app)}
                      className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {app.companyName}
                        </h4>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {app.jobType}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-slate-600 mb-2">{app.jobRole}</p>

                      {app.interviewDate && (
                        <div className="mb-2 p-1.5 rounded bg-amber-50 border border-amber-200 flex items-center gap-1.5 text-[10px] text-amber-800 font-semibold">
                          <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>
                            {new Date(app.interviewDate).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {app.location || app.workMode}
                        </span>

                        {/* Move Stage Selector */}
                        <div onClick={e => e.stopPropagation()}>
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app._id, e.target.value)}
                            className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 hover:bg-slate-100"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Online Assessment">OA</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer Received">Offer</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;
