import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Story, 
  Chapter, 
  Comment, 
  NotificationItem, 
  ReportItem, 
  AdminLogItem, 
  ActivePage,
  GenreInfo,
  ReaderTestimonial,
  LogoBranding
} from '../types';
import {
  getStoredLogoBranding,
  processLogoUpload,
  resetLogoBranding,
  syncHeadBrandingMetadata
} from '../services/brandingService';
import { 
  INITIAL_USERS, 
  INITIAL_STORIES, 
  INITIAL_GENRES, 
  INITIAL_COMMENTS, 
  INITIAL_CHAPTERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS, 
  INITIAL_ADMIN_LOGS,
  INITIAL_TESTIMONIALS
} from '../data/initialData';

// Check and clean legacy demo cache
try {
  const legacyUsers = localStorage.getItem('golpox_users');
  const legacyStories = localStorage.getItem('golpox_stories');
  if (
    (legacyUsers && (legacyUsers.includes('Tahsin Ahmed') || legacyUsers.includes('admin-super'))) ||
    (legacyStories && legacyStories.includes('অন্ধকার প্রাসাদ'))
  ) {
    localStorage.removeItem('golpox_users');
    localStorage.removeItem('golpox_current_user');
    localStorage.removeItem('golpox_stories');
    localStorage.removeItem('golpox_chapters');
    localStorage.removeItem('golpox_comments');
    localStorage.removeItem('golpox_notifs');
    localStorage.removeItem('golpox_reports');
    localStorage.removeItem('golpox_admin_logs');
  }
} catch (e) {
  // Ignore storage error
}

interface ReadingSettings {
  theme: 'light' | 'sepia' | 'dark' | 'midnight';
  fontSize: number; // 14 to 28
  lineHeight: number; // 1.4 to 2.4
  fontFamily: 'bangla-serif' | 'bangla-sans';
  maxWidth: 'compact' | 'normal' | 'wide';
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedStoryId: string | null;
  setSelectedStoryId: (id: string | null) => void;
  selectedChapterId: string | null;
  setSelectedChapterId: (id: string | null) => void;
  selectedAuthorId: string | null;
  setSelectedAuthorId: (id: string | null) => void;
  selectedGenreId: string | null;
  setSelectedGenreId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Users & Auth
  currentUser: User | null;
  currentRole: UserRole;
  users: User[];
  switchUserRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register' | 'forgot' | 'verify';
  setAuthModalTab: (tab: 'login' | 'register' | 'forgot' | 'verify') => void;
  loginUser: (email: string, password?: string) => boolean;
  registerUser: (name: string, email: string, role?: UserRole) => boolean;
  logoutUser: () => void;

  // Stories Data
  stories: Story[];
  chapters: Chapter[];
  genres: GenreInfo[];
  testimonials: ReaderTestimonial[];
  getStoryById: (id: string) => Story | undefined;
  getChaptersForStory: (storyId: string) => Chapter[];
  getChapterById: (storyId: string, chapterId: string) => Chapter | undefined;

  // User Actions (Reader / Author)
  toggleBookmark: (storyId: string) => void;
  isBookmarked: (storyId: string) => boolean;
  toggleLikeStory: (storyId: string) => void;
  isStoryLiked: (storyId: string) => boolean;
  toggleFollowAuthor: (authorId: string) => void;
  isAuthorFollowed: (authorId: string) => boolean;
  submitRating: (storyId: string, rating: number, reviewText?: string) => void;
  saveReadingProgress: (storyId: string, chapterId: string, chapterNumber: number, progressPercentage: number) => void;
  
  // Comments
  comments: Comment[];
  addComment: (storyId: string, content: string, chapterId?: string, chapterNumber?: number, replyToCommentId?: string) => void;
  toggleLikeComment: (commentId: string) => void;
  reportComment: (commentId: string, reason: string) => void;

  // Author Operations
  createStory: (storyData: Partial<Story>) => Story;
  updateStory: (storyId: string, storyData: Partial<Story>) => void;
  deleteStory: (storyId: string) => void;
  saveChapter: (storyId: string, chapterData: Partial<Chapter>) => Chapter;
  createChapter: (chapterData: { storyId: string; title: string; content: string; status?: 'draft' | 'published' }) => Chapter;
  deleteChapter: (storyId: string, chapterId: string) => void;

