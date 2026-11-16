// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Toaster, toast } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Kanban from './pages/Kanban';
import Interviews from './pages/Interviews';
import Profile from './pages/Profile';

// Modals
import ApplicationModal from './components/ApplicationModal';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import { applicationService } from './services/api';

function AppContent() {
  const [modalState, setModalState] = useState({
    addEditOpen: false,
    detailsOpen: false,
    deleteOpen: false,
    currentApp: null,
    appToDelete: null,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const handleOpenAdd = () => {
    setModalState({
      addEditOpen: true,
      detailsOpen: false,
      deleteOpen: false,
      currentApp: null,
      appToDelete: null,
    });
  };

  const handleOpenEdit = app => {
    setModalState(prev => ({
      ...prev,
      addEditOpen: true,
      detailsOpen: false,
      currentApp: app,
    }));
  };

  const handleOpenDetails = app => {
    setModalState(prev => ({
      ...prev,
      detailsOpen: true,
      currentApp: app,
    }));
  };

  const handleOpenDelete = app => {
    setModalState(prev => ({
      ...prev,
      deleteOpen: true,
      appToDelete: app,
    }));
  };

  const handleCloseModals = () => {
    setModalState({
      addEditOpen: false,
      detailsOpen: false,
      deleteOpen: false,
      currentApp: null,
      appToDelete: null,
    });
  };

  const handleSaveApplication = async formData => {
    try {
      if (formData._id) {
        await applicationService.update(formData._id, formData);
        toast.success('Application updated successfully');
      } else {
        await applicationService.create(formData);
        toast.success('New application tracked successfully');
      }
      handleCloseModals();
      triggerRefresh();
    } catch (error) {
      toast.error(error.message || 'Error saving application');
    }
  };

  const handleDeleteApplication = async () => {
    if (!modalState.appToDelete) return;
    try {
      await applicationService.delete(modalState.appToDelete._id);
      toast.success('Application removed successfully');
      handleCloseModals();
      triggerRefresh();
    } catch (error) {
      toast.error(error.message || 'Error deleting application');
    }
  };

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.update(appId, { status: newStatus });
      toast.success(`Application updated to ${newStatus}`);
      triggerRefresh();
      if (modalState.currentApp && modalState.currentApp._id === appId) {
        setModalState(prev => ({
          ...prev,
          currentApp: { ...prev.currentApp, status: newStatus },
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Error updating status');
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '13px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout onOpenAddModal={handleOpenAdd}>
                <Routes>
                  <Route
                    path="/dashboard"
                    element={
                      <Dashboard key={refreshKey} onOpenAddModal={handleOpenAdd} />
                    }
                  />
                  <Route
                    path="/applications"
                    element={
                      <Applications
                        key={refreshKey}
                        onOpenAddModal={handleOpenAdd}
                        onOpenEditModal={handleOpenEdit}
                        onOpenDetailsModal={handleOpenDetails}
                        onOpenDeleteModal={handleOpenDelete}
                      />
                    }
                  />
                  <Route
                    path="/kanban"
                    element={
                      <Kanban
                        key={refreshKey}
                        onOpenAddModal={handleOpenAdd}
                        onOpenDetailsModal={handleOpenDetails}
                      />
                    }
                  />
                  <Route
                    path="/interviews"
                    element={
                      <Interviews
                        key={refreshKey}
                        onOpenAddModal={handleOpenAdd}
                        onOpenEditModal={handleOpenEdit}
                        onOpenDetailsModal={handleOpenDetails}
                      />
                    }
                  />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Global Modals */}
      <ApplicationModal
        isOpen={modalState.addEditOpen}
        onClose={handleCloseModals}
        currentApplication={modalState.currentApp}
        onSave={handleSaveApplication}
      />

      <ApplicationDetailsModal
        isOpen={modalState.detailsOpen}
        onClose={handleCloseModals}
        application={modalState.currentApp}
        onEdit={handleOpenEdit}
        onDelete={id => handleOpenDelete(modalState.currentApp)}
        onStatusChange={handleQuickStatusChange}
      />

      <DeleteConfirmModal
        isOpen={modalState.deleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteApplication}
        title="Delete Job Application"
        message={`Are you sure you want to remove your application for ${
          modalState.appToDelete?.companyName || 'this company'
        }? This record will be permanently deleted.`}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
