// src/components/Layout.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Kanban Board', path: '/kanban', icon: KanbanSquare },
  { name: 'Interviews', path: '/interviews', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User },
];

const Layout = ({ children, onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
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
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  JobTrack
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Pro
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 leading-none">Application Tracker</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Add Button */}
          <div className="p-4">
            <button
              onClick={() => {
                if (onOpenAddModal) onOpenAddModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Track New Application</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {user?.name || 'Student User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate leading-tight">
                  {user?.email || 'sayimpugowtham@gmail.com'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Internship Track 2026</span>
            </div>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
