export type UserRole = 'guest' | 'reader' | 'author' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  id: string;
  name: string;
  nameBn?: string;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio: string;
  followersCount: number;
  followingCount: number;
  storiesCount: number;
  isVerified: boolean;
  joinedDate: string;
  lastLogin: string;
  status: UserStatus;
  readingHistory: {
    storyId: string;
    chapterId: string;
    chapterNumber: number;
    progressPercentage: number;
    lastReadAt: string;
  }[];
  bookmarks: string[]; // story IDs
  likedStories: string[]; // story IDs
  followingAuthors: string[]; // user IDs
  achievements: {
    id: string;
    title: string;
    titleBn: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
}

export type StoryStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'hidden';

export interface Chapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  titleBn?: string;
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
  readsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
  publishedAt: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface StoryRating {
  average: number;
  totalCount: number;
  distribution: RatingDistribution;
}

export interface Story {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerified: boolean;
  description: string;
  synopsis: string;
  genres: string[];
  status: StoryStatus;
  visibilityScore: number; // 0-100
  adminBoostScore: number;
  rating: StoryRating;
  views: number;
  readsCount: number;
  completionRate: number; // percentage e.g. 74
  commentsCount: number;
  bookmarksCount: number;
  isFeatured: boolean;
  isEditorChoice: boolean;
  isStoryOfWeek: boolean;
  isHeroStory: boolean;
  isPaid: boolean;
  price?: number;
  language: 'bn' | 'en';
  chaptersCount: number;
  chapters?: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  storyId: string;
  chapterId?: string;
  chapterNumber?: number;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  likesCount: number;
  userLiked?: boolean;
  replies: Comment[];
  isPinned: boolean;
  isHighlighted: boolean;
  isReported: boolean;
  createdAt: string;
}

export interface RatingReview {
  id: string;
  storyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  reviewText: string;
  likesCount: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'follower' | 'story_approved' | 'comment_received' | 'story_featured' | 'chapter_published' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  targetType: 'story' | 'comment' | 'author';
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken';
  createdAt: string;
}

export interface AdminLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  actionType: string;
  targetType: 'story' | 'user' | 'comment' | 'genre' | 'system';
  targetId: string;
  targetName: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface GenreInfo {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  color: string;
  bgLight: string;
  storyCount: number;
  description: string;
}

export interface ReaderTestimonial {
  id: string;
  name: string;
  nameBn: string;
  avatar: string;
  rating: number;
  quote: string;
  quoteBn: string;
  badge?: string;
}

export type ActivePage = 
  | 'home'
  | 'stories'
  | 'genre'
  | 'authors'
  | 'author-profile'
  | 'story-detail'
  | 'reader-mode'
  | 'author-dashboard'
  | 'admin-dashboard'
  | 'blog';

export interface LogoBranding {
  id: 'GOLPOX_MAIN_LOGO';
  storagePath: 'assets/branding/golpox-main-logo';
  url: string;
  fileName: string;
  fileType: string;
  format: 'PNG' | 'SVG' | 'WEBP';
  fileSizeBytes: number;
  width?: number;
  height?: number;
  lastUpdated: string;
  isCustom: boolean;
}
