
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const classes = `btn btn-${size} btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`.trim();

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      {...props}
    >
      {isLoading && (
        <Loader2 size={16} className="btn-spinner" />
      )}
      <span className={isLoading ? 'btn-text-loading' : ''}>
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
