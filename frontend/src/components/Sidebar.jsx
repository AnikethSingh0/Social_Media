import { Home, User, Bell, Mail, Hash, Feather, MoreHorizontal, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const navItems = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Explore', icon: Hash },
  { label: 'Notifications', icon: Bell },
  { label: 'Messages', icon: Mail },
  { label: 'Profile', icon: User },
];

const Sidebar = ({ userProfile, onLogout, onPostClick }) => {
  const displayName = userProfile?.fullName || userProfile?.name || userProfile?.username || 'Namaste user';
  const username = userProfile?.username || 'user';

  return (
    <header className="sidebar">
      <div className="sidebar-inner">
        <motion.div
          className="brand-logo-container"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Namaste home"
        >
          <div className="brand-logo">
            <Sparkles size={24} />
          </div>
          <span className="brand-wordmark">Namaste</span>
        </motion.div>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(({ label, icon: Icon, active }) => (
            <a href="#" className={`nav-item ${active ? 'active' : ''}`} key={label}>
              <Icon size={26} className="nav-icon" />
              <span className="nav-text">{label}</span>
            </a>
          ))}
        </nav>

        <Button className="tweet-btn-lg" fullWidth size="lg" onClick={onPostClick}>
          <span className="tweet-btn-text">Post</span>
          <Feather className="tweet-btn-icon" size={24} />
        </Button>

        {userProfile && (
          <div className="user-profile-menu">
            <button className="user-profile-btn" type="button" onClick={onLogout} aria-label={`Log out ${username}`}>
              <Avatar name={displayName} size="md" />
              <div className="user-info">
                <div className="user-name">{displayName}</div>
                <div className="user-handle">@{username}</div>
              </div>
              <MoreHorizontal size={20} className="more-icon" />
            </button>
            <div className="logout-tooltip">
              Log out @{username}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Sidebar;
