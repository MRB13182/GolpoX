import React, { useState } from 'react';
import { 
  CheckCircle, 
  Users, 
  BookOpen, 
  Search, 
  Plus, 
  Check, 
  Feather,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthorsCatalogView: React.FC = () => {
  const { 
    users, 
    setSelectedAuthorId, 
    setCurrentPage, 
    toggleFollowAuthor, 
    isAuthorFollowed 
  } = useApp();

  const [query, setQuery] = useState('');

  const authors = users.filter(u => u.role === 'author' || u.storiesCount > 0);
  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) || 
    (a.nameBn && a.nameBn.includes(query)) ||
    a.username.toLowerCase().includes(query.toLowerCase())
  );

  const handleAuthorClick = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setCurrentPage('author-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Feather className="w-3.5 h-3.5 text-purple-600" />
            <span>GolpoX শীর্ষ লেখকগণ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Featured Authors & Creators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            বাংলা সাহিত্যের জনপ্রিয় ও প্রতিভাবান লেখকদের সাথে যুক্ত হোন এবং তাদের নতুন গল্প সবার আগে পড়ুন
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
            <input
              type="text"
              placeholder="Search authors by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-purple-600 shadow-xs"
            />
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => {
            const isFollowing = isAuthorFollowed(author.id);
            return (
              <div
                key={author.id}
                onClick={() => handleAuthorClick(author.id)}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer group"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative shrink-0">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-500/20 group-hover:scale-105 transition-transform"
                    />
                    {author.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                        <CheckCircle className="w-4 h-4 text-purple-600 fill-purple-100" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate font-sans">
                      {author.nameBn || author.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">@{author.username}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 pt-1 font-serif">
                      {author.bio || 'GolpoX ভেরিফায়েড সাহিত্যিক ও গল্পকার।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 space-x-3">
                    <span className="font-bold text-slate-800">
                      {(author.followersCount / 1000).toFixed(1)}K
                    </span>{' '}
                    <span>Followers</span>
                    <span>•</span>
                    <span className="font-bold text-slate-800">{author.storiesCount}</span>{' '}
                    <span>Stories</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowAuthor(author.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      isFollowing
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
