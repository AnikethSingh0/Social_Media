import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MediaPreview = ({ urls, removable = false, onRemove }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!urls || urls.length === 0) return null;
  
  const mediaUrls = Array.isArray(urls) ? urls : [urls];
  const isSingle = mediaUrls.length === 1;
  const isVideo = (url) => {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('.mp4') || lowerUrl.startsWith('data:video') || lowerUrl.startsWith('blob:');
  };

  return (
    <div className="media-preview-container">
      <div className={`media-grid ${isSingle ? 'single' : 'multiple'}`}>
        {mediaUrls.map((url, idx) => (
          <div key={idx} className="media-item-wrapper">
            {isVideo(url) ? (
              <video
                src={url}
                className="media-item"
                controls
                preload="metadata"
                onClick={() => setLightboxIndex(idx)}
              />
            ) : (
              <img
                src={url}
                alt="Post media"
                className="media-item"
                onClick={() => setLightboxIndex(idx)}
              />
            )}
            {removable && (
              <button className="media-remove-btn" onClick={() => onRemove && onRemove(idx)} aria-label="Remove media">
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
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close media preview">
              <X size={24} />
            </button>
            {isVideo(mediaUrls[lightboxIndex]) ? (
              <motion.video
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                src={mediaUrls[lightboxIndex]}
                className="lightbox-img"
                controls
                autoPlay
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                src={mediaUrls[lightboxIndex]}
                alt="Expanded post media"
                className="lightbox-img"
                onClick={(event) => event.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaPreview;
