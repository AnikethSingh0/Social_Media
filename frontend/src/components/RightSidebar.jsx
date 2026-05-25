import { Search } from 'lucide-react';
import { PiFlowerLotusDuotone } from 'react-icons/pi';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const trends = [
  { category: 'Design - Trending', title: '#BlackInterface', stats: '12.8K posts' },
  { category: 'Frontend studios', title: 'Motion craft', stats: '8,234 posts' },
  { category: 'Social UX', title: 'Readable timelines', stats: '4,109 posts' },
];

const suggestions = [
  { name: 'Linear', handle: 'linear' },
  { name: 'Vercel', handle: 'vercel' },
  { name: 'Cloudinary', handle: 'cloudinary' },
];

const RightSidebar = () => {
  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-inner">
        <div className="search-container">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search Namaste" aria-label="Search Namaste" />
          </div>
        </div>



        <section className="insight-card">
          <div className="insight-icon">
            <PiFlowerLotusDuotone size={20} />
          </div>
          <div>
            <p className="insight-kicker">Namaste mode</p>
            <h2>Black, quiet, readable, and built around conversation.</h2>
          </div>
        </section>

        <section className="trending-box">
          <h2>What's happening</h2>
          {trends.map((trend) => (
            <a href="#" className="trending-item" key={trend.title}>
              <div className="trending-category">{trend.category}</div>
              <div className="trending-title">{trend.title}</div>
              <div className="trending-stats">{trend.stats}</div>
            </a>
          ))}
          <a href="#" className="show-more">Show more</a>
        </section>

        <section className="trending-box who-to-follow">
          <h2>Who to follow</h2>
          {suggestions.map((user) => (
            <div key={user.handle} className="follow-item">
              <div className="follow-user">
                <Avatar name={user.name} size="md" />
                <div className="follow-copy">
                  <span>{user.name}</span>
                  <p>@{user.handle}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="follow-btn">Follow</Button>
            </div>
          ))}
          <a href="#" className="show-more">Show more</a>
        </section>

        <footer className="sidebar-footer">
          <nav aria-label="Footer links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
            <a href="#">Accessibility</a>
            <a href="#">More</a>
          </nav>
          <p>&copy; 2026 Namaste.</p>
        </footer>
      </div>
    </aside>
  );
};

export default RightSidebar;
