
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="empty-state"
    >
      {Icon && (
        <div className="empty-state-icon-wrapper">
          <Icon size={32} />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-desc">
          {description}
        </p>
      )}
      {action && (
        <div className="empty-state-action">{action}</div>
      )}
    </motion.div>
  );
};

export default EmptyState;
