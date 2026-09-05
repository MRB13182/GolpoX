import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Settings2, 
  Sun, 
  Moon, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Chapter, Story } from '../../types';
import { CommentSection } from '../story/CommentSection';

export const ReadingExperience: React.FC = () => {
  const { 
    selectedStoryId, 
    selectedChapterId, 
    setSelectedChapterId, 
    getStoryById, 
    getChaptersForStory, 
    setCurrentPage,
    readingSettings,
    updateReadingSettings,
    saveReadingProgress,
    toggleBookmark,
    isBookmarked,
    addToast
  } = useApp();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const story: Story = getStoryById(selectedStoryId || 'story-1') || {
    id: 'story-1',
    title: 'অন্ধকার প্রাসাদ',
    coverImage: '',
    authorName: 'তাহসিন আহমেদ',
    genres: ['Horror']
  } as any;

  const chapters: Chapter[] = getChaptersForStory(story.id);

  // Active chapter
  const currentChapterIndex = chapters.findIndex(c => c.id === selectedChapterId);
  const activeChapter: Chapter = currentChapterIndex >= 0 ? chapters[currentChapterIndex] : (chapters[0] || {
    id: 'ch-default',
    storyId: story.id,
    chapterNumber: 1,
    title: 'প্রথম অধ্যায়',
    content: 'গল্পের অংশ লোড হচ্ছে...',
    wordCount: 500,
    readingTimeMinutes: 3,
    readsCount: 100,
    likesCount: 10,
    commentsCount: 2,
    status: 'published',
    publishedAt: '2024-01-01'
  });

  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
        setReadingProgress(progress);
        
        // Auto save progress every few steps
        saveReadingProgress(story.id, activeChapter.id, activeChapter.chapterNumber, progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [story.id, activeChapter.id, activeChapter.chapterNumber]);

  // Scroll to top on chapter switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setReadingProgress(0);
  }, [activeChapter.id]);

  const handleNextChapter = () => {
    if (nextChapter) {
      setSelectedChapterId(nextChapter.id);
    } else {
      // Completed all chapters! Trigger celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      addToast({
        type: 'success',
        title: 'Story Completed!',
        message: 'Congratulations on finishing all available chapters of this story!'
      });
    }
  };

  const handlePrevChapter = () => {
    if (prevChapter) {
      setSelectedChapterId(prevChapter.id);
    }
  };

  // Theme-based style classes
  const getThemeClasses = () => {
    switch (readingSettings.theme) {
      case 'sepia':
        return 'bg-[#FBF0D9] text-[#5F4B32] border-[#E8DCC0]';
      case 'dark':
        return 'bg-[#18181B] text-[#E4E4E7] border-[#27272A]';
      case 'midnight':
        return 'bg-[#090D16] text-[#CBD5E1] border-[#1E293B]';
      case 'light':
      default:
        return 'bg-[#FFFFFF] text-[#1E293B] border-slate-200';
    }
  };

  const getContainerBg = () => {
    switch (readingSettings.theme) {
      case 'sepia': return 'bg-[#F4E6C8]';
      case 'dark': return 'bg-[#09090B]';
      case 'midnight': return 'bg-[#030712]';
      case 'light':
      default: return 'bg-[#F8FAFC]';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getContainerBg()}`}>
      
      {/* Top Sticky Reading Header & Progress Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${getThemeClasses()} bg-opacity-95`}>
        {/* Progress bar line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-black/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Back & Story Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => setCurrentPage('story-detail')}
              className="p-2 rounded-xl hover:bg-black/5 transition-colors cursor-pointer shrink-0"
              title="Back to Synopsis"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 truncate">
              <h2 className="text-sm font-bold truncate font-serif">{story.title}</h2>
              <p className="text-[11px] opacity-70 truncate font-sans">
                {activeChapter.title} • {readingProgress}% read
              </p>
            </div>
          </div>

          {/* Reading Toolbar Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            
            {/* Chapter Directory Toggle */}
            <button
              onClick={() => setIsChapterDrawerOpen(!isChapterDrawerOpen)}
              className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              title="Chapters List"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Comments Drawer Toggle */}
            <button
              onClick={() => setIsCommentsDrawerOpen(!isCommentsDrawerOpen)}
              className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer relative"
              title="Chapter Comments"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(story.id)}
              className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              title="Bookmark Story"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked(story.id) ? 'fill-purple-600 text-purple-600' : ''}`} />
            </button>

            {/* Visual Settings Toggle */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              title="Reader Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Reader Customization Settings Popover */}
        {isSettingsOpen && (
          <div className="border-t border-b border-black/10 py-4 px-4 sm:px-6 bg-inherit">
            <div className="max-w-3xl mx-auto space-y-4">
              
              {/* Theme Picker */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Background Theme</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateReadingSettings({ theme: 'light' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 border ${
                      readingSettings.theme === 'light' ? 'ring-2 ring-purple-600' : 'border-slate-300'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => updateReadingSettings({ theme: 'sepia' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FBF0D9] text-[#5F4B32] border ${
                      readingSettings.theme === 'sepia' ? 'ring-2 ring-amber-600' : 'border-amber-300'
                    }`}
                  >
                    Vintage Sepia
                  </button>
                  <button
                    onClick={() => updateReadingSettings({ theme: 'dark' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-[#18181B] text-white border ${
                      readingSettings.theme === 'dark' ? 'ring-2 ring-purple-500' : 'border-zinc-700'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => updateReadingSettings({ theme: 'midnight' })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-[#090D16] text-blue-100 border ${
                      readingSettings.theme === 'midnight' ? 'ring-2 ring-blue-500' : 'border-slate-800'
                    }`}
                  >
                    Midnight
                  </button>
                </div>
              </div>

              {/* Font Size & Line Height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold opacity-80">
                    <span>Font Size</span>
                    <span>{readingSettings.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={28}
                    step={1}
                    value={readingSettings.fontSize}
                    onChange={(e) => updateReadingSettings({ fontSize: Number(e.target.value) })}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold opacity-80">
                    <span>Line Spacing</span>
                    <span>{readingSettings.lineHeight.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1.4}
                    max={2.4}
                    step={0.1}
                    value={readingSettings.lineHeight}
                    onChange={(e) => updateReadingSettings({ lineHeight: Number(e.target.value) })}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* Main Reading Canvas */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 lg:py-16">
        
        {/* Chapter Header Card */}
        <div className="text-center space-y-4 pb-10 border-b border-black/10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>অধ্যায় #{activeChapter.chapterNumber}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif tracking-tight leading-snug">
            {activeChapter.title}
          </h1>

          <div className="flex items-center justify-center space-x-3 text-xs opacity-60 font-medium font-sans">
            <span>By {story.authorName}</span>
            <span>•</span>
            <span>{activeChapter.readingTimeMinutes} min read</span>
            <span>•</span>
            <span>{activeChapter.wordCount} words</span>
          </div>
        </div>

        {/* Chapter Prose Content with Bangla Typography */}
        <article
          ref={contentRef}
          className="pt-10 select-text leading-relaxed whitespace-pre-line font-serif transition-all duration-200"
          style={{
            fontSize: `${readingSettings.fontSize}px`,
            lineHeight: readingSettings.lineHeight,
          }}
        >
          {activeChapter.content}
        </article>

        {/* Chapter Navigation Footer */}
        <div className="mt-16 pt-8 border-t border-black/10 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevChapter}
            disabled={!prevChapter}
            className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              prevChapter
                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                : 'opacity-40 cursor-not-allowed bg-black/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <span className="text-xs font-bold opacity-60 font-sans">
            #{activeChapter.chapterNumber} of {chapters.length}
          </span>

          <button
            onClick={handleNextChapter}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer transform hover:scale-105"
          >
            <span>{nextChapter ? 'Next Chapter' : 'Complete Story'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Chapters Side Drawer */}
      {isChapterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-sm h-full shadow-2xl p-6 overflow-y-auto space-y-4 ${getThemeClasses()} bg-opacity-100`}>
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h3 className="font-bold text-base font-serif">Table of Contents</h3>
              <button
                onClick={() => setIsChapterDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setIsChapterDrawerOpen(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    ch.id === activeChapter.id
                      ? 'bg-purple-600 text-white font-bold'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <p className="text-xs font-serif font-semibold">
                    #{ch.chapterNumber}: {ch.title}
                  </p>
                  <p className={`text-[10px] ${ch.id === activeChapter.id ? 'text-purple-200' : 'opacity-60'}`}>
                    {ch.readingTimeMinutes} mins • {ch.wordCount} words
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Drawer */}
      {isCommentsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md h-full bg-white text-slate-900 shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base font-heading">Chapter Comments</h3>
              <button
                onClick={() => setIsCommentsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CommentSection 
              storyId={story.id} 
              chapterId={activeChapter.id} 
              chapterNumber={activeChapter.chapterNumber} 
            />
          </div>
        </div>
      )}

    </div>
  );
};
