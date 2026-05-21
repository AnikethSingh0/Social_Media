import React from 'react';
import { MessageCircle, Repeat2, Heart, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const renderTweetContent = (text) => {
  if (!text) return null;
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#') && part.length > 1) {
      return <span key={i} className="hashtag">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const TweetCard = ({ tweet }) => {
  const name = tweet.user?.name || tweet.localUsername || 'User';
  const username = tweet.user?.username || tweet.localUsername || 'user';
  
  return (
    <motion.div 
      className="tweet"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="avatar"></div>
      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-name">{name}</span>
          <span className="tweet-username">@{username}</span>
          <span className="tweet-time">· just now</span>
        </div>
        <div className="tweet-text">{renderTweetContent(tweet.content)}</div>
        <div className="tweet-actions">
          <motion.div whileHover={{ color: '#1d9bf0', backgroundColor: 'rgba(29, 155, 240, 0.1)' }} className="action-btn">
            <MessageCircle size={18} />
          </motion.div>
          <motion.div whileHover={{ color: '#00ba7c', backgroundColor: 'rgba(0, 186, 124, 0.1)' }} className="action-btn">
            <Repeat2 size={18} />
          </motion.div>
          <motion.div whileHover={{ color: '#f91880', backgroundColor: 'rgba(249, 24, 128, 0.1)' }} className="action-btn">
            <Heart size={18} />
          </motion.div>
          <motion.div whileHover={{ color: '#1d9bf0', backgroundColor: 'rgba(29, 155, 240, 0.1)' }} className="action-btn">
            <BarChart2 size={18} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TweetCard;
