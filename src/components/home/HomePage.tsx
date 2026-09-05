import React from 'react';
import { HeroSection } from './HeroSection';
import { TrendingStories } from './TrendingStories';
import { PopularGenres } from './PopularGenres';
import { FeaturedAuthors } from './FeaturedAuthors';
import { StoryOfWeek } from './StoryOfWeek';
import { NewsletterSection } from './CommunityStats';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Clean, Fast Hero Section */}
      <HeroSection />

      {/* 2. Trending Stories Carousel */}
      <TrendingStories />

      {/* 3. Popular Genres Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PopularGenres />
      </div>

      {/* 4. Story of the Week (Only renders when a story is marked) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StoryOfWeek />
      </div>

      {/* 5. Registered Authors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedAuthors />
      </div>

      {/* 6. Newsletter Subscription */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterSection />
      </div>

    </div>
  );
};
