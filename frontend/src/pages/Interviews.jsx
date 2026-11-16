// src/pages/Interviews.jsx
import React, { useState, useEffect } from 'react';
import { interviewService, applicationService } from '../services/api';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building,
  Briefcase,
  MapPin,
  ExternalLink,
  Loader2,
  CalendarDays,
  PlusCircle,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const Interviews = ({ onOpenAddModal, onOpenEditModal, onOpenDetailsModal }) => {
  const [interviewsData, setInterviewsData] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getAll();
      if (res.success) {
        setInterviewsData({
          upcoming: res.upcoming || [],
          past: res.past || [],
        });
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching interview schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500">Retrieving scheduled interviews...</p>
      </div>
    );
  }

  const hasInterviews =
    interviewsData.upcoming.length > 0 || interviewsData.past.length > 0;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-500" />
            Interview Management & Schedules
          </h2>
          <p className="text-xs text-slate-500">
            Track upcoming technical rounds, HR evaluations, and review past discussions
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {!hasInterviews ? (
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center max-w-md mx-auto shadow-2xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 mb-1">No Interviews Scheduled</h4>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            When you receive an interview invitation, set the date and time on your application to
            track it here.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Add Application with Interview
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Upcoming Rounds ({interviewsData.upcoming.length})
              </h3>
            </div>

            {interviewsData.upcoming.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                No upcoming interviews currently on your calendar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interviewsData.upcoming.map(item => (
                  <div
                    key={item._id}
                    onClick={() => onOpenDetailsModal(item)}
                    className="p-5 bg-white rounded-xl border border-amber-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.companyName}</h4>
                        <p className="text-xs font-medium text-slate-600">{item.jobRole}</p>
                      </div>
                      <StatusBadge status={item.status} size="xs" />
                    </div>

                    {/* Interview Date & Countdown */}
                    <div className="p-3 my-3 bg-amber-50/70 rounded-lg border border-amber-100 flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="leading-tight">
                          {new Date(item.interviewDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-[11px] font-normal text-amber-700">
                          {new Date(item.interviewDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>{item.workMode} • {item.location}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenEditModal(item);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Interviews Section */}
          {interviewsData.past.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">
                  Completed / Past Interviews ({interviewsData.past.length})
                </h3>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Company</th>
                        <th className="py-2.5 px-4">Role</th>
                        <th className="py-2.5 px-4">Interview Date</th>
                        <th className="py-2.5 px-4">Current Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {interviewsData.past.map(item => (
                        <tr
                          key={item._id}
                          onClick={() => onOpenDetailsModal(item)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-4 font-bold text-slate-800">
                            {item.companyName}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">{item.jobRole}</td>
                          <td className="py-2.5 px-4 text-slate-500">
                            {new Date(item.interviewDate).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-2.5 px-4">
                            <StatusBadge status={item.status} size="xs" />
                          </td>
                          <td
                            className="py-2.5 px-4 text-right"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              onClick={() => onOpenEditModal(item)}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Interviews;
