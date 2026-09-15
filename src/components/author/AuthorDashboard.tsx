import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Feather, 
  Eye, 
  Users, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Layers, 
  Save, 
  Send,
  X,
  FileText,
  Sparkles,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story, Chapter } from '../../types';
import { Logo } from '../common/Logo';
import { BRAND_LOGO } from '../../config/branding';

export const AuthorDashboard: React.FC = () => {
  const { 
    currentUser, 
    stories, 
    chapters, 
    createStory, 
    createChapter, 
    genres, 
    setCurrentPage, 
    setSelectedStoryId,
    setSelectedChapterId,
    addToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'stories' | 'editor' | 'analytics'>('stories');
  const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
  const [selectedStoryForNewChapter, setSelectedStoryForNewChapter] = useState<string | null>(null);

  // New Story Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newGenres, setNewGenres] = useState<string[]>(['Horror']);
  const [newDescription, setNewDescription] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80');

  // Chapter Editor State
  const [editorStoryId, setEditorStoryId] = useState<string>(stories[0]?.id || 'story-1');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  // Author stories
  const authorStories = stories.filter(s => s.authorId === (currentUser?.id || 'user-author-1') || currentUser?.role === 'author');
  const displayStories = authorStories.length > 0 ? authorStories : stories.slice(0, 3);

  // Stats calculation
  const totalAuthorViews = displayStories.reduce((acc, s) => acc + s.views, 0);
  const totalFollowers = currentUser?.followersCount || 14200;
  const totalChaptersWritten = (chapters || []).filter(c => displayStories.some(s => s.id === c.storyId)).length;

  const handleCreateStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast({ type: 'warning', title: 'Title Required', message: 'Please enter a Bangla title.' });
      return;
    }

    const created = createStory({
      title: newTitle,
      titleEn: newTitleEn || newTitle,
      genres: newGenres,
      description: newDescription,
      coverImage: newCoverImage,
      isPaid: false
    });

    setIsNewStoryModalOpen(false);
    setNewTitle('');
    setNewTitleEn('');
    setNewDescription('');
    
    // Automatically switch to Chapter editor for this story
    setEditorStoryId(created.id);
    setActiveSubTab('editor');
  };

  const handleSaveChapter = (publish: boolean) => {
    if (!chapterTitle.trim() || !chapterContent.trim()) {
      addToast({ type: 'warning', title: 'Content Required', message: 'Please provide chapter title and content.' });
      return;
    }

    createChapter({
      storyId: editorStoryId,
      title: chapterTitle,
      content: chapterContent,
      status: publish ? 'published' : 'draft'
    });

    setChapterTitle('');
    setChapterContent('');
    setActiveSubTab('stories');
  };

  const toggleGenreSelection = (genreName: string) => {
    if (newGenres.includes(genreName)) {
      if (newGenres.length > 1) {
        setNewGenres(newGenres.filter(g => g !== genreName));
      }
    } else {
      if (newGenres.length < 3) {
        setNewGenres([...newGenres, genreName]);
      }
    }
  };

  // Word count & estimated reading time for editor
  const wordCount = chapterContent.trim() ? chapterContent.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Author Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Logo 
                variant="full" 
                size="sm" 
                onClick={() => setCurrentPage('home')}
                className="cursor-pointer"
              />
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                <Feather className="w-3.5 h-3.5 text-purple-600" />
                <span>Creator Studio</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Writer Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              আপনার গল্প পরিচালনা করুন, নতুন অধ্যায় লিখুন এবং পাঠকদের সাথে যুক্ত থাকুন
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNewStoryModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Story</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{displayStories.length}</p>
              <p className="text-xs text-slate-500 font-medium">Total Stories</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{(totalAuthorViews / 1000).toFixed(1)}K</p>
              <p className="text-xs text-slate-500 font-medium">Total Reads</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{(totalFollowers / 1000).toFixed(1)}K</p>
              <p className="text-xs text-slate-500 font-medium">Followers</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900">{totalChaptersWritten || 18}</p>
              <p className="text-xs text-slate-500 font-medium">Chapters Live</p>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6">
          <button
            onClick={() => setActiveSubTab('stories')}
            className={`pb-3 text-sm font-bold transition-all ${
              activeSubTab === 'stories'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Stories & Series
          </button>
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`pb-3 text-sm font-bold transition-all ${
              activeSubTab === 'editor'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Chapter Studio (Editor)
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`pb-3 text-sm font-bold transition-all ${
              activeSubTab === 'analytics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Reader Engagement
          </button>
        </div>

        {/* Sub Tab 1: Stories List */}
        {activeSubTab === 'stories' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayStories.map((story) => {
                const storyChapters = (chapters || []).filter(c => c.storyId === story.id);
                return (
                  <div
                    key={story.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-20 h-28 rounded-xl object-cover shadow-sm shrink-0 bg-slate-900"
                      />
                      <div className="space-y-1 min-w-0">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold uppercase">
                          {story.status}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 truncate font-serif">
                          {story.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{story.genres.join(', ')}</p>
                        <p className="text-[11px] text-slate-400">
                          {storyChapters.length || 6} Chapters • {(story.views / 1000).toFixed(0)}K Reads
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditorStoryId(story.id);
                          setActiveSubTab('editor');
                        }}
                        className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Chapter</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStoryId(story.id);
                          setCurrentPage('story-detail');
                        }}
                        className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Story</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sub Tab 2: Chapter Studio / Bangla Editor */}
        {activeSubTab === 'editor' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Write New Chapter</h3>
                <p className="text-xs text-slate-500">বাংলা ফন্টে মনোরম অধ্যায় তৈরি করুন</p>
              </div>

              {/* Story selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Select Story:</span>
                <select
                  value={editorStoryId}
                  onChange={(e) => setEditorStoryId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                >
                  {displayStories.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অধ্যায়ের নাম (Chapter Title)</label>
              <input
                type="text"
                placeholder="e.g. অধ্যায় ৫: অন্ধকার রহস্যের উন্মোচন"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-serif"
              />
            </div>

            {/* Live stats toolbar */}
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <span>শব্দ সংখ্যা (Words): <strong className="text-purple-600">{wordCount}</strong></span>
              <span>•</span>
              <span>পড়ার সময় (Est. Read): <strong className="text-purple-600">{readingTime} mins</strong></span>
            </div>

            {/* Prose Content Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">গল্পের মূল অংশ (Bangla Prose Content)</label>
              <textarea
                rows={12}
                placeholder="এখানে আপনার চমৎকার গল্পের অধ্যায়টি লিখুন..."
                value={chapterContent}
                onChange={(e) => setChapterContent(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 leading-relaxed font-serif focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
              />
            </div>

            {/* Publish Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleSaveChapter(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => handleSaveChapter(true)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish to Readers</span>
              </button>
            </div>

          </div>
        )}

        {/* Sub Tab 3: Reader Engagement / Analytics */}
        {activeSubTab === 'analytics' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Reader Growth Analytics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-xs font-bold text-purple-900">Weekly Story Views</p>
                <p className="text-2xl font-extrabold text-purple-700 mt-1">+24.5%</p>
                <p className="text-[10px] text-purple-600 mt-0.5">8,420 new readers this week</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-900">Average Completion Rate</p>
                <p className="text-2xl font-extrabold text-indigo-700 mt-1">82.4%</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Readers read until the last chapter</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-900">Reader Rating</p>
                <p className="text-2xl font-extrabold text-amber-700 mt-1">4.9 ★</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Over 380 community reviews</p>
              </div>
            </div>
          </div>
        )}

        {/* Create New Story Modal */}
        {isNewStoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <button
                onClick={() => setIsNewStoryModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 font-heading">Start a New Story</h3>
                <p className="text-xs text-slate-500">আপনার নতুন বাংলা উপন্যাসের বিবরণ ও ধরণ নির্ধারণ করুন</p>
              </div>

              <form onSubmit={handleCreateStorySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা শিরোনাম (Title Bn)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. মায়াজাল ও নীল পদ্ম"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">English Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Illusion & Blue Lotus"
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Genres (Max 3)</label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(g => (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => toggleGenreSelection(g.name)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          newGenres.includes(g.name)
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Story Synopsis & Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="গল্পের সারসংক্ষেপ লিখুন..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
                >
                  Create Story & Launch Chapter Editor
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
