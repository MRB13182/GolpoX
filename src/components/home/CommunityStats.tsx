import React, { useState } from 'react';
import { BookOpen, Users, Feather, Flame, Send, Mail, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommunityStats: React.FC = () => {
  return (
    <div className="space-y-4 text-left">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
        Our Community
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Stat 1: 1000+ Stories */}
        <div className="glass-card-warm rounded-3xl p-5 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1000+</p>
            <p className="text-xs text-slate-500 font-medium">Stories</p>
          </div>
        </div>

        {/* Stat 2: 50K+ Readers */}
        <div className="glass-card-warm rounded-3xl p-5 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">50K+</p>
            <p className="text-xs text-slate-500 font-medium">Readers</p>
          </div>
        </div>

        {/* Stat 3: 500+ Authors */}
        <div className="glass-card-warm rounded-3xl p-5 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-700 flex items-center justify-center shrink-0 border border-pink-500/20">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">500+</p>
            <p className="text-xs text-slate-500 font-medium">Authors</p>
          </div>
        </div>

        {/* Stat 4: 1M+ Monthly Reads */}
        <div className="glass-card-warm rounded-3xl p-5 shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center shrink-0 border border-purple-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1M+</p>
            <p className="text-xs text-slate-500 font-medium">Monthly Reads</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export const NewsletterSection: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ type: 'warning', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }
    addToast({ type: 'success', title: 'Subscribed Successfully', message: 'You will receive weekly story recommendations!' });
    setEmail('');
  };

  return (
    <section className="py-6">
      <div className="relative rounded-3xl glass-card-warm p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Left text & Input */}
        <div className="flex-1 space-y-4 text-left max-w-xl">
          <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
            <Mail className="w-4 h-4 text-purple-600" />
            <span>Stay Connected with GolpoX</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
            Get Updates & New Stories
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Subscribe to get the latest stories, author interviews, and exclusive chapters directly in your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-80 px-4 py-3 bg-white/90 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-xs"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Artwork */}
        <div className="w-48 sm:w-64 shrink-0 flex justify-center">
          <div className="relative p-4">
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 shadow-xl flex items-center justify-center text-white transform rotate-3 hover:rotate-0 transition-transform">
              <Mail className="w-16 h-16 text-white/90" />
            </div>
            <div className="absolute -bottom-2 -left-2 glass-card rounded-2xl p-2.5 shadow-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-900">No Spam, Ever</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
