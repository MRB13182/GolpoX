import React from 'react';
import { Heart, Flame, Ghost, Rocket, Eye, Wand2, Tv, Smile, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PopularGenres: React.FC = () => {
  const { genres, setSelectedGenreId, setCurrentPage } = useApp();

  const getGenreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6 text-pink-500 fill-pink-500/20" />;
      case 'Flame': return <Flame className="w-6 h-6 text-amber-500 fill-amber-500/20" />;
      case 'Ghost': return <Ghost className="w-6 h-6 text-purple-600" />;
      case 'Rocket': return <Rocket className="w-6 h-6 text-blue-500" />;
      case 'Eye': return <Eye className="w-6 h-6 text-indigo-500" />;
      case 'Wand2': return <Wand2 className="w-6 h-6 text-emerald-500" />;
      case 'Tv': return <Tv className="w-6 h-6 text-purple-500" />;
      case 'Smile': return <Smile className="w-6 h-6 text-yellow-500" />;
      default: return <Sparkles className="w-6 h-6 text-purple-500" />;
    }
  };

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenreId(genreId);
    setCurrentPage('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Popular Genres
            </h3>
            <p className="text-xs text-slate-500 font-medium">আপনার প্রিয় ধারার গল্পগুলো বেছে নিন</p>
          </div>
          <button
            onClick={() => {
              setSelectedGenreId(null);
              setCurrentPage('genre');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-100/50 cursor-pointer"
          >
            View All Genres
          </button>
        </div>

        {/* Grid of round genre pill badges (Matching Reference Image 3) */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-5">
          {(genres || []).map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleSelectGenre(genre.id)}
              className="flex flex-col items-center space-y-2.5 p-3 rounded-2xl glass-card hover:bg-purple-100/40 transition-all group cursor-pointer text-center transform hover:-translate-y-1"
            >
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xs border border-white/60 group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                style={{ backgroundColor: genre.bgLight }}
              >
                {getGenreIcon(genre.iconName)}
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-purple-800 transition-colors">
                {genre.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
