// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { dashboardService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  FileCheck,
  Calendar,
  Award,
  XCircle,
  Clock,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  Layers,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = ({ onOpenAddModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
      toast.error(error.message || 'Error loading dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Calculating your application analytics...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Applications',
      count: stats?.total || 0,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Online Assessments',
      count: stats?.onlineAssessment || 0,
      icon: FileCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
    },
    {
      title: 'Interviews Scheduled',
      count: stats?.interviews || 0,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Offers Received',
      count: stats?.offers || 0,
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Rejected',
      count: stats?.rejected || 0,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      title: 'Applied (Pending)',
      count: stats?.applied || 0,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
  ];

  const hasData = (stats?.total || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white shadow-md">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-blue-300">
            Student Overview
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-0.5">
            Welcome back, {user?.name || 'Gowtham'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Tracking your campus placements & internships for{' '}
            <span className="font-semibold text-white">{user?.targetRole || 'Software Engineer'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-900 bg-white hover:bg-blue-50 active:bg-slate-100 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Track Application</span>
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-4 bg-white rounded-xl border ${card.border} shadow-xs hover:shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 leading-tight">
                  {card.title}
                </span>
                <div className={`w-7 h-7 rounded-lg ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Row */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Application Status Funnel</h3>
                <p className="text-xs text-slate-500">Distribution of your active recruitment stages</p>
              </div>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100">
              {stats.statusDistribution.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}</span>
                  <span className="font-bold text-slate-800 ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend Bar Chart */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Application Cadence (Last 6 Months)</h3>
                <p className="text-xs text-slate-500">Volume of submissions over time</p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total recorded: <strong>{stats.total}</strong></span>
              <button
                onClick={() => navigate('/applications')}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full List</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center max-w-xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Job Applications Tracked Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
            Start organizing your job hunt! Add applications to track stages, interview schedules,
            and monitor your recruitment conversion rates.
          </p>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Track First Application</span>
          </button>
        </div>
      )}

      {/* Two Column Layout: Upcoming Interviews & Recent Applications */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Interviews Section */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                Upcoming Interviews
              </h3>
              <button
                onClick={() => navigate('/interviews')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            {stats.upcomingInterviews && stats.upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingInterviews.map(app => (
                  <div
                    key={app._id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{app.companyName}</p>
                        <p className="text-[11px] text-slate-600">{app.jobRole}</p>
                      </div>
                      <StatusBadge status={app.status} size="xs" />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(app.interviewDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No upcoming interviews scheduled</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Add an interview date to any application to track it here.
                </p>
              </div>
            )}
          </div>

          {/* Recent Applications Table */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Recent Applications
              </h3>
              <button
                onClick={() => navigate('/applications')}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>All Applications ({stats.total})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2.5">Company</th>
                    <th className="pb-2.5">Role</th>
                    <th className="pb-2.5">Type & Mode</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentApplications?.map(app => (
                    <tr
                      key={app._id}
                      onClick={() => navigate('/applications')}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 font-bold text-slate-800">{app.companyName}</td>
                      <td className="py-2.5 text-slate-600">{app.jobRole}</td>
                      <td className="py-2.5 text-slate-500">
                        {app.jobType} • {app.workMode}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={app.status} size="xs" />
                      </td>
                      <td className="py-2.5 text-right text-slate-500">
                        {new Date(app.applicationDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
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
  );
};

export default Dashboard;
