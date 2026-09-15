import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Feather, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { BRAND_LOGO } from '../../config/branding';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    loginUser, 
    registerUser,
    addToast
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast({ type: 'warning', title: 'Input Required', message: 'Please enter your username or email.' });
      return;
    }
    const success = loginUser(email, password);
    if (success) {
      setEmail('');
      setPassword('');
      setIsAuthModalOpen(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast({ type: 'warning', title: 'Input Required', message: 'Please fill in all required fields.' });
      return;
    }
    const success = registerUser(name, email, 'author');
    if (success) {
      setName('');
      setEmail('');
      setPassword('');
      setIsAuthModalOpen(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast({ type: 'warning', title: 'Input Required', message: 'Enter your account email.' });
      return;
    }
    setResetSent(true);
    addToast({ type: 'info', title: 'Reset Link Sent', message: `Password reset instructions sent to ${email}.` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl border border-white/60 w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all z-20 cursor-pointer backdrop-blur-xs"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header decoration */}
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 p-6 sm:p-7 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          {/* Logo (GOLPOX_MAIN_LOGO) */}
          <div className="flex justify-center mb-2">
            <Logo 
              variant="full" 
              size="lg" 
              dark={true} 
              showTagline={false} 
              className="mx-auto" 
            />
          </div>
          <p className="text-xs text-purple-100 mt-1 font-medium max-w-xs mx-auto">
            {authModalTab === 'register' && 'Become a GolpoX Author — Publish stories & build an audience'}
            {authModalTab === 'login' && 'Sign In to your GolpoX account'}
            {authModalTab === 'forgot' && 'Reset your account password'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4">
          
          {/* Sign In / Create Account Toggle */}
          {(authModalTab === 'login' || authModalTab === 'register') && (
            <div className="flex bg-[#EFE9DF] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalTab === 'login' 
                    ? 'bg-white text-purple-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthModalTab('register')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authModalTab === 'register' 
                    ? 'bg-white text-purple-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Author Account
              </button>
            </div>
          )}

          {/* 1. Login Form */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="text-[11px] font-semibold text-purple-700 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. Register Form */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Your pen name or real name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Author badge info */}
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 text-purple-900 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Author Account</p>
                  <p className="text-[11px] text-purple-700">
                    Readers do not need accounts. Only authors sign up to publish.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-1"
              >
                <span>Create Author Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. Forgot Password */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              {resetSent && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  Password reset link dispatched to {email}.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Send Reset Link
              </button>

              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="w-full text-center text-xs font-bold text-purple-700 hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* Reader notice footer */}
          <div className="pt-2 text-center border-t border-slate-200/60">
            <p className="text-[11px] text-slate-500 font-medium">
              Readers enjoy unlimited reading without needing an account.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
