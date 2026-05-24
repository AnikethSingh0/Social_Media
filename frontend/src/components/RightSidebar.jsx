
import { Search } from 'lucide-react';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-inner">
        <div className="search-container group">
          <div className="search-box group-focus-within:bg-transparent group-focus-within:border-[var(--primary-color)] transition-all">
            <Search size={18} className="search-icon group-focus-within:text-[var(--primary-color)] transition-colors" />
            <input type="text" placeholder="Search Pulse" />
          </div>
        </div>

        <div className="trending-box">
          <h2>What's happening</h2>
          <div className="trending-item">
            <div className="trending-category">Technology · Trending</div>
            <div className="trending-title">#React19</div>
            <div className="trending-stats">15.5K posts</div>
          </div>
          <div className="trending-item">
            <div className="trending-category">Web Development</div>
            <div className="trending-title">Framer Motion</div>
            <div className="trending-stats">8,234 posts</div>
          </div>
          <div className="trending-item">
            <div className="trending-category">Design UI/UX</div>
            <div className="trending-title">Dark Mode</div>
            <div className="trending-stats">4,109 posts</div>
          </div>
          <a href="#" className="show-more">Show more</a>
        </div>

        <div className="trending-box who-to-follow">
          <h2>Who to follow</h2>
          {[
            { name: 'React', handle: 'reactjs' },
            { name: 'Vite', handle: 'vitejs' },
            { name: 'Tailwind CSS', handle: 'tailwindcss' }
          ].map((user, i) => (
            <div key={i} className="follow-item flex items-center justify-between p-3 hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
              <div className="flex items-center gap-3 truncate">
                <Avatar name={user.name} size="md" />
                <div className="flex flex-col truncate">
                  <span className="font-bold text-[15px] truncate hover:underline">{user.name}</span>
                  <span className="text-[var(--dim-text)] text-[15px] truncate">@{user.handle}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="ml-2 bg-white text-black hover:bg-gray-200">Follow</Button>
            </div>
          ))}
          <a href="#" className="show-more p-4 block">Show more</a>
        </div>

        <footer className="sidebar-footer">
          <nav>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
            <a href="#">Ads info</a>
            <a href="#">More ···</a>
          </nav>
          <p>© 2026 Pulse Corp.</p>
        </footer>
      </div>
    </aside>
  );
};

export default RightSidebar;
