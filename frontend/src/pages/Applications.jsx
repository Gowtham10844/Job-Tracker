// src/pages/Applications.jsx
import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  Loader2,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const Applications = ({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailsModal,
  onOpenDeleteModal,
}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (jobTypeFilter !== 'All') params.jobType = jobTypeFilter;
      if (workModeFilter !== 'All') params.workMode = workModeFilter;
      if (sortBy) params.sort = sortBy;

      const res = await applicationService.getAll(params);
      if (res.success) {
        setApplications(res.data);
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplications();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, jobTypeFilter, workModeFilter, sortBy]);

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await applicationService.update(id, { status: newStatus });
      if (res.success) {
        setApplications(prev =>
          prev.map(app => (app._id === id ? { ...app, status: newStatus } : app))
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }

    const headers = [
      'Company Name',
      'Job Role',
      'Job Type',
      'Work Mode',
      'Location',
      'Status',
      'Application Date',
      'Interview Date',
      'Salary',
      'Job Link',
      'Notes',
    ];

    const rows = applications.map(app => [
      `"${app.companyName.replace(/"/g, '""')}"`,
      `"${app.jobRole.replace(/"/g, '""')}"`,
      `"${app.jobType}"`,
      `"${app.workMode}"`,
      `"${app.location || ''}"`,
      `"${app.status}"`,
      `"${new Date(app.applicationDate).toISOString().split('T')[0]}"`,
      `"${app.interviewDate ? new Date(app.interviewDate).toISOString() : ''}"`,
      `"${app.salary || ''}"`,
      `"${app.jobLink || ''}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `JobTrack_Applications_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Applications exported to CSV successfully');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setJobTypeFilter('All');
    setWorkModeFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Job Applications</h2>
          <p className="text-xs text-slate-500">
            Manage, filter, and monitor all your submitted applications ({applications.length})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by company, role, or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Online Assessment">Online Assessment</option>
              <option value="Interview">Interview</option>
              <option value="Offer Received">Offer Received</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="md:col-span-2">
            <select
              value={jobTypeFilter}
              onChange={e => setJobTypeFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
            >
              <option value="All">All Job Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="md:col-span-2">
            <select
              value={workModeFilter}
              onChange={e => setWorkModeFilter(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
            >
              <option value="All">All Work Modes</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="company_asc">Company (A-Z)</option>
              <option value="company_desc">Company (Z-A)</option>
              <option value="interview_soonest">Interview Soonest</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Tags & Clear */}
        {(searchTerm || statusFilter !== 'All' || jobTypeFilter !== 'All' || workModeFilter !== 'All') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Filtered results matching criteria</span>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center max-w-sm mx-auto">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">No Applications Found</h4>
            <p className="text-xs text-slate-500 mb-4">
              {searchTerm || statusFilter !== 'All'
                ? 'Try adjusting your search queries or active filters.'
                : 'Start logging your applications to view them in this centralized list.'}
            </p>
            {searchTerm || statusFilter !== 'All' ? (
              <button
                onClick={clearFilters}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Add Application
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Type & Mode</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status & Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map(app => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onOpenDetailsModal(app)}
                  >
                    {/* Company */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-100 shrink-0">
                          {app.companyName[0].toUpperCase()}
                        </div>
                        <span className="truncate max-w-[150px]">{app.companyName}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      <div className="truncate max-w-[180px]">{app.jobRole}</div>
                    </td>

                    {/* Type & Mode */}
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {app.jobType} • {app.workMode}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-500">
                      <span className="truncate max-w-[120px] block">
                        {app.location || 'Not Specified'}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(app.applicationDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status with Quick Select */}
                    <td
                      className="py-3 px-4"
                      onClick={e => e.stopPropagation()} // don't open modal when changing status dropdown
                    >
                      <select
                        value={app.status}
                        onChange={e => handleQuickStatusChange(app._id, e.target.value)}
                        className="text-xs font-medium border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Online Assessment">Online Assessment</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3 px-4 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View Details"
                          onClick={() => onOpenDetailsModal(app)}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Application"
                          onClick={() => onOpenEditModal(app)}
                          className="p-1 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Application"
                          onClick={() => onOpenDeleteModal(app)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
