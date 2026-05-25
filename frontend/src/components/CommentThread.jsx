import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerDownRight, MessageCircle } from 'lucide-react';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import LoadingSkeleton from './ui/LoadingSkeleton';
import {
  formatRelativeTime,
  getUserDisplay,
  renderContentWithHashtags,
} from '../lib/utils';
import { fetchComments, createComment, fetchReplies, createReply } from '../lib/api';
import { useToast } from '../contexts/ToastContext';

const CommentNode = ({ comment, tweetId, onReplySuccess, userProfile }) => {
  const [replies, setReplies] = useState([]);
  const [isReplyAreaOpen, setIsReplyAreaOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesFetched, setRepliesFetched] = useState(false);
  const [localReplyCount, setLocalReplyCount] = useState(comment.commentCount || 0);
  const { addToast } = useToast();
  const author = getUserDisplay(comment.user);

  const loadReplies = async () => {
    if (repliesFetched || localReplyCount === 0) {
      setIsReplyAreaOpen((current) => !current);
      return;
    }

    setLoadingReplies(true);
    try {
      const { res, data } = await fetchReplies(comment._id);
      if (res.ok && data.success) {
        setReplies(Array.isArray(data.data) ? data.data : []);
        setRepliesFetched(true);
        setIsReplyAreaOpen(true);
      } else {
        addToast(data.message || 'Failed to load replies', 'error');
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
      const { res, data } = await createReply(tweetId, comment._id, replyContent.trim());
      if (res.ok && data.success) {
        const newReply = {
          ...data.data,
          user: userProfile || { name: 'You', username: 'you' },
        };
        setReplies((prev) => [newReply, ...prev]);
        setRepliesFetched(true);
        setLocalReplyCount((count) => count + 1);
        setReplyContent('');
        setIsReplyAreaOpen(true);
        onReplySuccess(tweetId);
        addToast('Reply added', 'success');
      } else {
        addToast(data.message || 'Failed to add reply', 'error');
      }
    } catch {
      addToast('Network error while replying', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-node">
      <div className="comment-thread-line" />
      <div className="comment-body">
        <div className="comment-avatar">
          <Avatar name={author.name} size="md" />
        </div>
        <div className="comment-content-area">
          <div className="comment-header">
            <span className="comment-name">{author.name}</span>
            <span className="comment-username">@{author.username}</span>
            <span className="comment-dot">&middot;</span>
            <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <div className="comment-text">
            {renderContentWithHashtags(comment.content)}
          </div>
          <div className="comment-actions">
            <button className="comment-action-btn" type="button" onClick={loadReplies}>
              <MessageCircle size={16} />
              <span>{localReplyCount > 0 ? `${localReplyCount} replies` : 'Reply'}</span>
            </button>
          </div>

          {loadingReplies && <div className="reply-loading">Loading replies...</div>}

          <AnimatePresence>
            {isReplyAreaOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="reply-composer-area"
              >
                <div className="reply-composer">
                  <CornerDownRight size={16} className="reply-icon" />
                  <textarea
                    placeholder="Write a reply"
                    value={replyContent}
                    onChange={(event) => {
                      setReplyContent(event.target.value);
                      event.target.style.height = 'auto';
                      event.target.style.height = `${event.target.scrollHeight}px`;
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
                    {replies.map((reply) => (
                      <CommentNode
                        key={reply._id}
                        comment={reply}
                        tweetId={tweetId}
                        onReplySuccess={onReplySuccess}
                        userProfile={userProfile}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const CommentThread = ({ tweet, isOpen, onClose, onCommentAdded, userProfile }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadComments = async () => {
      if (!tweet?._id) return;

      setLoading(true);
      try {
        const { res, data } = await fetchComments(tweet._id);
        if (res.ok && data.success) {
          setComments(Array.isArray(data.data) ? data.data : []);
        } else {
          setComments([]);
          addToast(data.message || 'Failed to load comments', 'error');
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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, tweet, addToast]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !tweet?._id) return;

    setIsSubmitting(true);
    try {
      const { res, data } = await createComment(tweet._id, newComment.trim());
      if (res.ok && data.success) {
        const addedComment = {
          ...data.data,
          user: userProfile || { name: 'You', username: 'you' },
        };
        setComments((prev) => [addedComment, ...prev]);
        setNewComment('');
        onCommentAdded(tweet._id);
        addToast('Comment added', 'success');
      } else {
        addToast(data.message || 'Failed to add comment', 'error');
      }
    } catch {
      addToast('Network error while commenting', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const originalAuthor = tweet ? getUserDisplay(tweet.user) : { name: 'User', username: 'user' };

  return (
    <AnimatePresence>
      {isOpen && tweet && (
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
              <div>
                <p className="drawer-eyebrow">Conversation</p>
                <h2>Post replies</h2>
              </div>
              <button className="drawer-close" type="button" onClick={onClose} aria-label="Close replies">
                <X size={24} />
              </button>
            </div>

            <div className="drawer-original-tweet">
              <div className="ot-header">
                <Avatar name={originalAuthor.name} size="sm" />
                <div className="ot-user-info">
                  <div className="ot-name">{originalAuthor.name}</div>
                  <div className="ot-username">@{originalAuthor.username}</div>
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
                  description="Be the first to add a sharp thought to this conversation."
                />
              ) : (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <CommentNode
                      key={comment._id}
                      comment={comment}
                      tweetId={tweet._id}
                      onReplySuccess={onCommentAdded}
                      userProfile={userProfile}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="drawer-footer">
              <textarea
                placeholder="Post your reply"
                value={newComment}
                onChange={(event) => {
                  setNewComment(event.target.value);
                  event.target.style.height = 'auto';
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 150)}px`;
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
