import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image, FileType, Smile, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCard from './TweetCard';
import SkeletonLoader from './SkeletonLoader';
import { useToast } from '../contexts/ToastContext';

const LIMIT = 10;

const Feed = ({ token, userProfile }) => {
  const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const { addToast } = useToast();

  // Refs for bulletproof IntersectionObserver to avoid stale closures and re-attachments
  const hasMoreRef = useRef(hasMore);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const isFetchingMoreRef = useRef(isFetchingMore);
  useEffect(() => { isFetchingMoreRef.current = isFetchingMore; }, [isFetchingMore]);

  const loadingRef = useRef(loading);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  const observer = useRef();

  const lastTweetElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current && !isFetchingMoreRef.current) {
        setOffset(prevOffset => prevOffset + LIMIT);
      }
    }, { threshold: 0.1 });
    
    if (node) observer.current.observe(node);
  }, []); // Empty dependency array ensures this is rock-solid

  useEffect(() => {
    let isMounted = true;
    const fetchTweets = async () => {
      try {
        if (offset === 0) setLoading(true);
        else setIsFetchingMore(true);

        const res = await fetch(`http://localhost:3000/api/v1/tweets?offset=${offset}&limit=${LIMIT}`);
        const data = await res.json();
        
        if (isMounted && data.status === 'success' && data.data) {
          let fetchedTweets = data.data;

          // Auto-fix: If backend ignores pagination and returns all tweets at once,
          // safely simulate the pagination offset on the frontend.
          if (fetchedTweets.length > LIMIT) {
            fetchedTweets = fetchedTweets.slice(offset, offset + LIMIT);
          }

          if (offset === 0) {
            setTweets(fetchedTweets);
          } else {
            setTweets(prev => {
              const idSet = new Set(prev.map(t => t._id));
              const newTweets = fetchedTweets.filter(t => !idSet.has(t._id));
              return [...prev, ...newTweets];
            });
          }
          
          if (fetchedTweets.length < LIMIT) {
            setHasMore(false);
          }
        }
      } catch (err) {
        if (isMounted) addToast('Failed to fetch timeline', 'error');
      } finally {
        if (isMounted) {
          setTimeout(() => {
             setLoading(false);
             setIsFetchingMore(false);
          }, offset === 0 ? 800 : 400);
        }
      }
    };
    
    fetchTweets();
    
    return () => { isMounted = false; };
  }, [offset, addToast]);

  const handlePostTweet = async () => {
    if (!token) return;
    setIsPosting(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: tweetContent })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        const newTweet = {
          ...data.data,
          localUsername: userProfile?.username || 'user',
        };
        setTweets([newTweet, ...tweets]);
        setTweetContent('');
        addToast('Tweet posted successfully!', 'success');
      } else {
        addToast(data.message || 'Failed to post tweet', 'error');
      }
    } catch (err) {
      addToast('Network error posting tweet', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <main className="feed">
      <div className="feed-header">
        <h2>Home</h2>
      </div>

      {token && (
        <div className="tweet-input-container">
          <div className="avatar"></div>
          <div className="input-area">
            <textarea 
              placeholder="What is happening?!" 
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            ></textarea>
            <div className="input-actions">
              <div className="input-icons">
                <Image size={20} className="action-icon" />
                <FileType size={20} className="action-icon" />
                <Smile size={20} className="action-icon" />
                <Calendar size={20} className="action-icon" />
                <MapPin size={20} className="action-icon" />
              </div>
              <motion.button 
                className="post-btn" 
                disabled={!tweetContent.trim() || isPosting}
                onClick={handlePostTweet}
                whileHover={{ scale: tweetContent.trim() && !isPosting ? 1.05 : 1 }}
                whileTap={{ scale: tweetContent.trim() && !isPosting ? 0.95 : 1 }}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      <div className="tweets-list">
        {loading && offset === 0 ? (
          <SkeletonLoader />
        ) : (
          <>
            <AnimatePresence>
              {tweets.map((tweet, index) => {
                // Attach the tripwire ONLY to the very last tweet in the array
                if (tweets.length === index + 1) {
                  return (
                    <div ref={lastTweetElementRef} key={tweet._id || Math.random()} style={{ width: '100%' }}>
                      <TweetCard tweet={tweet} />
                    </div>
                  );
                } else {
                  return <TweetCard key={tweet._id || Math.random()} tweet={tweet} />;
                }
              })}
            </AnimatePresence>
            
            <div className="infinite-scroll-trigger">
              {isFetchingMore && (
                <div className="pagination-loader">
                  <div className="glowing-dot"></div>
                  <div className="glowing-dot" style={{animationDelay: '0.2s'}}></div>
                  <div className="glowing-dot" style={{animationDelay: '0.4s'}}></div>
                </div>
              )}
              {!hasMore && tweets.length > 0 && (
                <div className="end-of-feed-message">
                  You've caught up for now.
                </div>
              )}
            </div>
          </>
        )}
        {!loading && tweets.length === 0 && (
          <div style={{padding: '32px', textAlign: 'center', color: 'var(--dim-text)'}}>
            No tweets yet. Post something with #hashtags!
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
