import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Trash2, 
  Search, 
  Crown, 
  Sparkles, 
  Eye, 
  Plus, 
  UserCheck, 
  UserX, 
  ExternalLink,
  LogOut,
  X,
  Feather,
  Palette
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';
import { Logo } from '../common/Logo';
import { LogoUploadManager } from './LogoUploadManager';

export const AdminDashboard: React.FC = () => {
  const { 
    stories, 
    users, 
    toggleFeatureStory, 
    toggleStoryOfTheWeek, 
    deleteStory, 
    toggleUserVerification, 
    updateStory,
    createStory,
    setCurrentPage, 
    setSelectedStoryId,
    logoutUser,
    currentUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stories' | 'authors' | 'branding'>('stories');
  const [storySearch, setStorySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New story state for admin quick creation
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newGenre, setNewGenre] = useState('Romance');
  const [newDescription, setNewDescription] = useState('');
  const [newCover, setNewCover] = useState('');

  // Real KPI Metrics
  const totalStories = stories.length;
  const publishedStories = stories.filter(s => s.status === 'published').length;
  const draftStories = stories.filter(s => s.status === 'draft').length;
  const registeredAuthors = users.filter(u => u.role === 'author').length;

  // Filtered stories
  const filteredStories = stories.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(storySearch.toLowerCase()) || 
      (s.authorName && s.authorName.toLowerCase().includes(storySearch.toLowerCase()));
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
      u.email.toLowerCase().includes(userSearch.toLowerCase());
  });

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast({ type: 'warning', title: 'Title Required', message: 'Please enter a story title.' });
      return;
    }

    const defaultCovers: Record<string, string> = {
      Romance: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      Thriller: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      Horror: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
      'Sci-Fi': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
      Mystery: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      Fantasy: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      Drama: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
      Comedy: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800&auto=format&fit=crop&q=80'
    };

    createStory({
      title: newTitle.trim(),
      titleBn: newTitleBn.trim() || newTitle.trim(),
      description: newDescription.trim() || 'A new original Bengali literary story published on GolpoX.',
      coverImage: newCover.trim() || defaultCovers[newGenre] || defaultCovers.Romance,
      genres: [newGenre],
      status: 'published'
    });

    setNewTitle('');
    setNewTitleBn('');
    setNewDescription('');
    setNewCover('');
    setIsCreateModalOpen(false);
  };

  const handleTogglePublish = (story: Story) => {
    const nextStatus = story.status === 'published' ? 'draft' : 'published';
    updateStory(story.id, { status: nextStatus });
    addToast({ 
      type: 'success', 
      title: 'Status Updated', 
      message: `"${story.title}" status changed to ${nextStatus}.` 
    });
  };

  const handleViewStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setCurrentPage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Logo 
                variant="full" 
                size="sm" 
                dark={true} 
                onClick={() => setCurrentPage('home')} 
                className="cursor-pointer" 
              />
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Administration</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-400">
              Authenticated as: <strong className="text-purple-300">{currentUser?.email || 'Administrator'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-create-story-btn"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Story</span>
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <button
              onClick={logoutUser}
              className="px-3.5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Real Accurate Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{totalStories}</p>
                <p className="text-xs text-slate-500 font-medium">Total Stories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{publishedStories}</p>
                <p className="text-xs text-slate-500 font-medium">Published Live</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Feather className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{draftStories}</p>
                <p className="text-xs text-slate-500 font-medium">Draft Stories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{registeredAuthors}</p>
                <p className="text-xs text-slate-500 font-medium">Registered Authors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveTab('stories')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'stories'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Story Management ({stories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'authors'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Authors & Users ({users.length})</span>
          </button>
          <button
            id="admin-tab-branding"
            onClick={() => setActiveTab('branding')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'branding'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Branding (Main Logo)</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full">
              Single Source
            </span>
          </button>
        </div>

        {/* Tab 1: Stories Management */}
        {activeTab === 'stories' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search stories by title or author..."
                  value={storySearch}
                  onChange={(e) => setStorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-medium">Filter:</span>
                {(['all', 'published', 'draft'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                      statusFilter === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories Table */}
            {filteredStories.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No stories found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {stories.length === 0 
                    ? 'The platform is completely clean. Click "Create Story" above to publish your first story.' 
                    : 'No stories match your current search or filter criteria.'}
                </p>
                {stories.length === 0 && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
                  >
                    Create First Story
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Story</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4">Genre</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Curation</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStories.map(story => (
                      <tr key={story.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              className="w-10 h-13 object-cover rounded-lg shadow-xs shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm font-serif">{story.title}</p>
                              {story.titleBn && story.titleBn !== story.title && (
                                <p className="text-[11px] text-slate-500">{story.titleBn}</p>
                              )}
                              <p className="text-[10px] text-slate-400 mt-0.5">{story.views || 0} reads • {story.chaptersCount || 1} chapters</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {story.authorName}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">
                            {story.genres?.[0] || 'Fiction'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleTogglePublish(story)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                              story.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {story.status}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => toggleFeatureStory(story.id)}
                              title={story.isFeatured ? 'Remove from Featured' : 'Feature Story'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                story.isFeatured 
                                  ? 'bg-amber-100 text-amber-600' 
                                  : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                              }`}
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleStoryOfTheWeek(story.id)}
                              title={story.isStoryOfWeek ? 'Remove from Story of the Week' : 'Make Story of the Week'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                story.isStoryOfWeek 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'text-slate-300 hover:text-purple-600 hover:bg-slate-100'
                              }`}
                            >
                              <Crown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleViewStory(story.id)}
                              title="View Story"
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
                                  deleteStory(story.id);
                                }
                              }}
                              title="Delete Story"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Authors & Users Management */}
        {activeTab === 'authors' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search authors by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4">User / Author</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Verified</th>
                    <th className="py-3.5 px-4 text-right">Verification Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 flex items-center">
                              {user.name}
                              {user.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 ml-1 inline" />
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">@{user.username || 'user'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {user.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.isVerified ? (
                          <span className="text-emerald-600 font-bold flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="text-slate-400">Unverified</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleUserVerification(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            user.isVerified
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          {user.isVerified ? 'Revoke Badge' : 'Grant Verified'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Branding & Main Logo Management */}
        {activeTab === 'branding' && (
          <LogoUploadManager />
        )}

      </div>

      {/* Admin Quick Story Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Publish New Story (Admin)</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Story Title (English / Bengali)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. নিশীথ রাতের পথিক (Night Traveler)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                >
                  <option value="Romance">Romance (রোমান্স)</option>
                  <option value="Thriller">Thriller (থ্রিলার)</option>
                  <option value="Horror">Horror (হরর)</option>
                  <option value="Sci-Fi">Sci-Fi (সায়েন্স ফিকশন)</option>
                  <option value="Mystery">Mystery (মিস্ট্রি)</option>
                  <option value="Fantasy">Fantasy (ফ্যান্টাসি)</option>
                  <option value="Drama">Drama (ড্রামা)</option>
                  <option value="Comedy">Comedy (কমেডি)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of the story..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="Leave empty for genre-matched default cover"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  Publish Story Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
