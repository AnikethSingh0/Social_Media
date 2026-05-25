import { useState } from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './ui/Avatar';
import MediaPreview from './ui/MediaPreview';
import {
  formatRelativeTime,
  getUserDisplay,
  normalizeMediaUrls,
  renderContentWithHashtags,
} from '../lib/utils';

const TweetCard = ({ tweet, onOpenComments }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(tweet.likeCount || 0);

  const { name, username } = getUserDisplay(tweet.user, { username: tweet.localUsername });
  const mediaUrls = normalizeMediaUrls(tweet.mediaUrl);
  const isVerified = ['admin', 'namaste', 'official'].includes(username.toLowerCase());

  const handleLike = (event) => {
    event.stopPropagation();
    setIsLiked((current) => !current);
    setLikeCount((current) => Math.max(0, isLiked ? current - 1 : current + 1));
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
      <div className="tweet-avatar-col">
        <Avatar name={name} size="md" />
      </div>

      <div className="tweet-content-col">
        <div className="tweet-header">
          <div className="tweet-author-info">
            <span className="tweet-name">{name}</span>
            {isVerified && <BadgeCheck size={16} className="verified-badge" />}
            <span className="tweet-username">@{username}</span>
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
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(125, 92, 255, 0.14)' } }}>
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
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(34, 197, 94, 0.14)' } }}>
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
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(244, 63, 94, 0.14)' } }}>
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
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
            <motion.div className="action-icon-wrapper" variants={{ hover: { backgroundColor: 'rgba(14, 165, 233, 0.14)' } }}>
              <BarChart2 size={18} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default TweetCard;
