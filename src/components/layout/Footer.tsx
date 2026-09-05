import React, { useState } from 'react';
import { Send, Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedGenreId, addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({ type: 'warning', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }
    addToast({ type: 'success', title: 'Subscribed!', message: 'Thank you for subscribing to GolpoX weekly literary highlights.' });
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center cursor-pointer">
              <Logo 
                variant="full" 
                size="md" 
                dark={true} 
                onClick={() => { setCurrentPage('home'); scrollToTop(); }} 
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              গল্প হোক জীবনের সেরা সঙ্গী। বাংলা ভাষার সেরা মৌলিক গল্প, উপন্যাস, থ্রিলার ও রোমাঞ্চের এক অনন্য ডিজিটাল মেলবন্ধন।
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-400">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#youtube" aria-label="Youtube" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-400">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => { setCurrentPage('stories'); scrollToTop(); }} className="hover:text-purple-400 transition-colors">
                  All Stories
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedGenreId(null); setCurrentPage('genre'); scrollToTop(); }} className="hover:text-purple-400 transition-colors">
                  Genres
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('authors'); scrollToTop(); }} className="hover:text-purple-400 transition-colors">
                  Top Authors
                </button>
              </li>
              <li>
                <button onClick={() => { setCurrentPage('stories'); scrollToTop(); }} className="hover:text-purple-400 transition-colors">
                  Collections & Editorials
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-purple-400 transition-colors">About GolpoX</a></li>
              <li><a href="#careers" className="hover:text-purple-400 transition-colors">Careers</a></li>
              <li><button onClick={() => { setCurrentPage('blog'); scrollToTop(); }} className="hover:text-purple-400 transition-colors">Official Blog</button></li>
              <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Support</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#help" className="hover:text-purple-400 transition-colors">Help Center</a></li>
              <li><a href="#guidelines" className="hover:text-purple-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 5: Write & Newsletter */}
          <div className="space-y-3 lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-wide">Newsletter</h4>
            <p className="text-xs text-slate-400">
              Subscribe for latest updates and new stories every week.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 GolpoX Inc. All rights reserved. Crafted with passion for Bangla literature.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
