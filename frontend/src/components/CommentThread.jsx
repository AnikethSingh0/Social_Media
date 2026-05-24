import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerDownRight, MessageCircle } from 'lucide-react';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import LoadingSkeleton from './ui/LoadingSkeleton';
import { formatRelativeTime, renderContentWithHashtags } from '../lib/utils';
import { fetchComments, createComment, fetchReplies, createReply } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

// --- Recursive Comment Node Component ---
const CommentNode = ({ comment, tweetId, onReplySuccess }) => {
  const [replies, setReplies] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesFetched, setRepliesFetched] = useState(false);
  const { addToast } = useToast();

  const loadReplies = async () => {
    if (repliesFetched || comment.commentCount === 0) {
      setShowReplyInput(!showReplyInput);
      return;
    }
    
    setLoadingReplies(true);
    try {
      const { res, data } = await fetchReplies(comment._id);
      if (res.ok && data.success) {
        setReplies(data.data);
        setRepliesFetched(true);
        setShowReplyInput(true);
      }
    } catch {
      addToast('Failed to load replies', 'error');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const { res, data } = await createReply(tweetId, comment._id, replyContent);
      if (res.ok && data.success) {
        // Optimistically add the reply
        const newReply = {
          ...data.data,
          user: { name: 'You', username: 'user' }, // Fallback, could pass userProfile
        };
        setReplies(prev => [newReply, ...prev]);
        setReplyContent('');
        setShowReplyInput(false);
        onReplySuccess(); // Bubbles up to update original tweet comment count
        addToast('Reply added', 'success');
      } else {
        addToast(data.message || 'Failed to reply', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-node">
      <div className="comment-body">
        <div className="comment-avatar">
          <Avatar name={comment.user?.name || comment.user?.fullName} size="md" />
        </div>
        <div className="comment-content-area">
          <div className="comment-header">
            <span className="comment-name">{comment.user?.name || comment.user?.fullName || 'User'}</span>
            <span className="comment-username">@{comment.user?.username || 'user'}</span>
            <span className="comment-dot">·</span>
            <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <div className="comment-text">
            {renderContentWithHashtags(comment.content)}
          </div>
          <div className="comment-actions">
            <button className="comment-action-btn" onClick={loadReplies}>
              <MessageCircle size={16} />
              <span>{comment.commentCount > 0 ? comment.commentCount : 'Reply'}</span>
            </button>
          </div>
        </div>
      </div>

      {loadingReplies && <div className="ml-12 mt-2 text-sm text-[var(--dim-text)]">Loading replies...</div>}

      <AnimatePresence>
        {showReplyInput && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="reply-composer-area"
          >
            <div className="reply-composer">
              <CornerDownRight size={16} className="reply-icon" />
              <textarea 
                placeholder="Tweet your reply"
                value={replyContent}
                onChange={(e) => {
                  setReplyContent(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                disabled={isSubmitting}
                rows={1}
              />
              <Button size="sm" onClick={handleReplySubmit} disabled={!replyContent.trim() || isSubmitting} isLoading={isSubmitting}>
                Reply
              </Button>
            </div>
            
            {replies.length > 0 && (
              <div className="replies-list">
                {replies.map(reply => (
                  <CommentNode 
                    key={reply._id} 
                    comment={reply} 
                    tweetId={tweetId} 
                    onReplySuccess={onReplySuccess} 
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Drawer Component ---
const CommentThread = ({ tweet, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      try {
        const { res, data } = await fetchComments(tweet._id);
        if (res.ok && data.status === 'success') {
          setComments(data.data);
        }
      } catch {
        addToast('Failed to load comments', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && tweet) {
      document.body.style.overflow = 'hidden';
      loadComments();
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, tweet, addToast]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const { res, data } = await createComment(tweet._id, newComment);
      if (res.ok && data.success) {
        const addedComment = {
          ...data.data,
          user: { name: 'You', username: 'user' },
        };
        setComments([addedComment, ...comments]);
        setNewComment('');
        onCommentAdded();
        addToast('Comment added', 'success');
      } else {
        addToast(data.message || 'Failed to add comment', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-backdrop"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="drawer-panel"
          >
            <div className="drawer-header">
              <h2>Post replies</h2>
              <button className="drawer-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="drawer-original-tweet">
              <div className="ot-header">
                <Avatar name={tweet.user?.name || tweet.user?.fullName} size="md" />
                <div className="ot-user-info">
                  <div className="ot-name">{tweet.user?.name || tweet.user?.fullName || 'User'}</div>
                  <div className="ot-username">@{tweet.user?.username || 'user'}</div>
                </div>
              </div>
              <div className="ot-content">
                {renderContentWithHashtags(tweet.content)}
              </div>
            </div>

            <div className="drawer-content">
              {loading ? (
                <LoadingSkeleton count={3} />
              ) : comments.length === 0 ? (
                <EmptyState 
                  icon={MessageCircle} 
                  title="No replies yet" 
                  description="Be the first to share what you think!"
                />
              ) : (
                <div className="comments-list">
                  {comments.map(comment => (
                    <CommentNode 
                      key={comment._id} 
                      comment={comment} 
                      tweetId={tweet._id} 
                      onReplySuccess={onCommentAdded} 
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="drawer-footer">
              <textarea 
                placeholder="Post your reply"
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                disabled={isSubmitting}
                rows={1}
              />
              <Button onClick={handleSubmit} disabled={!newComment.trim() || isSubmitting} isLoading={isSubmitting}>
                Reply
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentThread;
