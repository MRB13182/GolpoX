import React, { useState } from 'react';
import { 
  Bookmark, 
  Clock, 
  Users, 
  Settings, 
  BookOpen, 
  Star, 
  Eye, 
  Trash2, 
  ArrowRight,
  CheckCircle,
  User as UserIcon,
  Feather
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UserLibraryView: React.FC = () => {
  const { 
    currentUser, 
    stories, 
    users, 
    setCurrentPage, 
    setSelectedStoryId, 
    setSelectedChapterId, 
    setSelectedAuthorId,
    toggleBookmark,
    toggleFollowAuthor,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history' | 'following' | 'settings'>('bookmarks');
  
  // Profile settings state
  const [name, setName] = useState(currentUser?.name || 'User');
  const [nameBn, setNameBn] = useState(currentUser?.nameBn || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Bookmarked stories
  const bookmarkedStories = (stories || []).filter(s => (currentUser?.bookmarks || []).includes(s.id));

  // Followed authors
  const followedAuthors = (users || []).filter(u => (currentUser?.followingAuthors || []).includes(u.id));

  const handleContinueReading = (storyId: string, chapterId?: string) => {
    setSelectedStoryId(storyId);
    setSelectedChapterId(chapterId || null);
    setCurrentPage('reader-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.name = name;
      currentUser.nameBn = nameBn;
      currentUser.bio = bio;
      currentUser.avatar = avatar;
      addToast({ type: 'success', title: 'Profile Updated', message: 'Your user profile details have been saved.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt="user"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-purple-100 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{currentUser?.name}</h1>
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">@{currentUser?.username || 'reader_user'} • {currentUser?.email}</p>
              <p className="text-xs text-slate-600 font-serif pt-0.5">{currentUser?.bio || 'গল্পপ্রেমী ও নিয়মিত পাঠক।'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser?.role === 'author' && (
              <button
                onClick={() => setCurrentPage('author-dashboard')}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Go to Writer Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Library Subtabs */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'bookmarks'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({bookmarkedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Reading History ({currentUser?.readingHistory?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'following'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Followed Authors ({followedAuthors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'settings'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab 1: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-4">
            {bookmarkedStories.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">কোনো বুকমার্ক করা গল্প নেই</h3>
                <p className="text-xs text-slate-400">পছন্দের গল্পগুলো বুকমার্ক করে পরে সহজেই পড়তে পারেন।</p>
                <button
                  onClick={() => setCurrentPage('stories')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  গল্প খুঁজুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {bookmarkedStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleOpenStory(story.id)}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(story.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md"
                        title="Remove Bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-white" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 truncate font-serif">
                          {story.title}
                        </h4>
                        <p className="text-xs text-slate-400">By {story.authorName}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{story.rating.average}</span>
                        </span>
                        <span className="text-purple-600 font-bold">Read Now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reading History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Recent Reading Progress</h3>
            
            {(!currentUser?.readingHistory || currentUser.readingHistory.length === 0) ? (
              <p className="text-slate-400 text-xs py-4 text-center">এখনও কোনো পড়ার ইতিহাস সংরক্ষিত হয়নি।</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {currentUser.readingHistory.map((item, idx) => {
                  const targetStory = stories.find(s => s.id === item.storyId) || stories[0];
                  return (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img src={targetStory.coverImage} className="w-14 h-18 rounded-xl object-cover shadow-xs shrink-0" />
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 font-serif">{targetStory.title}</h4>
                          <p className="text-xs text-slate-500">Chapter {item.chapterNumber} • Last read: {item.lastReadAt}</p>
                          
                          <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${item.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleContinueReading(targetStory.id, item.chapterId)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Following Authors */}
        {activeTab === 'following' && (
          <div className="space-y-4">
            {followedAuthors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-sm">আপনি কোনো লেখককে ফলো করছেন না</h3>
                <p className="text-xs text-slate-400">জনপ্রিয় লেখকদের ফলো করলে তাদের নতুন গল্পের নোটিফিকেশন পাবেন।</p>
                <button
                  onClick={() => setCurrentPage('authors')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  লেখক তালিকা দেখুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {followedAuthors.map((author) => (
                  <div
                    key={author.id}
                    onClick={() => {
                      setSelectedAuthorId(author.id);
                      setCurrentPage('author-profile');
                    }}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={author.avatar} className="w-12 h-12 rounded-full object-cover" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{author.nameBn || author.name}</h4>
                        <p className="text-xs text-slate-400">{author.storiesCount} Stories</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollowAuthor(author.id);
                      }}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold"
                    >
                      Following
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm max-w-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Edit Profile Information</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Display Name (English)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা নাম (Pen Name)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / পরিচয়</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
