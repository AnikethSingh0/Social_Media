import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { fetchProfile } from '../lib/api';

const tabs = ['Posts', 'Replies', 'Media', 'Likes'];

// Helper to normalize backend paths for images
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Assuming backend runs on 3000 and serves uploads statically, or use VITE_API_BASE_URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const Profile = ({ userProfile: jwtProfile }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Posts');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      const targetId = userId || jwtProfile?.id;
      if (!targetId) {
        setLoading(false);
        return;
      }
      
      try {
        const { res, data } = await fetchProfile(targetId);
        if (isMounted && res.ok && data.status === 'success') {
          setProfileData(data.data);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => { isMounted = false; };
  }, [jwtProfile]);

  if (loading) {
    return (
      <div className="feed overflow-y-auto h-screen custom-scrollbar pb-20">
        <div className="p-4">
          <LoadingSkeleton count={2} />
        </div>
      </div>
    );
  }

  // Fallback to jwtProfile if fetch fails, but only if it's our own profile
  const isOwnProfile = !userId || userId === jwtProfile?.id;
  const displayProfile = profileData || (isOwnProfile ? (jwtProfile || {}) : {});
  
  const username = displayProfile.username || 'user';
  const fullName = displayProfile.fullName || displayProfile.name || username;
  const bio = displayProfile.bio || 'This is your bio. Add more details in setup.';
  const location = displayProfile.location || 'Earth';
  const joinedDate = displayProfile.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'May 2026';
  
  const avatarUrl = getImageUrl(displayProfile.avatar);
  const bannerUrl = getImageUrl(displayProfile.banner);

  const stats = {
    following: displayProfile.followingCount || 0,
    followers: displayProfile.followersCount || 0
  };

  return (
    <div className="feed overflow-y-auto h-screen custom-scrollbar pb-20 relative">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center gap-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold">{fullName}</h2>
          <p className="text-xs text-gray-500">Profile</p>
        </div>
      </div>

      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-r from-purple-900 to-indigo-900 overflow-hidden relative">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          )}
        </div>
        
        <div className="px-4 relative pb-4 border-b border-white/10">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="rounded-full border-4 border-black bg-black p-1 relative z-20">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-28 h-28 rounded-full object-cover" />
              ) : (
                <Avatar name={fullName} size="lg" className="w-28 h-28 text-3xl" />
              )}
            </div>
            
            <div className="mt-20">
              {isOwnProfile ? (
                <Button 
                  variant="outline" 
                  className="rounded-full font-bold px-4 py-2"
                  onClick={() => navigate('/setup')}
                >
                  Edit profile
                </Button>
              ) : (
                <Button 
                  className="rounded-full font-bold px-6 py-2 bg-white text-black hover:bg-gray-200"
                >
                  Follow
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-black">{fullName}</h1>
            <p className="text-gray-500 text-sm">@{username}</p>
          </div>
          
          <div className="mt-4 text-[15px]">
            <p>{bio}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon size={16} />
              <a href="#" className="text-[#1da1f2] hover:underline">orbit.com/{username}</a>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Joined {joinedDate}</span>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4 text-sm">
            <a href="#" className="hover:underline">
              <span className="font-bold text-white">{stats.following}</span> <span className="text-gray-500">Following</span>
            </a>
            <a href="#" className="hover:underline">
              <span className="font-bold text-white">{stats.followers}</span> <span className="text-gray-500">Followers</span>
            </a>
          </div>
        </div>

        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 font-bold py-4 text-center hover:bg-white/5 transition-colors relative"
            >
              <span className={activeTab === tab ? 'text-white' : 'text-gray-500'}>{tab}</span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#14b8a6] rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
        
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4 text-4xl">🚀</div>
          <h3 className="text-xl font-bold text-white mb-2">No {activeTab.toLowerCase()} yet</h3>
          <p>When you have {activeTab.toLowerCase()}, they will show up here.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
