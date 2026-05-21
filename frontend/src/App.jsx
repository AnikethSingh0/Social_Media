import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import AuthModal from './components/AuthModal';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

// Helpers
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

// Separate AppContent so we can use Toast hook
const AppContent = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true); // true = login, false = signup
  const { addToast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, "/");
      addToast('Logged in with Google', 'success');
    }
  }, [addToast]);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) setUserProfile(decoded);
    } else {
      setUserProfile(null);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserProfile(null);
    addToast('Logged out successfully', 'success');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  const openModal = (isLogin) => {
    setAuthModalState(isLogin);
    setShowAuthModal(true);
  };

  if (!token) {
    return (
      <>
        <div className="masterpiece-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <div className="landing-container animate-fade">
          <div className="landing-hero">
             <svg viewBox="0 0 24 24" aria-hidden="true" style={{fill: "var(--text-color)"}}>
              <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
            </svg>
          </div>
          <div className="landing-content">
            <div className="glass-panel">
              <h1 className="animate-slide-up">Happening now</h1>
              <h2 className="animate-slide-up" style={{animationDelay: '0.1s'}}>Join today.</h2>
              
              <div className="auth-buttons-container animate-slide-up" style={{animationDelay: '0.2s'}}>
                <button className="google-btn" onClick={handleGoogleLogin}>
                  <svg viewBox="0 0 48 48" style={{width: 24, height: 24, marginRight: 8}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  Sign up with Google
                </button>
                
                <div className="divider">
                  <div className="line"></div>
                  <span>or</span>
                  <div className="line"></div>
                </div>

                <motion.button 
                  className="btn-primary" 
                  onClick={() => openModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create account
                </motion.button>
                
                <div style={{fontSize: '11px', color: '#a0a0a0', marginTop: '8px', marginBottom: '32px'}}>
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                </div>

                <h3 style={{fontSize: '17px', fontWeight: '700', marginBottom: '16px'}}>Already have an account?</h3>
                <motion.button 
                  className="btn-outline" 
                  onClick={() => openModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign in
                </motion.button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {showAuthModal && (
              <AuthModal 
                initialLoginState={authModalState}
                onClose={() => setShowAuthModal(false)} 
                onSuccess={(newToken, msg) => {
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
      <Feed token={token} userProfile={userProfile} />
      <RightSidebar />
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
