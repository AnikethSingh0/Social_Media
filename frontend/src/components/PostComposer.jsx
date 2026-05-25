import { useEffect, useRef, useState } from 'react';
import { Image, FileType, Smile, Calendar, MapPin, X } from 'lucide-react';

import { createTweet } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

const PostComposer = ({ userProfile, onPostSuccess }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [mediaKind, setMediaKind] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const MAX_CHARS = 250;
  const MAX_MEDIA_BYTES = 25 * 1024 * 1024;
  const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
  ]);
  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isPosting;

  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    };
  }, [mediaPreviewUrl]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExtension = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4'].includes(extension);
    const isAllowedMime = ALLOWED_MIME_TYPES.has(file.type);

    if (!isAllowedMime && !isAllowedExtension) {
      addToast('Upload a JPG, PNG, GIF, WEBP, or MP4 file', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_MEDIA_BYTES) {
      addToast('Media must be under 25MB', 'error');
      e.target.value = '';
      return;
    }

    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);

    setMediaFile(file);
    setMediaKind(file.type.startsWith('video/') || extension === 'mp4' ? 'video' : 'image');
    setMediaPreviewUrl(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaKind(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsPosting(true);
    try {
      const { res, data } = await createTweet(content.trim(), mediaFile);
      if (res.ok && data.status === 'success') {
        const newTweet = {
          ...data.data,
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
          placeholder="Share something with Namaste"
          value={content}
          onChange={handleInput}
          disabled={isPosting}
          className="composer-textarea"
          rows={1}
        />

        {mediaPreviewUrl && (
          <div className="composer-media-preview">
            {mediaKind === 'video' ? (
              <video src={mediaPreviewUrl} controls muted />
            ) : (
              <img src={mediaPreviewUrl} alt="Upload preview" />
            )}
            <button className="composer-media-remove" onClick={removeMedia} aria-label="Remove selected media">
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
              aria-label="Attach media"
            >
              <Image size={20} />
            </button>
            <button className="tool-btn" disabled aria-label="Attach file"><FileType size={20} /></button>
            <button className="tool-btn" disabled aria-label="Add emoji"><Smile size={20} /></button>
            <button className="tool-btn" disabled aria-label="Schedule post"><Calendar size={20} /></button>
            <button className="tool-btn" disabled aria-label="Add location"><MapPin size={20} /></button>
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
              disabled={!canSubmit}
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
