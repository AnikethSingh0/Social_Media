import { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import AuthModal from './components/AuthModal';
import CommentThread from './components/CommentThread';
import MobileNav from './components/MobileNav';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { AnimatePresence } from 'framer-motion';
import { getToken, setToken, removeToken } from './lib/api';
import { parseJwt } from './lib/utils';
import Button from './components/ui/Button';

// Separate AppContent so we can use Toast hook
const AppContent = () => {
  const [token, setTokenState] = useState(getToken());
  const userProfile = token ? parseJwt(token) : null;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true); // true = login, false = signup
  
  // Comment drawer state
  const [activeCommentTweet, setActiveCommentTweet] = useState(null);
  
  const { addToast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTokenState(urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, "/");
      addToast('Logged in with Google', 'success');
    }
  }, [addToast]);

  const handleLogout = () => {
    removeToken();
    setTokenState(null);
    addToast('Logged out successfully', 'success');
  };

  const openModal = (isLogin) => {
    setAuthModalState(isLogin);
    setShowAuthModal(true);
  };

  const handleOpenComments = (tweet) => {
    setActiveCommentTweet(tweet);
  };

  const handleCloseComments = () => {
    setActiveCommentTweet(null);
  };

  // We need a way to optimistically update the feed when a comment is added
  // A simple way is to pass a callback that just forces a re-render or updates that specific tweet
  // For simplicity, we just rely on the comment drawer adding the comment. The feed tweet 
  // might not update its counter until refresh, but that's a common tradeoff without global state.
  // We can increment locally:
  const handleCommentAdded = () => {
    if (activeCommentTweet) {
      setActiveCommentTweet(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null);
    }
  };

  if (!token) {
    return (
      <>
        <div className="masterpiece-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <div className="landing-container animate-fade">
          <div className="landing-hero">
             <div className="brand-logo-large">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
             </div>
          </div>
          <div className="landing-content">
            <div className="glass-panel">
              <h1 className="animate-slide-up">Happening now</h1>
              <h2 className="animate-slide-up" style={{animationDelay: '0.1s'}}>Join Pulse today.</h2>
              
              <div className="auth-buttons-container animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg"
                  onClick={() => openModal(false)}
                >
                  Create account
                </Button>
                
                <div className="text-[11px] text-[var(--dim-text)] mt-2 mb-8">
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                </div>

                <h3 className="text-[17px] font-bold mb-4">Already have an account?</h3>
                <Button 
                  variant="outline" 
                  fullWidth 
                  size="lg"
                  onClick={() => openModal(true)}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal 
                initialLoginState={authModalState}
                onClose={() => setShowAuthModal(false)} 
                onSuccess={(newToken, msg) => {
                  setTokenState(newToken);
                  setToken(newToken);
                  setShowAuthModal(false);
                  addToast(msg || 'Authentication successful', 'success');
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </>
    );
  }

  return (
    <div className="app-container animate-fade">
      <Sidebar userProfile={userProfile} onLogout={handleLogout} />
      
      <Feed 
        token={token} 
        userProfile={userProfile} 
        onOpenComments={handleOpenComments} 
      />
      
      <RightSidebar />
      
      <CommentThread 
        tweet={activeCommentTweet}
        isOpen={!!activeCommentTweet}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
      />
      
      <MobileNav onPostClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
