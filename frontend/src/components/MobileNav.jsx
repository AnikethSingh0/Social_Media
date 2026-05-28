import { Home, Search, Feather, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

import { getImageUrl } from '../lib/utils';
import Avatar from './ui/Avatar';

const MobileNav = ({ onPostClick, userProfile }) => {
  const location = useLocation();

  return (
    <>
      <motion.button 
        className="mobile-fab"
        type="button"
        onClick={onPostClick}
        whileTap={{ scale: 0.9 }}
        aria-label="Create post"
      >
        <Feather size={24} />
      </motion.button>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`} aria-label="Home">
          <Home size={24} />
        </Link>
        <Link to="/explore" className={`mobile-nav-item ${location.pathname === '/explore' ? 'active' : ''}`} aria-label="Search">
          <Search size={24} />
        </Link>
        <Link to="/notifications" className={`mobile-nav-item ${location.pathname === '/notifications' ? 'active' : ''}`} aria-label="Notifications">
          <Bell size={24} />
        </Link>
        <Link to="/profile" className={`mobile-nav-item ${location.pathname === '/profile' ? 'active' : ''}`} aria-label="Profile">
          {userProfile?.avatar ? (
            <Avatar size="sm" src={getImageUrl(userProfile.avatar)} name={userProfile.name || userProfile.username} />
          ) : (
            <User size={24} />
          )}
        </Link>
      </nav>
    </>
  );
};

export default MobileNav;
