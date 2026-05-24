
import { getInitials } from '../../lib/utils';
import { motion } from 'framer-motion';

const Avatar = ({ src, name, size = 'md', className = '', onClick }) => {
  const sizeMap = {
    sm: '32px',
    md: '40px',
    lg: '48px',
  };

  const dimensions = sizeMap[size] || sizeMap.md;
  
  const initials = getInitials(name);
  
  // Deterministic color based on name
  const getGradient = (text) => {
    if (!text) return 'linear-gradient(135deg, #374151, #1f2937)';
    const colors = [
      ['#6366f1', '#8b5cf6'], // Indigo to Violet
      ['#ec4899', '#f43f5e'], // Pink to Rose
      ['#10b981', '#3b82f6'], // Emerald to Blue
      ['#f59e0b', '#ef4444'], // Amber to Red
      ['#8b5cf6', '#d946ef'], // Violet to Fuchsia
    ];
    let sum = 0;
    for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
    const [c1, c2] = colors[sum % colors.length];
    return `linear-gradient(135deg, ${c1}, ${c2})`;
  };

  const Container = onClick ? motion.button : 'div';
  const containerProps = onClick ? { 
    whileHover: { scale: 1.05 }, 
    whileTap: { scale: 0.95 },
    onClick 
  } : {};

  return (
    <Container
      className={`avatar-wrapper ${className}`}
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: src ? 'transparent' : getGradient(name),
        border: '2px solid var(--bg-color)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '15px',
        userSelect: 'none',
        ...containerProps.style
      }}
      {...containerProps}
    >
      {src ? (
        <img 
          src={src} 
          alt={name || 'Avatar'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.style.background = getGradient(name);
            e.target.parentElement.innerText = initials;
          }}
        />
      ) : (
        initials
      )}
    </Container>
  );
};

export default Avatar;
