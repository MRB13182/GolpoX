import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { SearchExploreView } from './components/search/SearchExploreView';
import { StoryDetailView } from './components/story/StoryDetailView';
import { ReadingExperience } from './components/reader/ReadingExperience';
import { AuthorDashboard } from './components/author/AuthorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthorProfileView } from './components/author/AuthorProfileView';
import { GenresCatalogView } from './components/home/GenresCatalogView';
import { AuthorsCatalogView } from './components/home/AuthorsCatalogView';
import { UserLibraryView } from './components/user/UserLibraryView';
import { AuthModal } from './components/auth/AuthModal';
import { CheckCircle2, AlertTriangle, Info, X, Lock } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    toasts, 
    removeToast,
    setIsAuthModalOpen,
    setAuthModalTab
  } = useApp();

  const isReaderMode = currentPage === 'reader-mode';
  const isAdminView = currentPage === 'admin-dashboard';

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'stories':
        return <SearchExploreView />;
      case 'story-detail':
        return <StoryDetailView />;
      case 'reader-mode':
        return <ReadingExperience />;
      case 'author-dashboard':
        return <AuthorDashboard />;
      case 'admin-dashboard':
        if (currentUser?.role !== 'admin') {
          return (
            <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
              <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Restricted Access</h2>
                <p className="text-xs text-slate-500">
                  This page requires authorized authentication. Please sign in with an eligible account.
                </p>
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Sign In
                </button>
              </div>
            </div>
          );
        }
        return <AdminDashboard />;
      case 'author-profile':
        return <AuthorProfileView />;
      case 'genre':
        return <GenresCatalogView />;
      case 'authors':
        return <AuthorsCatalogView />;
      case 'library':
        return <UserLibraryView />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 font-sans selection:bg-purple-600 selection:text-white">
      {/* Global Toast Notifications Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/50'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-100 border-amber-700/50'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-700/50'
                : 'bg-slate-900/90 text-slate-100 border-slate-700/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              <p className="text-[11px] opacity-80 mt-0.5">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Primary Navigation Bar (hidden in full reading immersion mode) */}
      {!isReaderMode && <Navbar />}

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Public Footer (hidden in reader mode & admin dashboard) */}
      {!isReaderMode && !isAdminView && <Footer />}

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
