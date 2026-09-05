import React, { useRef } from 'react';
import { Star, Eye, MessageSquare, ChevronLeft, ChevronRight, Bookmark, Flame, BookOpen, Feather } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TrendingStories: React.FC = () => {
  const { 
    stories, 
    setSelectedStoryId, 
    setCurrentPage, 
    toggleBookmark, 
    isBookmarked,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalTab
  } = useApp();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter published stories sorted by rating & views
  const trendingList = (stories || [])
    .filter(s => s.status === 'published')
    .sort((a, b) => ((b.rating?.average || 0) * (b.views || 0)) - ((a.rating?.average || 0) * (a.views || 0)));

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWriteAction = () => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('author-dashboard');
      }
    } else {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 text-amber-600 fill-amber-500/20" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                Trending Stories
              </h2>
              <p className="text-xs text-slate-500 font-medium">বর্তমানে পাঠকদের সবচেয়ে আলোচিত গল্পগুলো</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {trendingList.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setCurrentPage('stories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-100/50"
                >
                  View All
                </button>
                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => scroll('left')}
                    aria-label="Previous Stories"
                    className="w-9 h-9 rounded-full glass-card hover:border-purple-600 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    aria-label="Next Stories"
                    className="w-9 h-9 rounded-full glass-card hover:border-purple-600 hover:text-purple-600 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Empty State vs Stories List */}
        {trendingList.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-3xl bg-white/70 border border-slate-200/80 shadow-xs max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">এখনো কোনো গল্প প্রকাশিত হয়নি</h3>
            <p className="text-xs text-slate-500">
              লেখক হিসেবে যোগ দিন অথবা অ্যাডমিন প্যানেল থেকে প্রথম গল্পটি যুক্ত করুন।
            </p>
            <button
              onClick={handleWriteAction}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>গল্প লিখুন (Publish a Story)</span>
            </button>
          </div>
        ) : (
          /* Horizontal Carousel */
          <div
            ref={carouselRef}
            className="flex space-x-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingList.map((story) => {
              const bookmarked = isBookmarked(story.id);
              return (
                <div
                  key={story.id}
                  className="w-[240px] sm:w-[260px] shrink-0 snap-start group relative rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border border-white/10"
                  onClick={() => handleOpenStory(story.id)}
                >
                  {/* Image Cover */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Top Rating Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/15">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{story.rating?.average?.toFixed(1) || '5.0'}</span>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(story.id);
                      }}
                      aria-label="Bookmark story"
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        bookmarked
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-black/40 text-white/80 hover:bg-black/70 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
                    </button>

                    {/* Bottom Content Info */}
                    <div className="absolute bottom-0 inset-x-0 p-4 text-white space-y-1 text-left">
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 font-serif">
                        {story.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">{(story.genres || []).join(' • ')}</p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/15">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{story.rating?.average?.toFixed(1) || '5.0'}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{story.views || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>{story.chaptersCount || 1} ch</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
