import React from 'react';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContinueReadingCard: React.FC = () => {
  const { currentUser, stories, setSelectedStoryId, setSelectedChapterId, setCurrentPage } = useApp();

  // Find last read or fallback to story-1 / story-2
  const lastHistory = currentUser?.readingHistory && currentUser.readingHistory.length > 0 
    ? currentUser.readingHistory[0] 
    : null;

  const targetStory = lastHistory 
    ? stories.find(s => s.id === lastHistory.storyId) || stories[0]
    : stories[0];

  const chapterNum = lastHistory?.chapterNumber || 12;
  const progressPct = lastHistory?.progressPercentage || 77;

  const handleContinue = () => {
    setSelectedStoryId(targetStory.id);
    setSelectedChapterId(lastHistory?.chapterId || null);
    setCurrentPage('reader-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          Continue Reading
        </h3>
        <button
          onClick={() => {
            setCurrentPage('stories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-bold text-purple-600 hover:text-purple-700"
        >
          View All
        </button>
      </div>

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        Last Read
      </p>

      {/* Story Item (Matching Screenshot 1) */}
      <div className="flex items-center space-x-4">
        {/* Cover thumbnail */}
        <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-sm">
          <img
            src={targetStory.coverImage}
            alt={targetStory.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info & Progress */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 truncate font-serif">
              {targetStory.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">Chapter {chapterNum}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span>Progress</span>
              <span className="text-purple-600">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
