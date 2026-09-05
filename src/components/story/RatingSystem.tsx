import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Story } from '../../types';

interface RatingSystemProps {
  story: Story;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({ story }) => {
  const { submitRating, currentUser, setIsAuthModalOpen } = useApp();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const { average, totalCount, distribution } = story.rating;

  const handleRate = (star: number) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedRating(star);
    submitRating(story.id, star);
    setHasRated(true);
  };

  const getPercentage = (count: number) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-900 font-heading">
        Ratings & Reviews
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Big Average Rating */}
        <div className="md:col-span-4 text-center space-y-2 py-3 border-b md:border-b-0 md:border-r border-slate-100">
          <div className="text-5xl font-extrabold text-slate-900 font-sans tracking-tight">
            {average.toFixed(1)}
          </div>
          <div className="flex items-center justify-center space-x-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(average)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {totalCount.toLocaleString()} ratings
          </p>
        </div>

        {/* Rating Distribution Bars (5 to 1) */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = getPercentage(count);
            return (
              <div key={star} className="flex items-center space-x-3 text-xs text-slate-600">
                <div className="flex items-center space-x-1 w-10 shrink-0 font-bold">
                  <span>{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-[11px] text-slate-400 font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Interactive Rate This Story Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold text-slate-900">
            {hasRated ? 'Thank you for your rating!' : 'Rate this story'}
          </p>
          <p className="text-[11px] text-slate-500">
            Share your feedback with the author and community
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
              className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= (hoverRating || selectedRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
