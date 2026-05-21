import React from 'react';
import { Search } from 'lucide-react';

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="search-box">
        <Search size={18} style={{ color: 'var(--dim-text)', marginRight: 12 }} />
        <input type="text" placeholder="Search" />
      </div>
      <div className="trending-box">
        <h2>What's happening</h2>
        <div className="trending-item">
          <div className="trending-category">Trending</div>
          <div className="trending-title">#ReactJS</div>
          <div className="trending-stats">10.5K posts</div>
        </div>
        <div className="trending-item">
          <div className="trending-category">Technology</div>
          <div className="trending-title">Framer Motion</div>
          <div className="trending-stats">5,234 posts</div>
        </div>
        <div className="trending-item">
          <div className="trending-category">UI/UX</div>
          <div className="trending-title">Glassmorphism</div>
          <div className="trending-stats">2,109 posts</div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
