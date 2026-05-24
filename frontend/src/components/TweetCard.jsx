import { useState } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './ui/Avatar';
import MediaPreview from './ui/MediaPreview';
import { formatRelativeTime, renderContentWithHashtags } from '../lib/utils';

const TweetCard = ({ tweet, onOpenComments }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCountStr, setLikeCountStr] = useState(tweet.likeCount || 0);
  
  const name = tweet.user?.name || tweet.user?.fullName || tweet.localUsername || 'User';
  const username = tweet.user?.username || tweet.localUsername || 'user';
  const isVerified = ['admin', 'pulse', 'official'].includes(username.toLowerCase());
  
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCountStr(prev => isLiked ? prev - 1 : prev + 1);
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
    >
      <div className="tweet-avatar-col">
        <Avatar name={name} size="md" />
      </div>
      
      <div className="tweet-content-col">
        <div className="tweet-header">
          <div className="tweet-author-info">
            <span className="tweet-name">{name}</span>
            {isVerified && <BadgeCheck size={16} className="verified-badge" />}
            <span className="tweet-username">@{username}</span>
            <span className="tweet-dot">·</span>
            <span className="tweet-time">{formatRelativeTime(tweet.createdAt)}</span>
          </div>
        </div>
        
        <div className="tweet-text">
          {renderContentWithHashtags(tweet.content)}
        </div>
        
        {tweet.mediaUrl && (
          <div className="tweet-media">
            <MediaPreview urls={tweet.mediaUrl} />
          </div>
        )}
        
        <div className="tweet-actions" onClick={e => e.stopPropagation()}>
          <motion.button 
            className="action-group comment-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            onClick={onOpenComments}
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}>
              <MessageCircle size={18} />
            </motion.div>
            <span className="action-count">{tweet.commentCount > 0 ? tweet.commentCount : ''}</span>
          </motion.button>
          
          <motion.button 
            className="action-group repost-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(16, 185, 129, 0.1)' } }}>
              <Repeat2 size={18} />
            </motion.div>
          </motion.button>
          
          <motion.button 
            className={`action-group like-group ${isLiked ? 'liked' : ''}`}
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(244, 63, 94, 0.1)' } }}>
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            </motion.div>
            <AnimatePresence mode="popLayout">
              <motion.span 
                key={likeCountStr}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="action-count"
              >
                {likeCountStr > 0 ? likeCountStr : ''}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          
          <motion.button 
            className="action-group view-group"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}>
              <BarChart2 size={18} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default TweetCard;
