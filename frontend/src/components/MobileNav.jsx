
import { Home, Search, Feather, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = ({ onPostClick }) => {
  return (
    <>
      {/* Floating Action Button (Mobile Post) */}
      <motion.button 
        className="mobile-fab"
        onClick={onPostClick}
        whileTap={{ scale: 0.9 }}
      >
        <Feather size={24} />
      </motion.button>

      {/* Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <a href="#" className="nav-item active">
          <Home size={24} />
        </a>
        <a href="#" className="nav-item">
          <Search size={24} />
        </a>
        <a href="#" className="nav-item">
          <Bell size={24} />
        </a>
        <a href="#" className="nav-item">
          <User size={24} />
        </a>
      </nav>
    </>
  );
};

export default MobileNav;
