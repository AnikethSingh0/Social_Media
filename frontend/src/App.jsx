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
import { PiHandsPrayingDuotone } from 'react-icons/pi';
import { getToken, setToken, removeToken } from './lib/api';
import { parseJwt } from './lib/utils';
import Button from './components/ui/Button';

// Separate AppContent so we can use Toast hook
const AppContent = () => {
  const [token, setTokenState] = useState(getToken());
  const userProfile = token ? parseJwt(token) : null;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true);
  const [activeCommentTweet, setActiveCommentTweet] = useState(null);
  const [commentAdjustments, setCommentAdjustments] = useState({});
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

  const handleCommentAdded = (tweetId = activeCommentTweet?._id) => {
    if (!tweetId) return;

    setActiveCommentTweet((prev) => (
      prev && prev._id === tweetId
        ? { ...prev, commentCount: (prev.commentCount || 0) + 1 }
        : prev
    ));
    setCommentAdjustments((current) => ({
      ...current,
      [tweetId]: (current[tweetId] || 0) + 1,
    }));
  };

  const scrollToComposer = () => {
    document.querySelector('.post-composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!token) {
    return (
      <>
        <div className="masterpiece-bg">
          <div className="landing-grid"></div>
        </div>
        <div className="landing-container animate-fade">
          <div className="landing-hero">
            <div className="landing-showcase">
              <div className="showcase-card showcase-card-main">
                <div className="showcase-avatar">
                  <PiHandsPrayingDuotone size={28} />
                </div>
                <div className="showcase-copy">
                  <strong>Namaste</strong>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="showcase-card showcase-card-floating">
                <span className="showcase-pulse"></span>
                Live conversations, refined.
              </div>
            </div>
            <div className="brand-logo-large" aria-hidden="true">
              <PiHandsPrayingDuotone />
            </div>
          </div>
          <div className="landing-content">
            <div className="glass-panel">
              <div className="landing-kicker">Namaste Social</div>
              <h1 className="animate-slide-up">A calmer social room</h1>
              <h2 className="animate-slide-up" style={{animationDelay: '0.1s'}}>Post, reply, and shape your feed.</h2>
              
              <div className="auth-buttons-container animate-slide-up" style={{animationDelay: '0.2s'}}>
                <Button 
                  variant="primary" 
                  fullWidth 
                  size="lg"
                  onClick={() => openModal(false)}
                >
                  Create account
                </Button>
                
                <div className="auth-disclaimer">
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                </div>

                <h3 className="landing-auth-heading">Already have an account?</h3>
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
      <Sidebar userProfile={userProfile} onLogout={handleLogout} onPostClick={scrollToComposer} />
      
      <Feed 
        token={token} 
        userProfile={userProfile} 
        onOpenComments={handleOpenComments} 
        commentAdjustments={commentAdjustments}
      />
      
      <RightSidebar />
      
      <CommentThread 
        tweet={activeCommentTweet}
        isOpen={!!activeCommentTweet}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
        userProfile={userProfile}
      />
      
      <MobileNav onPostClick={scrollToComposer} />
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
