import { useState } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Avatar from './ui/Avatar';
import MediaPreview from './ui/MediaPreview';
import {
  formatRelativeTime,
  getUserDisplay,
  normalizeMediaUrls,
  renderContentWithHashtags,
  isLikedLocally,
  toggleLikeLocally,
  getImageUrl,
} from '../lib/utils';
import { toggleLike } from '../lib/api';

const TweetCard = ({ tweet, currentUserProfile, onOpenComments }) => {
  const [isLiked, setIsLiked] = useState(() => isLikedLocally(tweet._id));
  const [likeCount, setLikeCount] = useState(tweet.likeCount || 0);

  // Support multiple possible backend formats for name/username
  const tweetUser = tweet.user || {};
  const { name, username } = getUserDisplay(tweetUser, { 
    username: tweet.username || tweet.localUsername,
    name: tweet.name || tweet.fullName
  });

  const mediaUrls = normalizeMediaUrls(tweet.mediaUrl);
  const isVerified = ['admin', 'orbit', 'official'].includes(username.toLowerCase());
  
  // Try to find the avatar in multiple possible places
  const isCurrentUser = currentUserProfile && username === currentUserProfile.username;
  const avatarSrc = (isCurrentUser && currentUserProfile.avatar)
    ? getImageUrl(currentUserProfile.avatar) 
    : tweetUser.avatar 
      ? getImageUrl(tweetUser.avatar) 
      : tweet.avatar 
        ? getImageUrl(tweet.avatar) 
        : null;

  const handleLike = async (event) => {
    event.stopPropagation();
    const prevLiked = isLiked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;

    setIsLiked(nextLiked);
    setLikeCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    toggleLikeLocally(tweet._id, nextLiked);

    try {
      const { res, data } = await toggleLike('Tweet', tweet._id);
      if (!res.ok || (data && data.success === false)) {
        setIsLiked(prevLiked);
        setLikeCount(prevCount);
        toggleLikeLocally(tweet._id, prevLiked);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toggleLikeLocally(tweet._id, prevLiked);
    }
  };

  return (
    <motion.article
      className="tweet-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
      onClick={onOpenComments}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpenComments?.();
      }}
      tabIndex={0}
      aria-label={`Open replies for ${name}'s post`}
    >
      <div className="tweet-avatar-col" onClick={(event) => event.stopPropagation()}>
        <Link to={tweetUser._id ? `/profile/${tweetUser._id}` : '/profile'}>
          <Avatar name={name} src={avatarSrc} size="md" />
        </Link>
      </div>

      <div className="tweet-content-col">
        <div className="tweet-header">
          <Link 
            to={tweetUser._id ? `/profile/${tweetUser._id}` : '/profile'} 
            onClick={(event) => event.stopPropagation()} 
            className="tweet-author-info flex items-center gap-1 group"
          >
            <span className="tweet-name group-hover:underline">{name}</span>
            {isVerified && <BadgeCheck size={16} className="verified-badge" />}
            <span className="tweet-username">@{username}</span>
          </Link>
          <div className="tweet-author-info ml-1">
            <span className="tweet-dot">&middot;</span>
            <span className="tweet-time">{formatRelativeTime(tweet.createdAt)}</span>
          </div>
        </div>

        <div className="tweet-text">
          {renderContentWithHashtags(tweet.content)}
        </div>

        {mediaUrls.length > 0 && (
          <div className="tweet-media" onClick={(event) => event.stopPropagation()}>
            <MediaPreview urls={mediaUrls} />
          </div>
        )}

        <div className="tweet-actions" onClick={(event) => event.stopPropagation()}>
          <motion.button
            type="button"
            className="action-group comment-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            onClick={onOpenComments}
            aria-label="Open replies"
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(29, 155, 240, 0.1)' } }}>
              <MessageCircle size={18} />
            </motion.div>
            <span className="action-count">{tweet.commentCount > 0 ? tweet.commentCount : ''}</span>
          </motion.button>

          <motion.button
            type="button"
            className="action-group repost-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            aria-label="Repost"
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(0, 186, 124, 0.1)' } }}>
              <Repeat2 size={18} />
            </motion.div>
          </motion.button>

          <motion.button
            type="button"
            className={`action-group like-group ${isLiked ? 'liked' : ''}`}
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(249, 24, 128, 0.1)' } }}>
              <motion.div
                initial={false}
                animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 15 }}
              >
                <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              </motion.div>
            </motion.div>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={likeCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="action-count"
              >
                {likeCount > 0 ? likeCount : ''}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            className="action-group view-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            aria-label="View post analytics"
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(29, 155, 240, 0.1)' } }}>
              <BarChart2 size={18} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default TweetCard;
