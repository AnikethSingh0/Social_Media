import React from 'react';
import { Home, User, Feather } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ userProfile, onLogout }) => {
  return (
    <header className="sidebar">
      <motion.div 
        className="sidebar-logo"
        whileHover={{ backgroundColor: "var(--hover-bg)" }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{fill: "var(--text-color)", width: 30, height: 30}}>
          <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
        </svg>
      </motion.div>
      
      <nav className="nav-links">
        <a href="#" className="nav-item">
          <Home size={26} /> <span>Home</span>
        </a>
        <a href="#" className="nav-item">
          <User size={26} /> <span>Profile</span>
        </a>
      </nav>
      
      <motion.button 
        className="tweet-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="tweet-btn-text">Post</span>
        <Feather className="tweet-btn-icon" size={24} />
      </motion.button>

      {userProfile && (
        <button className="logout-btn" onClick={onLogout}>
          <div className="avatar"></div>
          <div className="user-info">
            <div className="name">{userProfile.fullName || userProfile.username}</div>
            <div className="handle">@{userProfile.username}</div>
          </div>
        </button>
      )}
    </header>
  );
};

export default Sidebar;
