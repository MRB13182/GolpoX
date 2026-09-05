import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  Feather, 
  LogOut, 
  LogIn,
  Shield,
  Bookmark, 
  Menu, 
  X, 
  CheckCircle, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalTab, 
    logoutUser,
    notifications,
    markNotificationRead,
    setSelectedGenreId,
    setSelectedAuthorId,
    setSearchQuery
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = (notifications || []).filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (page: any) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWriteStoryClick = () => {
    if (!currentUser) {
      setAuthModalTab('register');
      setIsAuthModalOpen(true);
    } else {
      navigateTo('author-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo Component */}
          <div className="flex items-center space-x-8">
            <Logo 
              variant="full" 
              size="md" 
              onClick={() => navigateTo('home')} 
              className="cursor-pointer"
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button
                id="nav-home-btn"
                onClick={() => navigateTo('home')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentPage === 'home' 
                    ? 'text-purple-700 bg-purple-100/60 shadow-xs' 
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
                }`}
              >
                Home
              </button>
              <button
                id="nav-stories-btn"
                onClick={() => navigateTo('stories')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentPage === 'stories' 
                    ? 'text-purple-700 bg-purple-100/60 shadow-xs' 
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
                }`}
              >
                Stories
              </button>
              <button
                id="nav-genre-btn"
                onClick={() => { setSelectedGenreId(null); navigateTo('genre'); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentPage === 'genre' 
                    ? 'text-purple-700 bg-purple-100/60 shadow-xs' 
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
                }`}
              >
                Genres
              </button>
              <button
                id="nav-authors-btn"
                onClick={() => navigateTo('authors')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  currentPage === 'authors' 
                    ? 'text-purple-700 bg-purple-100/60 shadow-xs' 
                    : 'text-slate-600 hover:text-purple-700 hover:bg-white/60'
                }`}
              >
                Authors
              </button>
              <button
                id="nav-write-btn"
                onClick={handleWriteStoryClick}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  currentPage === 'author-dashboard' 
                    ? 'text-purple-700 bg-purple-100/80 shadow-xs' 
                    : 'text-purple-700 bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60'
                }`}
              >
                <Feather className="w-4 h-4 text-purple-600" />
                <span>Write a Story</span>
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              id="search-toggle-btn"
              onClick={() => {
                setSearchQuery('');
                navigateTo('stories');
              }}
              aria-label="Search stories"
              className="p-2.5 rounded-2xl text-slate-600 hover:text-purple-700 hover:bg-white/80 transition-all cursor-pointer border border-transparent hover:border-purple-200/50 shadow-xs"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Popover (For authors) */}
            <div className="relative" ref={notifRef}>
              <button
                id="notif-toggle-btn"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Notifications"
                className="p-2.5 rounded-2xl text-slate-600 hover:text-purple-700 hover:bg-white/80 transition-all relative cursor-pointer border border-transparent hover:border-purple-200/50 shadow-xs"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card-warm rounded-3xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-warm flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full">
                      {unreadNotifsCount} new
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/60">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3.5 hover:bg-purple-50/40 transition-colors cursor-pointer flex items-start space-x-3 ${
                            !n.read ? 'bg-purple-50/60' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.createdAt}</span>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1.5"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Header Login / Logout & Account Access */}
            {!currentUser ? (
              <button
                id="header-login-btn"
                onClick={() => {
                  setAuthModalTab('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {/* User Account Access */}
                <div className="relative" ref={profileRef}>
                  <button
                    id="header-account-btn"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white hover:bg-purple-50/80 border border-purple-200 transition-all cursor-pointer shadow-xs"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-purple-400"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 max-w-[100px] truncate leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider leading-none">
                        {currentUser.role === 'admin' ? 'Account' : 'Author'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 glass-card-warm rounded-3xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-warm">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-200"
                          />
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-sm font-bold text-slate-900 truncate flex items-center">
                              {currentUser.name}
                              {currentUser.isVerified && (
                                <CheckCircle className="w-3.5 h-3.5 text-purple-600 ml-1 inline" />
                              )}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                              {currentUser.role === 'admin' ? 'Management' : 'Author Studio'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'admin' ? (
                          <button
                            id="menu-admin-dash"
                            onClick={() => { setIsProfileMenuOpen(false); navigateTo('admin-dashboard'); }}
                            className="w-full px-4 py-2.5 text-left text-xs font-bold text-purple-700 hover:bg-purple-50/80 flex items-center space-x-2.5 cursor-pointer"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span>Control Console</span>
                          </button>
                        ) : (
                          <>
                            <button
                              id="menu-author-dash"
                              onClick={() => { setIsProfileMenuOpen(false); navigateTo('author-dashboard'); }}
                              className="w-full px-4 py-2.5 text-left text-xs font-bold text-purple-700 hover:bg-purple-50/80 flex items-center space-x-2.5 cursor-pointer"
                            >
                              <Feather className="w-4 h-4 text-purple-600" />
                              <span>Author Studio Dashboard</span>
                            </button>

                            <button
                              id="menu-author-profile"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                setSelectedAuthorId(currentUser.id);
                                navigateTo('author-profile');
                              }}
                              className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-purple-50/60 flex items-center space-x-2.5 cursor-pointer"
                            >
                              <UserIcon className="w-4 h-4 text-slate-400" />
                              <span>My Public Profile</span>
                            </button>
                          </>
                        )}

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          id="menu-logout"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logoutUser();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50/80 flex items-center space-x-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout Button (Replaces Login after login) */}
                <button
                  id="header-logout-btn"
                  onClick={logoutUser}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}

            {/* Mobile Drawer Hamburger (Matching Reference Image 1) */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="md:hidden p-2 rounded-2xl text-slate-700 hover:bg-white/80 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Production-Ready Clean Mobile Drawer (Matching Reference Image 1) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-2xl border-b border-purple-100 shadow-2xl z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="max-w-md mx-auto px-6 py-5 space-y-3 text-left">
            
            {/* Mobile Drawer / Sidebar Logo Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-1">
              <Logo
                variant="full"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('home');
                }}
              />
              <span className="text-[10px] font-bold tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-full border border-purple-200/60">
                GolpoX Mobile
              </span>
            </div>

            {/* 1. Home */}
            <button
              id="mobile-nav-home"
              onClick={() => navigateTo('home')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                currentPage === 'home'
                  ? 'text-purple-900 bg-purple-50/80 font-black'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* 2. Stories */}
            <button
              id="mobile-nav-stories"
              onClick={() => navigateTo('stories')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                currentPage === 'stories'
                  ? 'text-purple-900 bg-purple-50/80 font-black'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Stories
            </button>

            {/* 3. Genres */}
            <button
              id="mobile-nav-genres"
              onClick={() => { setSelectedGenreId(null); navigateTo('genre'); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                currentPage === 'genre'
                  ? 'text-purple-900 bg-purple-50/80 font-black'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Genres
            </button>

            {/* 4. Authors */}
            <button
              id="mobile-nav-authors"
              onClick={() => navigateTo('authors')}
              className={`w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all cursor-pointer ${
                currentPage === 'authors'
                  ? 'text-purple-900 bg-purple-50/80 font-black'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              Authors
            </button>

            {/* 5. Write a Story (Highlighted in soft purple pill) */}
            <button
              id="mobile-nav-write-story"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleWriteStoryClick();
              }}
              className="w-full text-left px-4 py-3.5 rounded-2xl text-base font-bold text-purple-700 bg-purple-50/90 border border-purple-200/70 hover:bg-purple-100 flex items-center space-x-2.5 transition-all shadow-xs cursor-pointer"
            >
              <Feather className="w-5 h-5 text-purple-600" />
              <span>Write a Story</span>
            </button>

            {/* Subtle bottom author status info */}
            {currentUser && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
                <div className="flex items-center space-x-2.5">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};
