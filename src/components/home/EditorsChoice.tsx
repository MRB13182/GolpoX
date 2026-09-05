import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ChoiceItem {
  id: string;
  title: string;
  countText: string;
  image: string;
  genreFilter: string;
}

export const EditorsChoice: React.FC = () => {
  const { setSelectedGenreId, setCurrentPage } = useApp();

  const choices: ChoiceItem[] = [
    {
      id: 'romance-choice',
      title: 'Top Romance',
      countText: '25 Stories',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80',
      genreFilter: 'romance'
    },
    {
      id: 'thriller-choice',
      title: 'Top Thriller',
      countText: '20 Stories',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      genreFilter: 'thriller'
    },
    {
      id: 'horror-choice',
      title: 'Best Horror',
      countText: '18 Stories',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      genreFilter: 'horror'
    },
    {
      id: 'new-choice',
      title: 'New Releases',
      countText: '30 Stories',
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3dd45?w=600&auto=format&fit=crop&q=80',
      genreFilter: ''
    }
  ];

  const handleClick = (genreId: string) => {
    setSelectedGenreId(genreId || null);
    setCurrentPage('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-left">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Editor's Choice
            </h3>
            <p className="text-xs text-slate-500 font-medium">সম্পাদকীয় পছন্দের বাছাইকৃত গল্প সংগ্রহ</p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentPage('stories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-purple-100/50 cursor-pointer"
        >
          Explore All
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {choices.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item.genreFilter)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border border-white/10"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 p-4 text-white text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">{item.countText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
