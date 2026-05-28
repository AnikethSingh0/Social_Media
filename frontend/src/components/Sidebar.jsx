import { Home, User, Bell, Mail, Hash, Feather, MoreHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import { getImageUrl } from '../lib/utils';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Explore', icon: Hash, path: '/explore' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Messages', icon: Mail, path: '/messages' },
  { label: 'Profile', icon: User, path: '/profile' },
];

const Sidebar = ({ userProfile, onLogout, onPostClick }) => {
  const displayName = userProfile?.fullName || userProfile?.name || userProfile?.username || 'Orbit user';
  const username = userProfile?.username || 'user';
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sidebar">
      <div className="sidebar-inner">
        <Link to="/">
          <motion.div
            className="brand-logo-container"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Orbit home"
          >
            <div className="brand-logo">
              <Sparkles size={24} />
            </div>
            <span className="brand-wordmark">Orbit</span>
          </motion.div>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path;
            return (
              <Link to={path} className={`nav-item ${active ? 'active' : ''}`} key={label}>
                <Icon size={26} className="nav-icon" />
                <span className="nav-text">{label}</span>
              </Link>
            );
          })}
        </nav>

        <Button className="tweet-btn-lg" fullWidth size="lg" onClick={onPostClick}>
          <span className="tweet-btn-text">Post</span>
          <Feather className="tweet-btn-icon" size={24} />
        </Button>

        {userProfile && (
          <div className="user-profile-menu">
            <button 
              className="user-profile-btn" 
              type="button" 
              onClick={() => setShowDropdown(!showDropdown)} 
              aria-label={`Menu for ${username}`}
            >
              <Avatar name={displayName} src={getImageUrl(userProfile.avatar)} size="md" />
              <div className="user-info">
                <div className="user-name">{displayName}</div>
                <div className="user-handle">@{username}</div>
              </div>
              <MoreHorizontal size={20} className="more-icon" />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-full bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 p-2"
                >
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 text-sm hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <Link 
                    to="/setup" 
                    className="block px-4 py-3 text-sm hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Edit Profile
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-white/5 rounded-lg transition-colors text-red-500"
                  >
                    Log out @{username}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default Sidebar;
