import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';

const Layout = ({ userProfile, onLogout, scrollToComposer }) => {
  const location = useLocation();
  const isMessagesRoute = location.pathname.startsWith('/messages');

  return (
    <div className={`app-container animate-fade ${isMessagesRoute ? 'app-container-messages' : ''}`}>
      <Sidebar userProfile={userProfile} onLogout={onLogout} onPostClick={scrollToComposer} />
      
      <Outlet />
      
      {!isMessagesRoute && <RightSidebar />}
      
      <MobileNav onPostClick={scrollToComposer} userProfile={userProfile} />
    </div>
  );
};

export default Layout;
