// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Welcome back to JobTrack!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'sayimpugowtham@gmail.com',
      password: 'password123',
    });
    toast.success('Demo student credentials populated');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign in to JobTrack
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">
          Streamline and monitor your job & internship applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sayimpugowtham@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Fill Student Demo Credentials</span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
