
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="skeleton-list">
      {[...Array(count)].map((_, i) => (
        <motion.div 
          key={i} 
          className="skeleton-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="skeleton-avatar shimmer"></div>
          <div className="skeleton-content">
            <div className="skeleton-header-line shimmer"></div>
            <div className="skeleton-text-line shimmer"></div>
            <div className="skeleton-text-line short shimmer"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
