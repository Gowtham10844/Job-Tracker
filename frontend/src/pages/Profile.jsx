// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Lock,
  Save,
  Loader2,
  LogOut,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    targetRole: user?.targetRole || 'Software Development Engineer',
    institution: user?.institution || 'B.Tech Computer Science & Engineering',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = e => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await authService.updateProfile(profileForm);
      if (res.success) {
        updateUser(res.user);
        toast.success('Profile details updated successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async e => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await authService.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.success) {
        toast.success('Password changed successfully');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const getInitials = name => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
          {getInitials(user?.name)}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {user?.targetRole || 'Software Development Engineer'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {user?.institution || 'B.Tech CSE'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Academic Details Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Personal & Academic Details</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="targetRole"
                  value={profileForm.targetRole}
                  onChange={handleProfileChange}
                  placeholder="e.g. SDE Intern, Backend Engineer"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Institution</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="institution"
                  value={profileForm.institution}
                  onChange={handleProfileChange}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Security & Password</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Enter current password"
                className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg border border-slate-200 transition-all"
            >
              {savingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
