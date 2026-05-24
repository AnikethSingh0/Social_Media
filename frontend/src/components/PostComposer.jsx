import { useState, useRef } from 'react';
import { Image, FileType, Smile, Calendar, MapPin, X } from 'lucide-react';

import { createTweet } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const PostComposer = ({ userProfile, onPostSuccess }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const MAX_CHARS = 250;
  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !mediaFile) || isOverLimit) return;
    
    setIsPosting(true);
    try {
      const { res, data } = await createTweet(content, mediaFile);
      if (res.ok && data.status === 'success') {
        const newTweet = {
          ...data.data,
          // Optimistically add user data since backend might just return ObjectId depending on population
          user: userProfile || { name: 'User', username: 'user' },
        };
        onPostSuccess(newTweet);
        setContent('');
        removeMedia();
        addToast('Post published successfully', 'success');
      } else {
        addToast(data.message || 'Failed to publish post', 'error');
      }
    } catch {
      addToast('Network error while posting', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="post-composer">
      <div className="composer-avatar-col">
        <Avatar name={userProfile?.fullName || userProfile?.username || 'User'} />
      </div>
      
      <div className="composer-content-col">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={handleInput}
          disabled={isPosting}
          className="composer-textarea"
          rows={1}
        />

        {mediaPreviewUrl && (
          <div className="composer-media-preview">
            <img src={mediaPreviewUrl} alt="Upload preview" />
            <button className="composer-media-remove" onClick={removeMedia}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="composer-actions">
          <div className="composer-tools">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleMediaChange} 
              accept="image/*,video/*" 
              style={{ display: 'none' }} 
            />
            <button 
              className="tool-btn" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPosting}
            >
              <Image size={20} />
            </button>
            <button className="tool-btn" disabled><FileType size={20} /></button>
            <button className="tool-btn" disabled><Smile size={20} /></button>
            <button className="tool-btn" disabled><Calendar size={20} /></button>
            <button className="tool-btn" disabled><MapPin size={20} /></button>
          </div>

          <div className="composer-submit-group">
            {content.length > 0 && (
              <span className={`char-counter ${isOverLimit ? 'over-limit' : charsLeft <= 20 ? 'near-limit' : ''}`}>
                {charsLeft}
              </span>
            )}
            <div className="composer-divider" />
            <Button
              onClick={handleSubmit}
              disabled={(!content.trim() && !mediaFile) || isOverLimit || isPosting}
              isLoading={isPosting}
              size="sm"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComposer;
