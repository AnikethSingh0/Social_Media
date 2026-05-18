import React, { useState, useEffect } from 'react';
import './index.css';

// SVG Icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z"></path></g></svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24"><g><path d="M12 11.816c1.355 0 2.872-.15 3.84-1.256.814-.93 1.078-2.368.805-4.392-.38-2.825-2.116-4.513-4.645-4.513-2.53 0-4.266 1.688-4.645 4.513-.273 2.024-.01 3.462.805 4.392.968 1.106 2.485 1.256 3.84 1.256zM8.84 6.368c.162-1.2.787-3.212 3.16-3.212s2.998 2.013 3.16 3.212c.207 1.55.057 2.627-.45 3.205-.455.52-1.266.743-2.71.743s-2.255-.223-2.71-.743c-.507-.578-.657-1.656-.45-3.205zm11.44 12.868c-.877-3.526-4.282-5.99-8.28-5.99s-7.403 2.464-8.28 5.99c-.172.692-.028 1.4.395 1.94.408.52 1.04.82 1.733.82h12.304c.693 0 1.325-.3 1.733-.82.424-.54.567-1.247.394-1.94zm-1.576 1.016c-.126.16-.316.246-.552.246H5.848c-.235 0-.426-.085-.552-.246-.137-.174-.18-.412-.12-.654.71-2.855 3.517-4.85 6.824-4.85s6.114 1.994 6.824 4.85c.06.242.017.48-.12.654z"></path></g></svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
);

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

const renderTweetContent = (text) => {
  if (!text) return null;
  // Regex to split by spaces or hashtags
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#') && part.length > 1) {
      return <span key={i} className="hashtag">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};


// Auth Modal Component
const AuthModal = ({ onClose, onSuccess, initialLoginState = true }) => {
  const [isLogin, setIsLogin] = useState(initialLoginState);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'http://localhost:3000/api/v1/auth/login' : 'http://localhost:3000/api/v1/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.data);
          onSuccess(data.data);
        } else {
          setIsLogin(true);
          setError('Signup successful! Please login.');
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24"><g><path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>
        </button>
        <div className="modal-logo"><TwitterIcon /></div>
        <h1>{isLogin ? 'Sign in to X' : 'Join X today'}</h1>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          <svg viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign {isLogin ? 'in' : 'up'} with Google
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ margin: '0 10px', color: 'var(--dim-text)' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <input type="text" name="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} required />
                <label>Full Name</label>
              </div>
              <div className="input-group">
                <input type="text" name="username" placeholder=" " value={formData.username} onChange={handleChange} required />
                <label>Username</label>
              </div>
            </>
          )}
          <div className="input-group">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <div className="toggle-auth" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </div>
      </div>
    </div>
  );
};


