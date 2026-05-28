import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';

const Layout = ({ userProfile, onLogout, scrollToComposer }) => {
  return (
    <div className="app-container animate-fade">
      <Sidebar userProfile={userProfile} onLogout={onLogout} onPostClick={scrollToComposer} />
      
      <Outlet />
      
      <RightSidebar />
      
      <MobileNav onPostClick={scrollToComposer} userProfile={userProfile} />
    </div>
  );
};

export default Layout;
