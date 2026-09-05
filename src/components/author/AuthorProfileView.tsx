import React from 'react';
import { 
  CheckCircle, 
  Users, 
  BookOpen, 
  Star, 
  Eye, 
  Bookmark, 
  ArrowLeft, 
  Plus, 
  Check,
  Feather
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthorProfileView: React.FC = () => {
  const { 
    selectedAuthorId, 
    users, 
    stories, 
    setCurrentPage, 
    setSelectedStoryId, 
    toggleFollowAuthor, 
    isAuthorFollowed,
    toggleBookmark,
    isBookmarked
  } = useApp();

  const author = users.find(u => u.id === selectedAuthorId) || users.find(u => u.role === 'author') || users[0];
  const authorStories = stories.filter(s => s.authorId === author.id);
  const isFollowing = isAuthorFollowed(author.id);

  const totalAuthorViews = authorStories.reduce((acc, s) => acc + s.views, 0);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => setCurrentPage('stories')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-purple-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md relative overflow-hidden">
          
          {/* Header Banner Gradient */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800"></div>

          <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
            
            {/* Avatar & Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-xl bg-slate-900"
                />
                {author.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                    <CheckCircle className="w-5 h-5 text-purple-600 fill-purple-100" />
                  </div>
                )}
              </div>

              <div className="space-y-1 pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                  {author.nameBn || author.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium">@{author.username} • Verified GolpoX Author</p>
                <p className="text-xs text-slate-700 max-w-md pt-1 font-serif">
                  {author.bio || 'বাংলা রোমাঞ্চ ও ভৌতিক গল্পের নিয়মিত লেখক। GolpoX-এ আমার সকল নতুন গল্প পড়ুন।'}
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <div className="pb-2">
              <button
                onClick={() => toggleFollowAuthor(author.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 cursor-pointer ${
                  isFollowing
                    ? 'bg-purple-100 text-purple-800 shadow-purple-100'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Following Author</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Follow Author</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-6 border-t border-slate-100 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{authorStories.length}</p>
              <p className="text-xs text-slate-500 font-medium">Published Stories</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {(author.followersCount / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-slate-500 font-medium">Followers</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {((totalAuthorViews || 56000) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-slate-500 font-medium">Total Reads</p>
            </div>
          </div>

        </div>

        {/* Author's Stories Grid */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Stories by {author.nameBn || author.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {authorStories.map((story) => {
              const bookmarked = isBookmarked(story.id);
              return (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStoryId(story.id);
                    setCurrentPage('story-detail');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{story.rating.average}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 truncate font-serif">
                        {story.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">{story.genres.join(', ')}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{(story.views / 1000).toFixed(0)}K</span>
                      </span>
                      <span>{story.chaptersCount || 6} Chapters</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
