import { useState } from 'react';
import Feed from '../components/Feed';
import CommentThread from '../components/CommentThread';

const Home = ({ token, userProfile }) => {
  const [activeCommentTweet, setActiveCommentTweet] = useState(null);
  const [commentAdjustments, setCommentAdjustments] = useState({});

  const handleOpenComments = (tweet) => {
    setActiveCommentTweet(tweet);
  };

  const handleCloseComments = () => {
    setActiveCommentTweet(null);
  };

  const handleCommentAdded = (tweetId = activeCommentTweet?._id) => {
    if (!tweetId) return;

    setActiveCommentTweet((prev) => (
      prev && prev._id === tweetId
        ? { ...prev, commentCount: (prev.commentCount || 0) + 1 }
        : prev
    ));
    setCommentAdjustments((current) => ({
      ...current,
      [tweetId]: (current[tweetId] || 0) + 1,
    }));
  };

  return (
    <>
      <Feed 
        token={token} 
        userProfile={userProfile} 
        onOpenComments={handleOpenComments} 
        commentAdjustments={commentAdjustments}
      />
      
      <CommentThread 
        tweet={activeCommentTweet}
        isOpen={!!activeCommentTweet}
        onClose={handleCloseComments}
        onCommentAdded={handleCommentAdded}
        userProfile={userProfile}
      />
    </>
  );
};

export default Home;
