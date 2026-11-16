// src/components/DeleteConfirmModal.jsx
import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden transition-all animate-in fade-in duration-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title || 'Delete Confirmation'}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {message || 'Are you sure you want to delete this job application? This action cannot be undone.'}
          </p>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