  // Platform Admin Operations
  approveStory: (storyId: string) => void;
  rejectStory: (storyId: string) => void;
  toggleFeatureStory: (storyId: string) => void;
  togglePinStory: (storyId: string) => void;
  toggleHideStory: (storyId: string) => void;
  adjustStoryRating: (storyId: string, newRating: number, visibilityBoost: number, reason: string) => void;
  setStoryOfTheWeek: (storyId: string) => void;
  toggleStoryOfTheWeek: (storyId: string) => void;
  setEditorChoice: (storyId: string, isChoice: boolean) => void;
  verifyAuthor: (authorId: string, isVerified: boolean) => void;
  toggleUserVerification: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned', reason?: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  moderateComment: (commentId: string, action: 'pin' | 'highlight' | 'delete', replyText?: string) => void;
  resolveReport: (reportId: string, actionTaken: string) => void;

  // System & Logs
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  reports: ReportItem[];
  adminLogs: AdminLogItem[];

  // Reading Experience Settings
  readingSettings: ReadingSettings;
  updateReadingSettings: (settings: Partial<ReadingSettings>) => void;

  // Branding & Logo Management (GOLPOX_MAIN_LOGO)
  logoBranding: LogoBranding;
  activeLogoUrl: string;
  uploadLogo: (file: File) => Promise<{ success: boolean; message: string }>;
  deleteLogo: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Storage State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('golpox_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('golpox_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.role === 'admin' || parsed.role === 'author')) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('golpox_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [chaptersMap, setChaptersMap] = useState<Record<string, Chapter[]>>(() => {
    const saved = localStorage.getItem('golpox_chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('golpox_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('golpox_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('golpox_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>(() => {
    const saved = localStorage.getItem('golpox_admin_logs');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_LOGS;
  });

  const [genres] = useState<GenreInfo[]>(INITIAL_GENRES);
  const [testimonials] = useState<ReaderTestimonial[]>(INITIAL_TESTIMONIALS);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');

  // Reading Experience Settings
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('golpox_reader_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      fontSize: 18,
      lineHeight: 1.8,
      fontFamily: 'bangla-serif',
      maxWidth: 'normal'
    };
  });

  // Single Source Logo Branding State (GOLPOX_MAIN_LOGO)
  const [logoBranding, setLogoBranding] = useState<LogoBranding>(() => {
    return getStoredLogoBranding();
  });

  useEffect(() => {
    syncHeadBrandingMetadata(logoBranding.url);
  }, [logoBranding.url]);

  const uploadLogo = async (file: File): Promise<{ success: boolean; message: string }> => {
    try {
      const updated = await processLogoUpload(file);
      setLogoBranding(updated);
      logAdminAction(
        'update_branding',
        'system',
        'GOLPOX_MAIN_LOGO',
        'Main Branding Logo',
        `Uploaded new logo: ${file.name} (${updated.format}, ${(updated.fileSizeBytes / 1024).toFixed(1)} KB)`
      );
      addToast({
        type: 'success',
        title: 'Logo Updated',
        message: 'GOLPOX_MAIN_LOGO updated across all website locations.',
      });
      return { success: true, message: 'Logo successfully applied.' };
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not process logo.',
      });
      return { success: false, message: err.message || 'Upload failed' };
    }
  };

  const deleteLogo = () => {
    const defaultBranding = resetLogoBranding();
    setLogoBranding(defaultBranding);
    logAdminAction(
      'reset_branding',
      'system',
      'GOLPOX_MAIN_LOGO',
      'Main Branding Logo',
      'Reset logo to default official vector branding'
    );
    addToast({
      type: 'info',
      title: 'Logo Reset to Default',
      message: 'GOLPOX_MAIN_LOGO restored to official default asset.',
    });
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('golpox_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('golpox_current_user', JSON.stringify(currentUser));
    if (currentUser) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('golpox_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('golpox_chapters', JSON.stringify(chaptersMap));
  }, [chaptersMap]);

  useEffect(() => {
    localStorage.setItem('golpox_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('golpox_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('golpox_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('golpox_admin_logs', JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    localStorage.setItem('golpox_reader_settings', JSON.stringify(readingSettings));
  }, [readingSettings]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAdminAction = (actionType: string, targetType: 'story' | 'user' | 'comment' | 'genre' | 'system', targetId: string, targetName: string, details: string, previousValue?: string, newValue?: string) => {
    const newLog: AdminLogItem = {
      id: 'log-' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminEmail: currentUser?.email || 'console-admin',
      actionType,
      targetType,
      targetId,
      targetName,
      details,
      previousValue,
      newValue,
      timestamp: 'Just now'
    };
    setAdminLogs(prev => [newLog, ...prev]);
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      setCurrentRole('guest');
      addToast({ type: 'info', title: 'Role Changed', message: 'Switched to Guest mode (read limited preview).' });
      return;
    }

    if (role === 'admin') {
      addToast({ type: 'warning', title: 'Authentication Required', message: 'Please sign in with your administrator credentials.' });
      return;
    }

    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      setCurrentRole(matchedUser.role);
      addToast({ 
        type: 'success', 
        title: `Switched to ${role.toUpperCase()}`, 
        message: `Logged in as ${matchedUser.name}` 
      });
    } else {
      // Create new user for this role
      const newUser: User = {
        id: `user-${role}-${Date.now()}`,
        name: role === 'author' ? 'Author Writer' : 'Reader Member',
        nameBn: role === 'author' ? 'লেখক বন্ধু' : 'পাঠক বন্ধু',
        username: `${role}_${Date.now().toString().slice(-4)}`,
        email: `${role}${Date.now().toString().slice(-4)}@golpox.app`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role,
        bio: `GolpoX literary platform member.`,
        followersCount: 0,
        followingCount: 0,
        storiesCount: 0,
        isVerified: false,
        joinedDate: 'Today',
        lastLogin: 'Now',
        status: 'active',
        readingHistory: [],
        bookmarks: [],
        likedStories: [],
        followingAuthors: [],
        achievements: []
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setCurrentRole(role);
      addToast({ type: 'success', title: `Role Created`, message: `Created and logged into new ${role} account.` });
    }
  };

  // Secure administrative hash verification
  const AUTH_IDENTITY_HASH = '5c015c5f238202efa0727ba3e1aebb6f9edce595ff2b82133fdcf159aeebae38';
  const AUTH_SECRET_HASH = 'a444ee13db5b0974562367c002ffcdaacadc6b71e82af87101431180ec959b51';

  function verifyAuthHash(input: string): string {
    function rotRight(val: number, bits: number) {
      return (val >>> bits) | (val << (32 - bits));
    }
    const maxWord = Math.pow(2, 32);
    let i: number, j: number;
    let out = '';
    const words: number[] = [];
    const bitLen = input.length * 8;
    let hash: number[] = [];
    const k: number[] = [];
    let pCount = 0;
    const isComp: Record<number, boolean> = {};
    for (let candidate = 2; pCount < 64; candidate++) {
      if (!isComp[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComp[i] = true;
        }
        hash[pCount] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[pCount++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    hash = hash.slice(0, 8);
    let str = input + '\x80';
    while ((str.length % 64) - 56) str += '\x00';
    for (i = 0; i < str.length; i++) {
      j = str.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (bitLen / maxWord) | 0;
    words[words.length] = bitLen;
    for (j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldH = hash.slice(0);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rotRight(w15, 7) ^ rotRight(w15, 18) ^ (w15 >>> 3);
        const s1 = rotRight(w2, 17) ^ rotRight(w2, 19) ^ (w2 >>> 10);
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const t1 = hash[7] + (rotRight(hash[4], 6) ^ rotRight(hash[4], 11) ^ rotRight(hash[4], 25)) + ch + k[i] + (w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
        const t2 = (rotRight(hash[0], 2) ^ rotRight(hash[0], 13) ^ rotRight(hash[0], 22)) + maj;
        hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[3] + t1) | 0, hash[4], hash[5], hash[6]];
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldH[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        const byte = (hash[i] >> (j * 8)) & 255;
        out += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return out;
  }

  const loginUser = (email: string, password?: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    const providedPassword = password || '';

    // Secure administrative authentication check via hash
    const emailHash = verifyAuthHash(normalizedEmail);
    const passHash = verifyAuthHash(providedPassword);

    if (emailHash === AUTH_IDENTITY_HASH) {
      if (passHash === AUTH_SECRET_HASH) {
        let adminUser = users.find(u => u.role === 'admin');
        if (!adminUser) {
          adminUser = {
            id: 'admin-sec-' + Date.now(),
            name: 'Administrator',
            nameBn: 'অ্যাডমিনিস্ট্রেটর',
            username: normalizedEmail.split('@')[0],
            email: normalizedEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'admin',
            bio: 'Platform Administrator',
            followersCount: 0,
            followingCount: 0,
            storiesCount: 0,
            isVerified: true,
            joinedDate: 'September 2026',
            lastLogin: 'Active',
            status: 'active',
            readingHistory: [],
            bookmarks: [],
            likedStories: [],
            followingAuthors: [],
            achievements: []
          };
          setUsers(prev => [adminUser!, ...prev.filter(u => u.id !== adminUser!.id)]);
        }
        setCurrentUser(adminUser);
        setCurrentRole('admin');
        addToast({ 
          type: 'success', 
          title: 'Welcome Back', 
          message: 'Signed in successfully.' 
        });
        setIsAuthModalOpen(false);
        setCurrentPage('admin-dashboard');
        return true;
      } else {
        addToast({ 
          type: 'error', 
          title: 'Authentication Failed', 
          message: 'Invalid email or password. Please try again.' 
        });
        return false;
      }
    }

    // Registered author/user lookup
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === normalizedEmail);
    if (existing) {
      if (existing.status === 'banned') {
        addToast({ 
          type: 'error', 
          title: 'Account Suspended', 
          message: 'This account has been suspended by administration.' 
        });
        return false;
      }
      setCurrentUser(existing);
      setCurrentRole(existing.role);
      addToast({ type: 'success', title: 'Welcome Back', message: `Signed in as ${existing.name}` });
      setIsAuthModalOpen(false);
      return true;
    }

    // User not found
    addToast({ 
      type: 'warning', 
      title: 'Account Not Found', 
      message: 'No registered account found with this email. Please create an account.' 
    });
    setAuthModalTab('register');
    return false;
  };

  const registerUser = (name: string, email: string, role: UserRole = 'author'): boolean => {
    const normalizedEmail = email.trim().toLowerCase();

    // Prevent reservation of protected identities or role elevation
    const emailHash = verifyAuthHash(normalizedEmail);
    if (emailHash === AUTH_IDENTITY_HASH || role === 'admin') {
      addToast({ 
        type: 'warning', 
        title: 'Account Exists', 
        message: 'An account with this email already exists. Please sign in.' 
      });
      setAuthModalTab('login');
      return false;
    }

    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      addToast({ type: 'warning', title: 'Account Exists', message: 'An account with this email already exists. Please sign in.' });
      setAuthModalTab('login');
      return false;
    }

    const newUser: User = {
      id: 'author-' + Date.now(),
      name: name.trim(),
      username: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'author',
      bio: `Author on GolpoX.`,
      followersCount: 0,
      followingCount: 0,
      storiesCount: 0,
      isVerified: false,
      joinedDate: 'Today',
      lastLogin: 'Just now',
      status: 'active',
      readingHistory: [],
      bookmarks: [],
      likedStories: [],
      followingAuthors: [],
      achievements: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentRole('author');
    addToast({ type: 'success', title: 'Author Account Created', message: `Welcome to GolpoX, ${name}!` });
    setIsAuthModalOpen(false);
    setCurrentPage('author-dashboard');
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    addToast({ type: 'info', title: 'Logged Out', message: 'You have signed out of your account.' });
    if (currentPage === 'admin-dashboard' || currentPage === 'author-dashboard') {
      setCurrentPage('home');
    }
  };

  const getStoryById = (id: string) => {
    return stories.find(s => s.id === id);
  };

  const getChaptersForStory = (storyId: string): Chapter[] => {
    if (chaptersMap[storyId]) {
      return chaptersMap[storyId];
    }
    const story = stories.find(s => s.id === storyId);
    return story?.chapters || [];
  };

  const getChapterById = (storyId: string, chapterId: string) => {
    const chapters = getChaptersForStory(storyId);
    return chapters.find(c => c.id === chapterId);
  };

  const toggleBookmark = (storyId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      addToast({ type: 'warning', title: 'Sign In Required', message: 'Please sign in to bookmark stories.' });
      return;
    }

    const isBookmarked = currentUser.bookmarks.includes(storyId);
    const updatedBookmarks = isBookmarked 
      ? currentUser.bookmarks.filter(id => id !== storyId)
      : [...currentUser.bookmarks, storyId];

    const updatedUser = { ...currentUser, bookmarks: updatedBookmarks };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Update story bookmark count
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          bookmarksCount: isBookmarked ? Math.max(0, s.bookmarksCount - 1) : s.bookmarksCount + 1
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: isBookmarked ? 'Bookmark Removed' : 'Story Bookmarked',
      message: isBookmarked ? 'Removed from your library.' : 'Saved to your reading library.'
    });
  };

  const isBookmarked = (storyId: string) => {
    return currentUser?.bookmarks.includes(storyId) || false;
  };

  const toggleLikeStory = (storyId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isLiked = currentUser.likedStories.includes(storyId);
    const updatedLikes = isLiked 
      ? currentUser.likedStories.filter(id => id !== storyId)
      : [...currentUser.likedStories, storyId];

    const updatedUser = { ...currentUser, likedStories: updatedLikes };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    addToast({
      type: 'info',
      title: isLiked ? 'Unliked' : 'Liked',
      message: isLiked ? 'Story removed from likes.' : 'Added story to your liked stories!'
    });
  };

  const isStoryLiked = (storyId: string) => {
    return currentUser?.likedStories.includes(storyId) || false;
  };

  const toggleFollowAuthor = (authorId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isFollowing = currentUser.followingAuthors.includes(authorId);
    const updatedFollowing = isFollowing 
      ? currentUser.followingAuthors.filter(id => id !== authorId)
      : [...currentUser.followingAuthors, authorId];

    const updatedUser = { ...currentUser, followingAuthors: updatedFollowing };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) return updatedUser;
      if (u.id === authorId) {
        return {
          ...u,
          followersCount: isFollowing ? Math.max(0, u.followersCount - 1) : u.followersCount + 1
        };
      }
      return u;
    }));

    addToast({
      type: 'success',
      title: isFollowing ? 'Unfollowed' : 'Following Author',
      message: isFollowing ? 'You unfollowed this author.' : 'You will receive notifications for new chapters!'
    });
  };

  const isAuthorFollowed = (authorId: string) => {
    return currentUser?.followingAuthors.includes(authorId) || false;
  };

  const submitRating = (storyId: string, rating: number, reviewText?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        const oldDistribution = { ...s.rating.distribution };
        const key = rating as 1 | 2 | 3 | 4 | 5;
        oldDistribution[key] = (oldDistribution[key] || 0) + 1;
        const total = s.rating.totalCount + 1;
        const totalScore = (
          oldDistribution[1] * 1 +
          oldDistribution[2] * 2 +
          oldDistribution[3] * 3 +
          oldDistribution[4] * 4 +
          oldDistribution[5] * 5
        );
        const newAvg = parseFloat((totalScore / total).toFixed(1));

        return {
          ...s,
          rating: {
            average: newAvg,
            totalCount: total,
            distribution: oldDistribution
          }
        };
      }
      return s;
    }));

    addToast({
      type: 'success',
      title: 'Rating Submitted',
      message: `Thank you for rating ${rating} ★!`
    });
  };

  const saveReadingProgress = (storyId: string, chapterId: string, chapterNumber: number, progressPercentage: number) => {
    if (!currentUser) return;

    const existingHistory = currentUser.readingHistory.filter(h => h.storyId !== storyId);
    const updatedHistory = [
      {
        storyId,
        chapterId,
        chapterNumber,
        progressPercentage,
        lastReadAt: 'Just now'
      },
      ...existingHistory
    ];

    const updatedUser = { ...currentUser, readingHistory: updatedHistory };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addComment = (storyId: string, content: string, chapterId?: string, chapterNumber?: number, replyToCommentId?: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const newComment: Comment = {
      id: 'cmt-' + Date.now(),
      storyId,
      chapterId,
      chapterNumber,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content,
      likesCount: 0,
      userLiked: false,
      replies: [],
      isPinned: false,
      isHighlighted: false,
      isReported: false,
      createdAt: 'Just now'
    };

    if (replyToCommentId) {
      setComments(prev => prev.map(c => {
        if (c.id === replyToCommentId) {
          return {
            ...c,
            replies: [...c.replies, newComment]
          };
        }
        return c;
      }));
    } else {
      setComments(prev => [newComment, ...prev]);
    }

    // Increment story comment count
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, commentsCount: s.commentsCount + 1 } : s));

    addToast({ type: 'success', title: 'Comment Posted', message: 'Your comment is now live.' });
  };

  const toggleLikeComment = (commentId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const liked = c.userLiked;
        return {
          ...c,
          userLiked: !liked,
          likesCount: liked ? Math.max(0, c.likesCount - 1) : c.likesCount + 1
        };
      }
      return {
        ...c,
        replies: c.replies.map(r => {
          if (r.id === commentId) {
            const liked = r.userLiked;
            return {
              ...r,
              userLiked: !liked,
              likesCount: liked ? Math.max(0, r.likesCount - 1) : r.likesCount + 1
            };
          }
          return r;
        })
      };
    }));
  };

  const reportComment = (commentId: string, reason: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const report: ReportItem = {
      id: 'rep-' + Date.now(),
      targetType: 'comment',
      targetId: commentId,
      targetTitle: 'Comment: ' + commentId,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      details: 'Flagged by community user.',
      status: 'pending',
      createdAt: 'Just now'
    };

    setReports(prev => [report, ...prev]);
    addToast({ type: 'info', title: 'Report Submitted', message: 'Admin moderators will review this comment shortly.' });
  };

  // Author Operations
  const createStory = (storyData: Partial<Story>): Story => {
    const author = currentUser || users.find(u => u.role === 'author') || {
      id: 'author-default',
      name: 'GolpoX Creator',
      nameBn: 'গল্পকার',
      username: 'creator',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isVerified: false
    };
    const newStory: Story = {
      id: 'story-' + Date.now(),
      title: storyData.title || 'নতুন গল্প',
      titleEn: storyData.titleEn,
      slug: (storyData.title || 'new-story').toLowerCase().replace(/\s+/g, '-'),
      coverImage: storyData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      authorId: author.id,
      authorName: author.nameBn || author.name,
      authorUsername: author.username,
      authorAvatar: author.avatar,
      authorVerified: author.isVerified,
      description: storyData.description || 'গল্পের সংক্ষিপ্ত বিবরণ...',
      synopsis: storyData.synopsis || storyData.description || '',
      genres: storyData.genres && storyData.genres.length > 0 ? storyData.genres : ['Romance'],
      status: (storyData.status as any) || 'pending',
      visibilityScore: 60,
      adminBoostScore: 0,
      rating: { average: 5.0, totalCount: 1, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 } },
      views: 1,
      readsCount: 1,
      completionRate: 100,
      commentsCount: 0,
      bookmarksCount: 0,
      isFeatured: false,
      isEditorChoice: false,
      isStoryOfWeek: false,
      isHeroStory: false,
      isPaid: storyData.isPaid || false,
      price: storyData.price || 0,
      language: 'bn',
      chaptersCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Create default first chapter
    const defaultChapter: Chapter = {
      id: `ch-${newStory.id}-1`,
      storyId: newStory.id,
      chapterNumber: 1,
      title: 'প্রথম অধ্যায়',
      titleBn: 'প্রথম অধ্যায়',
      content: 'এখানে আপনার গল্পের প্রথম অধ্যায়ের বর্ণনা ও রোমাঞ্চকর ঘটনাগুলো লিখুন...',
      wordCount: 100,
      readingTimeMinutes: 1,
      readsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0]
    };

    setStories(prev => [newStory, ...prev]);
    setChaptersMap(prev => ({
      ...prev,
      [newStory.id]: [defaultChapter]
    }));

    // Update author stories count
    setUsers(prev => prev.map(u => u.id === author.id ? { ...u, storiesCount: u.storiesCount + 1 } : u));

    addToast({
      type: 'success',
      title: 'Story Created',
      message: `"${newStory.title}" created successfully.`
    });

    return newStory;
  };

  const updateStory = (storyId: string, storyData: Partial<Story>) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          ...storyData,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));

    addToast({ type: 'success', title: 'Story Updated', message: 'Changes saved successfully.' });
  };

  const deleteStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    setStories(prev => prev.filter(s => s.id !== storyId));
    setChaptersMap(prev => {
      const copy = { ...prev };
      delete copy[storyId];
      return copy;
    });

    if (currentUser) {
      logAdminAction('DELETE_STORY', 'story', storyId, story?.title || 'Story', 'Permanently deleted story and chapters');
    }

    addToast({ type: 'info', title: 'Story Deleted', message: 'The story has been removed.' });
  };

  const saveChapter = (storyId: string, chapterData: Partial<Chapter>): Chapter => {
    const existing = chaptersMap[storyId] || [];
    let updatedChapter: Chapter;

    if (chapterData.id) {
      // update
      updatedChapter = {
        ...existing.find(c => c.id === chapterData.id)!,
        ...chapterData,
        wordCount: chapterData.content ? chapterData.content.trim().split(/\s+/).length : 0,
        readingTimeMinutes: Math.max(1, Math.ceil((chapterData.content ? chapterData.content.trim().split(/\s+/).length : 0) / 200))
      } as Chapter;

      setChaptersMap(prev => ({
        ...prev,
        [storyId]: prev[storyId].map(c => c.id === chapterData.id ? updatedChapter : c)
      }));
    } else {
      // create new
      const nextNum = existing.length + 1;
      const wordCount = chapterData.content ? chapterData.content.trim().split(/\s+/).length : 0;
      updatedChapter = {
        id: `ch-${storyId}-${Date.now()}`,
        storyId,
        chapterNumber: nextNum,
        title: chapterData.title || `অধ্যায় ${nextNum}`,
        titleBn: chapterData.titleBn || `অধ্যায় ${nextNum}`,
        content: chapterData.content || '',
        wordCount,
        readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        readsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        status: chapterData.status || 'published',
        publishedAt: new Date().toISOString().split('T')[0]
      };

      setChaptersMap(prev => ({
        ...prev,
        [storyId]: [...(prev[storyId] || []), updatedChapter]
      }));

      // Update story chapters count
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, chaptersCount: (s.chaptersCount || 0) + 1 } : s));
    }

    addToast({ type: 'success', title: 'Chapter Saved', message: `Saved "${updatedChapter.title}".` });
    return updatedChapter;
  };

  const deleteChapter = (storyId: string, chapterId: string) => {
    setChaptersMap(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || []).filter(c => c.id !== chapterId)
    }));

    setStories(prev => prev.map(s => s.id === storyId ? { ...s, chaptersCount: Math.max(0, s.chaptersCount - 1) } : s));
    addToast({ type: 'info', title: 'Chapter Deleted', message: 'Chapter has been removed.' });
  };

  // Platform Admin Actions
  const approveStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: 'published' } : s));
    logAdminAction('APPROVE_STORY', 'story', storyId, story?.title || 'Story', 'Approved story for public publication');
    addToast({ type: 'success', title: 'Story Approved', message: `"${story?.title}" is now published publicly.` });
  };

  const rejectStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: 'rejected' } : s));
    logAdminAction('REJECT_STORY', 'story', storyId, story?.title || 'Story', 'Rejected story submission');
    addToast({ type: 'warning', title: 'Story Rejected', message: `"${story?.title}" rejected.` });
  };

  const toggleFeatureStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const nextState = !story.isFeatured;
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isFeatured: nextState } : s));
    logAdminAction('FEATURE_STORY', 'story', storyId, story.title, `${nextState ? 'Added to' : 'Removed from'} Featured Stories pool`);
    addToast({ type: 'success', title: nextState ? 'Story Featured' : 'Feature Removed', message: `Updated status for "${story.title}".` });
  };

  const togglePinStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const nextState = !story.isHeroStory;
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isHeroStory: nextState } : s));
    logAdminAction('HERO_PIN_STORY', 'story', storyId, story.title, `${nextState ? 'Pinned to' : 'Unpinned from'} Hero Banner Carousel`);
    addToast({ type: 'success', title: nextState ? 'Hero Pinned' : 'Unpinned from Hero', message: `Hero status updated for "${story.title}".` });
  };

  const toggleHideStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const nextStatus = story.status === 'hidden' ? 'published' : 'hidden';
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, status: nextStatus } : s));
    logAdminAction('VISIBILITY_STATUS', 'story', storyId, story.title, `Changed status to ${nextStatus}`);
    addToast({ type: 'info', title: `Story ${nextStatus === 'hidden' ? 'Hidden' : 'Unhidden'}`, message: `"${story.title}" visibility changed.` });
  };

  const adjustStoryRating = (storyId: string, newRating: number, visibilityBoost: number, reason: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const prevScore = `Avg Rating: ${story.rating.average}, Boost: ${story.adminBoostScore}`;
    const newScore = `Avg Rating: ${newRating}, Boost: ${visibilityBoost}`;

    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          adminBoostScore: visibilityBoost,
          visibilityScore: Math.min(100, Math.max(0, s.visibilityScore + visibilityBoost)),
          rating: {
            ...s.rating,
            average: newRating
          }
        };
      }
      return s;
    }));

    logAdminAction('ADMIN_RATING_OVERRIDE', 'story', storyId, story.title, `Adjusted by Admin. Reason: ${reason || 'Editorial review curation'}`, prevScore, newScore);
    addToast({ type: 'success', title: 'Story Metrics Updated', message: `Adjusted rating to ${newRating} ★ with boost ${visibilityBoost}.` });
  };

  const setStoryOfTheWeek = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    setStories(prev => prev.map(s => ({
      ...s,
      isStoryOfWeek: s.id === storyId
    })));
    logAdminAction('SET_STORY_OF_WEEK', 'story', storyId, story.title, 'Selected as active Story of the Week on Public Homepage');
    addToast({ type: 'success', title: 'Story of the Week Updated', message: `"${story.title}" is now the Story of the Week.` });
  };

  const setEditorChoice = (storyId: string, isChoice: boolean) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isEditorChoice: isChoice } : s));
    logAdminAction('SET_EDITOR_CHOICE', 'story', storyId, story.title, `${isChoice ? 'Added to' : 'Removed from'} Editor Choice showcase`);
  };

  const verifyAuthor = (authorId: string, isVerified: boolean) => {
    const user = users.find(u => u.id === authorId);
    if (!user) return;
    setUsers(prev => prev.map(u => u.id === authorId ? { ...u, isVerified } : u));
    setStories(prev => prev.map(s => s.authorId === authorId ? { ...s, authorVerified: isVerified } : s));
    logAdminAction('AUTHOR_VERIFICATION', 'user', authorId, user.name, `${isVerified ? 'Awarded Golden Verified Author badge' : 'Revoked Verified status'}`);
    addToast({ type: 'success', title: isVerified ? 'Author Verified' : 'Badge Removed', message: `Verification status updated for ${user.name}.` });
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended' | 'banned', reason?: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    logAdminAction('USER_STATUS_CHANGE', 'user', userId, user.name, `Changed account status to ${status.toUpperCase()}. Reason: ${reason || 'Admin policy review'}`);
    addToast({ type: status === 'active' ? 'success' : 'warning', title: `User ${status.toUpperCase()}`, message: `${user.name} is now ${status}.` });
  };

  const moderateComment = (commentId: string, action: 'pin' | 'highlight' | 'delete', replyText?: string) => {
    if (action === 'delete') {
      setComments(prev => prev.filter(c => c.id !== commentId));
      logAdminAction('DELETE_COMMENT', 'comment', commentId, 'Comment', 'Removed offensive/violating comment');
      addToast({ type: 'info', title: 'Comment Deleted', message: 'Comment permanently removed.' });
    } else if (action === 'pin') {
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, isPinned: !c.isPinned } : c));
      addToast({ type: 'success', title: 'Pinned Status Updated', message: 'Comment pin status modified.' });
    } else if (action === 'highlight') {
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, isHighlighted: !c.isHighlighted } : c));
      addToast({ type: 'success', title: 'Highlight Updated', message: 'Comment highlighted for readers.' });
    }
  };

  const resolveReport = (reportId: string, actionTaken: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'action_taken', details: `${r.details} | Resolution: ${actionTaken}` } : r));
    logAdminAction('REPORT_RESOLVED', 'system', reportId, 'Report', `Resolved report with action: ${actionTaken}`);
    addToast({ type: 'success', title: 'Report Resolved', message: `Report marked resolved.` });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateReadingSettings = (newSettings: Partial<ReadingSettings>) => {
    setReadingSettings(prev => ({ ...prev, ...newSettings }));
  };

  const createChapter = (chapterData: { storyId: string; title: string; content: string; status?: 'draft' | 'published' }) => {
    return saveChapter(chapterData.storyId, chapterData);
  };

  const toggleStoryOfTheWeek = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const nextState = !story.isStoryOfWeek;
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isStoryOfWeek: nextState } : s));
    logAdminAction('TOGGLE_STORY_OF_WEEK', 'story', storyId, story.title, `${nextState ? 'Promoted to' : 'Removed from'} Story of the Week`);
    addToast({ 
      type: 'success', 
      title: nextState ? 'Promoted' : 'Removed', 
      message: nextState ? `"${story.title}" is now Story of the Week.` : `Removed from Story of the Week.` 
    });
  };

  const toggleUserVerification = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const nextVerified = !user.isVerified;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: nextVerified } : u));
    setStories(prev => prev.map(s => s.authorId === userId ? { ...s, authorVerified: nextVerified } : s));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerified: nextVerified } : null);
    }
    logAdminAction('AUTHOR_VERIFICATION', 'user', userId, user.name, `${nextVerified ? 'Awarded Golden Verified Author badge' : 'Revoked Verified status'}`);
    addToast({ type: 'success', title: nextVerified ? 'Author Verified' : 'Badge Removed', message: `Verification status updated for ${user.name}.` });
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
      setCurrentRole(role);
    }
    logAdminAction('USER_ROLE_CHANGE', 'user', userId, user.name, `Changed user role to ${role.toUpperCase()}`);
    addToast({ type: 'success', title: 'Role Updated', message: `${user.name} is now ${role}.` });
  };

  const chapters = Object.values(chaptersMap).flat();

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedStoryId,
        setSelectedStoryId,
        selectedChapterId,
        setSelectedChapterId,
        selectedAuthorId,
        setSelectedAuthorId,
        selectedGenreId,
        setSelectedGenreId,
        searchQuery,
        setSearchQuery,

        currentUser,
        currentRole,
        users,
        switchUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        loginUser,
        registerUser,
        logoutUser,

        stories,
        chapters,
        genres,
        testimonials,
        getStoryById,
        getChaptersForStory,
        getChapterById,

        toggleBookmark,
        isBookmarked,
        toggleLikeStory,
        isStoryLiked,
        toggleFollowAuthor,
        isAuthorFollowed,
        submitRating,
        saveReadingProgress,

        comments,
        addComment,
        toggleLikeComment,
        reportComment,

        createStory,
        updateStory,
        deleteStory,
        saveChapter,
        createChapter,
        deleteChapter,

        approveStory,
        rejectStory,
        toggleFeatureStory,
        togglePinStory,
        toggleHideStory,
        adjustStoryRating,
        setStoryOfTheWeek,
        toggleStoryOfTheWeek,
        setEditorChoice,
        verifyAuthor,
        toggleUserVerification,
        updateUserStatus,
        updateUserRole,
        moderateComment,
        resolveReport,

        notifications,
        markNotificationRead,
        reports,
        adminLogs,

        readingSettings,
        updateReadingSettings,

        logoBranding,
        activeLogoUrl: logoBranding.url,
        uploadLogo,
        deleteLogo,

        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
