import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MediaPreview = ({ urls, removable = false, onRemove }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!urls || urls.length === 0) return null;
  
  // Convert single URL to array
  const mediaUrls = Array.isArray(urls) ? urls : [urls];
  const isSingle = mediaUrls.length === 1;

  return (
    <div className="media-preview-container">
      <div className={`media-grid ${isSingle ? 'single' : 'multiple'}`}>
        {mediaUrls.map((url, idx) => (
          <div key={idx} className="media-item-wrapper">
            <img 
              src={url} 
              alt="Media content" 
              className="media-item"
              onClick={() => setLightboxIndex(idx)}
            />
            {removable && (
              <button className="media-remove-btn" onClick={() => onRemove && onRemove(idx)}>
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxIndex(null)}
          >
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              src={mediaUrls[lightboxIndex]} 
              className="lightbox-img"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPreview;
