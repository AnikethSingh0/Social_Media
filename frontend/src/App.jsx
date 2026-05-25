import { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import AuthModal from './components/AuthModal';
import CommentThread from './components/CommentThread';
import MobileNav from './components/MobileNav';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
          <motion.div 
            className="glow-orb orb-1"
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="glow-orb orb-2"
            animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="landing-grid"></div>
        </div>
        <div className="landing-container animate-fade">
          <div className="landing-hero">
            <div className="landing-showcase">
              <motion.div 
                className="showcase-card showcase-card-main"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="showcase-avatar">
                  <Sparkles size={28} />
                </div>
                <div className="showcase-copy">
                  <strong>Namaste</strong>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
              <motion.div 
                className="showcase-card showcase-card-floating"
                animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="showcase-pulse"></span>
                Live conversations, refined.
              </motion.div>
            </div>
            <div className="brand-logo-large" aria-hidden="true">
              <Sparkles />
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
