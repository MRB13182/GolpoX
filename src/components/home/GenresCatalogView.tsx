import React from 'react';
import { 
  Heart, 
  Flame, 
  Ghost, 
  Rocket, 
  Eye, 
  Wand2, 
  Tv, 
  Smile, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GenresCatalogView: React.FC = () => {
  const { genres, setSelectedGenreId, setCurrentPage, stories } = useApp();

  const getGenreIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-8 h-8 text-pink-500 fill-pink-500/20" />;
      case 'Flame': return <Flame className="w-8 h-8 text-amber-500 fill-amber-500/20" />;
      case 'Ghost': return <Ghost className="w-8 h-8 text-purple-600" />;
      case 'Rocket': return <Rocket className="w-8 h-8 text-blue-500" />;
      case 'Eye': return <Eye className="w-8 h-8 text-indigo-500" />;
      case 'Wand2': return <Wand2 className="w-8 h-8 text-emerald-500" />;
      case 'Tv': return <Tv className="w-8 h-8 text-purple-500" />;
      case 'Smile': return <Smile className="w-8 h-8 text-yellow-500" />;
      default: return <Sparkles className="w-8 h-8 text-purple-500" />;
    }
  };

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenreId(genreId);
    setCurrentPage('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>গল্পের ক্যাটাগরি ও বিষয়বস্তু</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Story Genres & Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            আপনার পছন্দের স্বাদের গল্প বেছে নিন — রোমান্স, ভৌতিক, গোয়েন্দা থ্রিলার কিংবা কল্পবিজ্ঞান
          </p>
        </div>

        {/* Big Genre Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {genres.map((genre) => {
            const count = (stories || []).filter(s => (s.genres || []).some(g => g.toLowerCase() === genre.id.toLowerCase() || g.toLowerCase() === genre.name.toLowerCase())).length || genre.storyCount || 0;
            return (
              <div
                key={genre.id}
                onClick={() => handleSelectGenre(genre.id)}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: genre.bgLight }}
                  >
                    {getGenreIcon(genre.iconName)}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {genre.name} ({genre.nameBn})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {genre.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-400">
                    {count} Stories Available
                  </span>
                  <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
