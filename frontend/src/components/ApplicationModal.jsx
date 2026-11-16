// src/components/ApplicationModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader2, Calendar, Link, Building, Briefcase, MapPin, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const initialFormData = {
  companyName: '',
  jobRole: '',
  jobType: 'Internship',
  location: 'Bangalore, India',
  workMode: 'On-site',
  applicationDate: new Date().toISOString().split('T')[0],
  status: 'Applied',
  salary: '',
  jobLink: '',
  interviewDate: '',
  description: '',
  notes: '',
};

const ApplicationModal = ({ isOpen, onClose, currentApplication, onSave }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentApplication) {
      setFormData({
        ...initialFormData,
        ...currentApplication,
        applicationDate: currentApplication.applicationDate
          ? new Date(currentApplication.applicationDate).toISOString().split('T')[0]
          : initialFormData.applicationDate,
        interviewDate: currentApplication.interviewDate
          ? new Date(currentApplication.interviewDate).toISOString().slice(0, 16)
          : '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [currentApplication, isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.jobRole.trim()) {
      toast.error('Company Name and Job Role are required');
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        interviewDate: formData.interviewDate ? new Date(formData.interviewDate) : null,
      });
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error saving application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden transition-all animate-in fade-in duration-200 my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {currentApplication ? 'Edit Job Application' : 'Track New Job Application'}
            </h3>
            <p className="text-xs text-slate-500">
              {currentApplication
                ? 'Update stage, notes, or schedule interviews'
                : 'Enter company details to record your new recruitment entry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Google, Amazon, Microsoft"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Role / Position <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  placeholder="e.g. SDE Intern, Frontend Developer"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              >
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Application Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
              >
                <option value="Applied">Applied</option>
                <option value="Online Assessment">Online Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Remote"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>

            {/* Expected Salary / Stipend */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stipend / CTC
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹35,000 / month or ₹12 LPA"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Application Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Date
              </label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            {/* Interview Date & Time (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Scheduled Interview (Optional)
              </label>
              <input
                type="datetime-local"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Job Application URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Post / Application Link
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                placeholder="https://careers.company.com/job/12345"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Interview Notes & Preparation Checklist
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. DSA round scheduled; prepare Tree algorithms, System Design basics, resume projects..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{currentApplication ? 'Update Application' : 'Save Application'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
