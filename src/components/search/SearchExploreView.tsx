import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Bookmark, 
  SlidersHorizontal, 
  CheckCircle, 
  BookOpen,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';

export const SearchExploreView: React.FC = () => {
  const { 
    stories, 
    genres, 
    selectedGenreId, 
    setSelectedGenreId, 
    setSelectedStoryId, 
    setCurrentPage,
    toggleBookmark,
    isBookmarked,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'views' | 'newest'>('popularity');

  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      // Must be published or pending (if admin/author)
      if (s.status !== 'published') return false;

      // Genre filter
      if (selectedGenreId) {
        const genreObj = genres.find(g => g.id === selectedGenreId);
        const match = s.genres.some(g => g.toLowerCase() === selectedGenreId.toLowerCase() || (genreObj && g.toLowerCase() === genreObj.name.toLowerCase()));
        if (!match) return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = s.title.toLowerCase().includes(q) || (s.titleEn && s.titleEn.toLowerCase().includes(q));
        const authorMatch = s.authorName.toLowerCase().includes(q);
        const descMatch = s.description.toLowerCase().includes(q);
        const genreMatch = s.genres.some(g => g.toLowerCase().includes(q));
        if (!titleMatch && !authorMatch && !descMatch && !genreMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating.average - a.rating.average;
      }
      if (sortBy === 'views') {
        return b.views - a.views;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // popularity default
      return ((b.rating.average * 100) + (b.views / 100) + b.visibilityScore) - ((a.rating.average * 100) + (a.views / 100) + a.visibilityScore);
    });
  }, [stories, selectedGenreId, searchQuery, sortBy, genres]);

  const handleStoryClick = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Main Search Bar */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                Explore Stories
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                হাজারো মৌলিক গল্প, রোমাঞ্চ ও থ্রিলার থেকে আপনার পছন্দের গল্পটি খুঁজুন
              </p>
            </div>

            {/* Quick Result Counter */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold self-start">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>{filteredStories.length} Stories Available</span>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="গল্পের নাম, লেখক বা বিষয় দিয়ে অনুসন্ধান করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-200 hover:border-purple-300 focus:border-purple-600 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          
          {/* Genre Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedGenreId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                !selectedGenreId
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Genres
            </button>
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenreId(selectedGenreId === g.id ? null : g.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedGenreId === g.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {g.name} ({g.nameBn})
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Sort By:</span>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                {(['popularity', 'rating', 'views', 'newest'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      sortBy === s ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>

        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">কোনো গল্প পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">অন্য কোনো কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGenreId(null); }}
              className="px-5 py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl"
            >
              সব গল্প দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredStories.map((story) => {
              const bookmarked = isBookmarked(story.id);
              return (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story.id)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Cover */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    {/* Top rating badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{story.rating.average}</span>
                    </div>

                    {/* Bookmark action */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(story.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        bookmarked
                          ? 'bg-purple-600 text-white'
                          : 'bg-black/40 text-white/80 hover:bg-black/70 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
                    </button>

                    {/* Bottom Genres */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                      {story.genres.slice(0, 2).map(g => (
                        <span key={g} className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 font-serif">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">By {story.authorName}</p>
                    </div>

                    {/* Excerpt */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-serif">
                      {story.description}
                    </p>

                    {/* Stats footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{(story.views / 1000).toFixed(0)}K</span>
                      </span>
                      <span>{story.chaptersCount || 10} Chapters</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
