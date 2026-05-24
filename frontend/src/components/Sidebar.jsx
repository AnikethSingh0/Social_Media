
import { Home, User, Bell, Mail, Hash, Feather, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const Sidebar = ({ userProfile, onLogout }) => {
  return (
    <header className="sidebar">
      <div className="sidebar-inner">
        <motion.div 
          className="brand-logo-container"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="brand-logo w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </motion.div>
        
        <nav className="nav-links">
          <a href="#" className="nav-item active">
            <Home size={26} className="nav-icon" /> 
            <span className="nav-text">Home</span>
          </a>
          <a href="#" className="nav-item">
            <Hash size={26} className="nav-icon" /> 
            <span className="nav-text">Explore</span>
          </a>
          <a href="#" className="nav-item">
            <Bell size={26} className="nav-icon" /> 
            <span className="nav-text">Notifications</span>
          </a>
          <a href="#" className="nav-item">
            <Mail size={26} className="nav-icon" /> 
            <span className="nav-text">Messages</span>
          </a>
          <a href="#" className="nav-item">
            <User size={26} className="nav-icon" /> 
            <span className="nav-text">Profile</span>
          </a>
        </nav>
        
        <Button className="tweet-btn-lg" fullWidth size="lg">
          <span className="tweet-btn-text">Post</span>
          <Feather className="tweet-btn-icon hidden" size={24} />
        </Button>

        {userProfile && (
          <div className="user-profile-menu group">
            <button className="user-profile-btn" onClick={onLogout}>
              <Avatar name={userProfile.fullName || userProfile.name || userProfile.username} size="md" />
              <div className="user-info">
                <div className="name font-bold text-[15px] leading-tight truncate">{userProfile.fullName || userProfile.name || userProfile.username}</div>
                <div className="handle text-[var(--dim-text)] text-[15px] truncate">@{userProfile.username}</div>
              </div>
              <MoreHorizontal size={20} className="more-icon ml-auto text-[var(--dim-text)]" />
            </button>
            {/* Simple tooltip indicating logout action */}
            <div className="logout-tooltip absolute bottom-full left-0 mb-2 w-full bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
              <div className="p-3 hover:bg-[var(--hover-bg)] rounded-lg cursor-pointer text-center font-bold text-[var(--error-color)]" onClick={onLogout}>
                Log out @{userProfile.username}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Sidebar;
