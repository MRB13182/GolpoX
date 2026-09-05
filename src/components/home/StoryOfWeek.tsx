import React from 'react';
import { Crown, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryOfWeek: React.FC = () => {
  const { stories, setSelectedStoryId, setCurrentPage } = useApp();

  // Only render if a story is explicitly marked as Story of the Week
  const storyOfWeek = (stories || []).find(s => s.isStoryOfWeek && s.status === 'published');

  if (!storyOfWeek) return null;

  const handleReadNow = () => {
    setSelectedStoryId(storyOfWeek.id);
    setCurrentPage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-4">
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-amber-500/20">
        
        {/* Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={storyOfWeek.coverImage || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"}
            alt={storyOfWeek.title}
            className="w-full h-full object-cover opacity-40 filter blur-[1px] transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-purple-950/85 to-slate-950/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-14 max-w-3xl space-y-4 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black tracking-wide backdrop-blur-md">
            <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Story of the Week</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-serif">
            “{storyOfWeek.title}”
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl font-serif">
            {storyOfWeek.description}
          </p>

          {/* Details & CTA */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={handleReadNow}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center space-x-2 cursor-pointer transform hover:scale-105"
            >
              <span>Read Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 text-xs text-slate-300 font-semibold bg-black/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <span className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">{storyOfWeek.rating?.average?.toFixed(1) || '5.0'}</span>
              </span>
              <span className="text-white/40">•</span>
              <span>{storyOfWeek.views || 0} Reads</span>
              <span className="text-white/40">•</span>
              <span className="text-amber-200">By {storyOfWeek.authorName}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
