import { User, Story, Chapter, GenreInfo, Comment, NotificationItem, ReportItem, AdminLogItem, ReaderTestimonial } from '../types';

export const INITIAL_GENRES: GenreInfo[] = [
  { id: 'romance', name: 'Romance', nameBn: 'রোমান্স', iconName: 'Heart', color: '#EC4899', bgLight: '#FDF2F8', storyCount: 0, description: 'হৃদয়স্পর্শী প্রেম, আবেগ এবং ভালোবাসার অনুভূতির গল্প।' },
  { id: 'thriller', name: 'Thriller', nameBn: 'থ্রিলার', iconName: 'Flame', color: '#F97316', bgLight: '#FFF7ED', storyCount: 0, description: 'রোমহর্ষক রহস্য, সাসপেন্স ও টানটান উত্তেজনার গল্প।' },
  { id: 'horror', name: 'Horror', nameBn: 'হরর', iconName: 'Ghost', color: '#8B5CF6', bgLight: '#F5F3FF', storyCount: 0, description: 'গা ছমছমে ভৌতিক অভিজ্ঞতা, অতিলৌকিক ছায়া এবং ভয়।' },
  { id: 'sci-fi', name: 'Sci-Fi', nameBn: 'সায়েন্স ফিকশন', iconName: 'Rocket', color: '#3B82F6', bgLight: '#EFF6FF', storyCount: 0, description: 'ভবিষ্যত প্রযুক্তি, মহাকাশ অভিযান ও টাইম ট্রাভেলের বিস্ময়।' },
  { id: 'mystery', name: 'Mystery', nameBn: 'মিস্ট্রি', iconName: 'Eye', color: '#6366F1', bgLight: '#EEF2FF', storyCount: 0, description: 'রহস্যময় গোয়েন্দাগিরি ও লুকানো সত্য উদঘাটনের গল্প।' },
  { id: 'fantasy', name: 'Fantasy', nameBn: 'ফ্যান্টাসি', iconName: 'Wand2', color: '#10B981', bgLight: '#ECFDF5', storyCount: 0, description: 'জাদু, ড্রাগন, রূপকথা এবং কাল্পনিক জগতের মহাকাব্য।' },
  { id: 'drama', name: 'Drama', nameBn: 'ড্রামা', iconName: 'Tv', color: '#A855F7', bgLight: '#FAF5FF', storyCount: 0, description: 'বাস্তব জীবন, সামাজিক প্রেক্ষাপট এবং পারিবারিক টানাপোড়েন।' },
  { id: 'comedy', name: 'Comedy', nameBn: 'কমেডি', iconName: 'Smile', color: '#EAB308', bgLight: '#FEFCE8', storyCount: 0, description: 'নির্মল আনন্দ, হাস্যকৌতুক ও মজার মুহূর্ত।' },
];

export const INITIAL_USERS: User[] = [];

export const INITIAL_STORIES: Story[] = [];

export const INITIAL_CHAPTERS: Record<string, Chapter[]> = {};

export const INITIAL_COMMENTS: Comment[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_REPORTS: ReportItem[] = [];

export const INITIAL_ADMIN_LOGS: AdminLogItem[] = [];

export const INITIAL_TESTIMONIALS: ReaderTestimonial[] = [];