// Main App
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true); // true = login, false = signup
  const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Check URL for Google OAuth token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem('token', urlToken);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // Parse JWT whenever token changes
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
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  const openModal = (isLogin) => {
    setAuthModalState(isLogin);
    setShowAuthModal(true);
  };

  const handlePostTweet = async () => {
    if (!token) return;
    setIsPosting(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: tweetContent })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        // Add local user data to the tweet object for instant rendering
        const newTweet = {
          ...data.data,
          localUsername: userProfile?.username || 'user',
        };
        setTweets([newTweet, ...tweets]);
        setTweetContent('');
      } else {
        alert(data.message || 'Failed to post tweet');
      }
    } catch (err) {
      alert('Error posting tweet');
    } finally {
      setIsPosting(false);
    }
  };

  // -------------------------
  // LANDING PAGE RENDER
  // -------------------------
  if (!token) {
    return (
      <>
        <div className="masterpiece-bg">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        <div className="landing-container animate-fade">
          <div className="landing-hero">
            <TwitterIcon />
          </div>
          <div className="landing-content">
            <div className="glass-panel">
              <h1 className="animate-slide-up">Happening now</h1>
              <h2 className="animate-slide-up" style={{animationDelay: '0.1s'}}>Join today.</h2>
              
              <div className="auth-buttons-container animate-slide-up" style={{animationDelay: '0.2s'}}>
                <button className="google-btn" onClick={handleGoogleLogin} style={{padding: '12px', fontSize: '15px'}}>
                  <svg viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                  Sign up with Google
                </button>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                  <span style={{ margin: '0 10px', color: '#a0a0a0', fontSize: '13px' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                <button className="btn-primary" onClick={() => openModal(false)}>
                  Create account
                </button>
                
                <div style={{fontSize: '11px', color: '#a0a0a0', marginTop: '8px', marginBottom: '32px'}}>
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                </div>

                <h3 style={{fontSize: '17px', fontWeight: '700', marginBottom: '16px'}}>Already have an account?</h3>
                <button className="btn-outline" onClick={() => openModal(true)}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
          
          {showAuthModal && (
            <AuthModal 
              initialLoginState={authModalState}
              onClose={() => setShowAuthModal(false)} 
              onSuccess={(newToken) => {
                setToken(newToken);
                setShowAuthModal(false);
              }}
            />
          )}
        </div>
      </>
    );
  }

  // -------------------------
  // MAIN TWITTER APP RENDER
  // -------------------------
  return (
    <div className="app-container animate-fade">
      {/* Sidebar */}
      <header className="sidebar">
        <div className="sidebar-logo"><TwitterIcon /></div>
        <nav className="nav-links">
          <a href="#" className="nav-item">
            <HomeIcon /> <span>Home</span>
          </a>
          <a href="#" className="nav-item">
            <ProfileIcon /> <span>Profile</span>
          </a>
        </nav>
        
        <button className="tweet-btn">Post</button>

        <button className="logout-btn" onClick={handleLogout}>
          <div className="avatar"></div>
          <div className="user-info">
            <div className="name">{userProfile?.username || 'User'}</div>
            <div className="handle">@{userProfile?.username || 'user'}</div>
          </div>
        </button>
      </header>

      {/* Main Feed */}
      <main className="feed">
        <div className="feed-header">
          <h2>Home</h2>
        </div>

        <div className="tweet-input-container">
          <div className="avatar"></div>
          <div className="input-area">
            <textarea 
              placeholder="What is happening?!" 
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            ></textarea>
            <div className="input-actions">
              <div style={{color: 'var(--primary-color)'}}>
                <svg viewBox="0 0 24 24" style={{width: 20, fill: 'currentColor'}}><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g></svg>
              </div>
              <button 
                className="post-btn" 
                disabled={!tweetContent.trim() || isPosting}
                onClick={handlePostTweet}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="tweets-list">
          {tweets.map((tweet, idx) => (
            <div className="tweet animate-slide-up" key={tweet._id || idx}>
              <div className="avatar"></div>
              <div className="tweet-content">
                <div className="tweet-header">
                  <span className="tweet-name">{tweet.localUsername || 'User'}</span>
                  <span className="tweet-username">@{tweet.localUsername || 'user'}</span>
                  <span className="tweet-time">· just now</span>
                </div>
                <div className="tweet-text">{renderTweetContent(tweet.content)}</div>
                <div className="tweet-actions">
                  <div>💬</div>
                  <div>🔁</div>
                  <div>❤️</div>
                  <div>📊</div>
                </div>
              </div>
            </div>
          ))}
          {tweets.length === 0 && (
            <div style={{padding: '32px', textAlign: 'center', color: 'var(--dim-text)'}}>
              No tweets yet. Post something with #hashtags!
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        <div className="search-box">
          <SearchIcon style={{width: 18, height: 18, fill: 'var(--dim-text)', marginRight: 12}} />
          <input type="text" placeholder="Search" />
        </div>
        <div style={{backgroundColor: '#16181c', borderRadius: 16, padding: '16px 0'}}>
          <h2 style={{padding: '0 16px', fontSize: 20, marginBottom: 16, fontWeight: 800}}>What's happening</h2>
          <div className="tweet" style={{border: 'none', padding: '12px 16px'}}>
            <div className="tweet-content">
              <div className="tweet-username" style={{fontSize: 13}}>Trending</div>
              <div className="tweet-name" style={{fontSize: 15, marginTop: 2}}>#ReactJS</div>
              <div className="tweet-username" style={{fontSize: 13, marginTop: 2}}>10.5K posts</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default App;
