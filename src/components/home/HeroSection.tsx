import React, { useState } from 'react';
import { Search, Heart, Flame, Ghost, Eye, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, setSelectedGenreId, setSearchQuery } = useApp();
  const [localQuery, setLocalQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setCurrentPage('stories');
    }
  };

  const handleGenreClick = (genreId: string) => {
    setSelectedGenreId(genreId);
    setCurrentPage('stories');
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-14 lg:pt-12 lg:pb-20">
      
      {/* Warm ambient background lights & radial blooms */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/25 via-purple-300/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-gradient-to-bl from-purple-300/25 via-pink-200/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Bengali Headline & Interactive Search (Matching Reference Image 3) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100/70 border border-purple-200/80 text-purple-900 text-xs font-bold tracking-wide shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>স্বাগতম GolpoX-এ</span>
            </div>

            {/* Main Luxury Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] font-serif">
                হারিয়ে যান <br />
                হাজারো <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800">গল্পের</span> জগতে।
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-600 flex items-center flex-wrap gap-2 pt-1 font-sans">
                <span className="hover:text-purple-700 transition-colors cursor-pointer" onClick={() => handleGenreClick('romance')}>Romance</span>
                <span className="text-amber-500 font-bold">•</span>
                <span className="hover:text-purple-700 transition-colors cursor-pointer" onClick={() => handleGenreClick('thriller')}>Thriller</span>
                <span className="text-amber-500 font-bold">•</span>
                <span className="hover:text-purple-700 transition-colors cursor-pointer" onClick={() => handleGenreClick('horror')}>Horror</span>
                <span className="text-amber-500 font-bold">•</span>
                <span className="hover:text-purple-700 transition-colors cursor-pointer" onClick={() => handleGenreClick('sci-fi')}>Sci-Fi</span>
                <span className="text-amber-500 font-bold">•</span>
                <span className="hover:text-purple-700 transition-colors cursor-pointer" onClick={() => handleGenreClick('mystery')}>Mystery</span>
              </p>
            </div>

            {/* Glassmorphic Search Bar (Matching Reference Image 3) */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative flex items-center glass-card-warm rounded-2xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-purple-600/30 focus-within:border-purple-500">
                <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                <input
                  id="hero-story-search-input"
                  type="text"
                  placeholder="গল্প খুঁজুন..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer flex items-center space-x-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Category Quick Chips with Glassmorphic styling */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                id="hero-chip-romance"
                onClick={() => handleGenreClick('romance')}
                className="flex items-center space-x-2 px-4 py-2 glass-pill hover:bg-pink-50 text-pink-700 rounded-xl text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
                <span>Romance</span>
              </button>

              <button
                id="hero-chip-horror"
                onClick={() => handleGenreClick('horror')}
                className="flex items-center space-x-2 px-4 py-2 glass-pill hover:bg-purple-50 text-purple-700 rounded-xl text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Ghost className="w-3.5 h-3.5 text-purple-600" />
                <span>Horror</span>
              </button>

              <button
                id="hero-chip-thriller"
                onClick={() => handleGenreClick('thriller')}
                className="flex items-center space-x-2 px-4 py-2 glass-pill hover:bg-amber-50 text-amber-800 rounded-xl text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>Thriller</span>
              </button>

              <button
                id="hero-chip-mystery"
                onClick={() => handleGenreClick('mystery')}
                className="flex items-center space-x-2 px-4 py-2 glass-pill hover:bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mystery</span>
              </button>
            </div>

          </div>

          {/* Right Column: Visual Fantasy Book Artwork (Matching Reference Image 3) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Glowing aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/25 via-purple-500/25 to-indigo-600/30 rounded-3xl blur-2xl transform scale-95 pointer-events-none" />

              {/* Main Artwork Container with glass frame */}
              <div className="relative glass-card-warm rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden group">
                
                {/* Book & Fantasy Scene Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1532012164546-f432f2e3dd45?w=800&auto=format&fit=crop&q=80"
                    alt="GolpoX Magical Storytelling World"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-6">
                    <div className="text-white space-y-1.5 text-left">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md text-[10px] font-bold border border-white/20">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>GolpoX Platform</span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-white">বাংলা সাহিত্যের মুক্ত দিগন্ত</h3>
                      <p className="text-xs text-slate-300 font-medium">অনন্য অনুভূতি ও রোমাঞ্চে ভরা মৌলিক গল্পের ভান্ডার</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
