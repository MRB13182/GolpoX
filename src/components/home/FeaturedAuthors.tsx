import React from 'react';
import { CheckCircle, Feather, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedAuthors: React.FC = () => {
  const { 
    users, 
    setSelectedAuthorId, 
    setCurrentPage, 
    setIsAuthModalOpen, 
    setAuthModalTab,
    currentUser 
  } = useApp();

  const authorsList = (users || []).filter(u => u.role === 'author').slice(0, 4);

  const handleAuthorClick = (authorId: string) => {
    setSelectedAuthorId(authorId);
    setCurrentPage('author-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinAuthors = () => {
    if (currentUser) {
      setCurrentPage('author-dashboard');
    } else {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-left">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Platform Authors
            </h3>
            <p className="text-xs text-slate-500 font-medium">GolpoX প্ল্যাটফর্মের নিবন্ধিত গল্পকারগণ</p>
          </div>
        </div>

        {authorsList.length > 0 && (
          <button
            onClick={() => {
              setCurrentPage('authors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-100/50 cursor-pointer"
          >
            View All Authors
          </button>
        )}
      </div>

      {authorsList.length === 0 ? (
        <div className="glass-card-warm rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Become a GolpoX Author</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনি কি লিখতে ভালোবাসেন? GolpoX-এ আপনার সাহিত্যকর্ম প্রকাশ করুন এবং নতুন পাঠকদের কাছে পৌঁছে যান।
          </p>
          <button
            onClick={handleJoinAuthors}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Join as Author (লেখক হিসেবে যোগ দিন)</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {authorsList.map((author) => (
            <div
              key={author.id}
              onClick={() => handleAuthorClick(author.id)}
              className="glass-card-warm rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all flex items-center space-x-3.5 cursor-pointer group transform hover:-translate-y-1 text-left"
            >
              <div className="relative shrink-0">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-purple-500/30 group-hover:scale-105 transition-transform"
                />
                {author.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  {author.nameBn || author.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {author.followersCount || 0} Followers
                </p>
                <p className="text-[11px] text-purple-600 font-bold mt-0.5">
                  {author.storiesCount || 0} Stories
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
