import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      {[...Array(5)].map((_, i) => (
        <motion.div 
          key={i} 
          className="tweet skeleton-tweet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="skeleton-avatar pulsing"></div>
          <div className="skeleton-content">
            <div className="skeleton-header pulsing"></div>
            <div className="skeleton-text pulsing"></div>
            <div className="skeleton-text short pulsing"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
