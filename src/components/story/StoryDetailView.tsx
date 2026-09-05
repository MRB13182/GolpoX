import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Eye, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  Lock, 
  Sparkles, 
  Check, 
  Heart,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingSystem } from './RatingSystem';
import { CommentSection } from './CommentSection';

export const StoryDetailView: React.FC = () => {
  const { 
    selectedStoryId, 
    getStoryById, 
    getChaptersForStory, 
    setCurrentPage, 
    setSelectedChapterId,
    setSelectedAuthorId,
    toggleBookmark, 
    isBookmarked,
    toggleLikeStory,
    isStoryLiked,
    toggleFollowAuthor,
    isAuthorFollowed,
    currentUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chapters' | 'comments' | 'reviews'>('chapters');

  const story = getStoryById(selectedStoryId || 'story-1');

  if (!story) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500">গল্পটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  const chapters = getChaptersForStory(story.id);
  const bookmarked = isBookmarked(story.id);
  const liked = isStoryLiked(story.id);
  const isFollowingAuthor = isAuthorFollowed(story.authorId);

  const handleStartReading = (chapterId?: string) => {
    const targetChapter = chapterId || (chapters.length > 0 ? chapters[0].id : null);
    setSelectedChapterId(targetChapter);
    setCurrentPage('reader-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({ type: 'success', title: 'Link Copied', message: 'Story link copied to clipboard!' });
  };

  const handleAuthorClick = () => {
    setSelectedAuthorId(story.authorId);
    setCurrentPage('author-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => setCurrentPage('stories')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stories</span>
        </button>

        {/* Top Story Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Story Cover Image */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 relative group">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {story.isStoryOfWeek && (
                  <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Story of the Week
                  </div>
                )}
              </div>
            </div>

            {/* Story Info */}
            <div className="lg:col-span-8 space-y-6 text-left">
              
              {/* Genres Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {story.genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold"
                  >
                    {g}
                  </span>
                ))}
                {story.isPaid && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Premium Story</span>
                  </span>
                )}
              </div>

              {/* Title & Author */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif leading-tight">
                  {story.title}
                </h1>

                {/* Author Bar */}
                <div className="flex items-center space-x-3 pt-2">
                  <div
                    onClick={handleAuthorClick}
                    className="flex items-center space-x-2.5 cursor-pointer group"
                  >
                    <img
                      src={story.authorAvatar}
                      alt={story.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center">
                        {story.authorName}
                        {story.authorVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-purple-600 ml-1 inline" />
                        )}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">@{story.authorUsername}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowAuthor(story.authorId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      isFollowingAuthor
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700'
                    }`}
                  >
                    {isFollowingAuthor ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Follow Author</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Metric Counters (Views, Rating, Comments, Bookmarks) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-slate-700">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{story.rating.average} ★</p>
                    <p className="text-[10px] text-slate-400">{story.rating.totalCount} Ratings</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{(story.views / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-slate-400">Total Views</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{story.commentsCount}</p>
                    <p className="text-[10px] text-slate-400">Comments</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Bookmark className="w-5 h-5 text-pink-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{story.bookmarksCount}</p>
                    <p className="text-[10px] text-slate-400">Bookmarks</p>
                  </div>
                </div>
              </div>

              {/* Synopsis & Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synopsis</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif">
                  {story.synopsis || story.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="story-start-reading-btn"
                  onClick={() => handleStartReading()}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/25 transition-all flex items-center space-x-2 cursor-pointer transform hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Reading Chapter 1</span>
                </button>

                <button
                  onClick={() => toggleBookmark(story.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    bookmarked
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={bookmarked ? 'Remove Bookmark' : 'Save Story'}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-purple-600' : ''}`} />
                </button>

                <button
                  onClick={() => toggleLikeStory(story.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    liked
                      ? 'border-rose-500 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={liked ? 'Unlike Story' : 'Like Story'}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-rose-600' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  title="Share Story"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Story Tabs (Chapters / Ratings / Comments) */}
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 space-x-8">
            <button
              onClick={() => setActiveTab('chapters')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'chapters'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Chapters ({chapters.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Ratings & Reviews ({story.rating.totalCount})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-4 text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'comments'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Comments ({story.commentsCount})
            </button>
          </div>

          {/* Chapters Tab Content */}
          {activeTab === 'chapters' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Chapter Directory
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {chapters.length} Total Chapters Published
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {chapters.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs sm:text-sm">
                    এই গল্পের এখনও কোনো প্রকাশিত অধ্যায় নেই।
                  </div>
                ) : (
                  chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      onClick={() => handleStartReading(chapter.id)}
                      className="py-4 flex items-center justify-between hover:bg-purple-50/50 -mx-4 px-4 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-purple-600">
                            #{chapter.chapterNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors font-serif">
                            {chapter.title}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{chapter.readingTimeMinutes} min read</span>
                          </span>
                          <span>•</span>
                          <span>{chapter.wordCount} words</span>
                          <span>•</span>
                          <span>Published {chapter.publishedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400 group-hover:text-purple-600 transition-colors">
                        <span className="text-xs font-bold hidden sm:inline">Read Chapter</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Ratings Tab Content */}
          {activeTab === 'reviews' && (
            <RatingSystem story={story} />
          )}

          {/* Comments Tab Content */}
          {activeTab === 'comments' && (
            <CommentSection storyId={story.id} />
          )}

        </div>

      </div>
    </div>
  );
};
