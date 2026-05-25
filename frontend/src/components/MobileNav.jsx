
import { Home, Search, Feather, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = ({ onPostClick }) => {
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
        <a href="#" className="mobile-nav-item active" aria-label="Home">
          <Home size={24} />
        </a>
        <a href="#" className="mobile-nav-item" aria-label="Search">
          <Search size={24} />
        </a>
        <a href="#" className="mobile-nav-item" aria-label="Notifications">
          <Bell size={24} />
        </a>
        <a href="#" className="mobile-nav-item" aria-label="Profile">
          <User size={24} />
        </a>
      </nav>
    </>
  );
};

export default MobileNav;
