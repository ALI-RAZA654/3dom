'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@3dom.com');
    setPassword('99911191');
    setLoading(true);
    try {
      await login({ email: 'admin@3dom.com', password: '99911191' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomerLogin = async () => {
    setEmail('customer@3dom.com');
    setPassword('customer123');
    setLoading(true);
    try {
      await login({ email: 'customer@3dom.com', password: 'customer123' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-zinc-950 text-white p-6 relative text-center">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="logo-wordmark text-3xl font-black text-white">3DOM</span>
          <p className="text-xs text-zinc-400 mt-1">Sign in to your account across all 3 verticals</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Preset Demo Logins */}
          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block text-center">
              Quick One-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
              >
                Login as Admin
              </button>
              <button
                type="button"
                onClick={handleQuickCustomerLogin}
                className="py-2 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
              >
                Login as Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@3dom.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
