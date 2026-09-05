import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReaderReviews: React.FC = () => {
  const { testimonials, setCurrentPage } = useApp();

  return (
    <section className="py-6">
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              What Readers Say
            </h3>
            <p className="text-xs text-slate-500 font-medium">GolpoX পাঠকদের আন্তরিক অনুভূতি ও অভিজ্ঞতা</p>
          </div>
          <button
            onClick={() => {
              setCurrentPage('stories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-100/50 cursor-pointer"
          >
            Explore Stories
          </button>
        </div>

        {/* 4 Testimonials Grid with warm glass card design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(testimonials || []).map((item) => (
            <div
              key={item.id}
              className="glass-card-warm rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group text-left"
            >
              {/* Star Rating */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote in Bengali */}
                <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed line-clamp-3">
                  “{item.quoteBn}”
                </p>
              </div>

              {/* Author Info & Quote Icon */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#E8DFD1]/60">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate">— {item.nameBn}</p>
                    {item.badge && (
                      <span className="text-[10px] text-purple-700 font-medium">{item.badge}</span>
                    )}
                  </div>
                </div>

                <div className="text-purple-400 group-hover:text-purple-600 transition-colors">
                  <Quote className="w-5 h-5 fill-purple-100" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
