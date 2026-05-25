const Tweet = require('../models/tweet');

class TweetRepository {
    async createTweet(data) {
        try {
            const tweet = await Tweet.create(data);
            return tweet;
        } catch (error) {
            throw new Error('Error creating tweet: ' + error.message);
        }
    };
    async getTweets(id) {
        try {
            if(id){
                const tweet = await Tweet.findById(id);
                return tweet;
            }else{
                const tweets = await Tweet.find();
                return tweets;
            }
        }catch (error) {
            throw new Error('Error fetching tweets: ' + error.message);
        }
    }

    async getAllTweets(offset,limit) {
        try {
            const tweets = await Tweet.find()
            .populate('user' , 'name username')
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit);
            return tweets;
        } catch (error) {
            throw new Error('Error fetching all tweets: ' + error.message);
        }
    }

    async getTweetsWithComments(id) {
        try {
            const tweet = await Tweet.findById(id).populate('comment');
            return tweet;
        } catch (error) {
            throw new Error('Error fetching tweet with comments: ' + error.message);
        }
    }
    async incrementCommentCount(tweetId) {
        try {
            const tweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $inc: { commentCount: 1 } },
                { new: true }
            );
            return tweet;
        }catch(error){
            console.log("Error in incrementing comment count:", error);
            throw error;
        }
    }
    async decrementCommentCount(tweetId) {
        try {
            const tweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $inc: { commentCount: -1 } },
                { new: true }
            );
            return tweet;
        }
        catch(error){
            console.log("Error in decrementing comment count:", error);
            throw error;
        }
    }
    incrementLikeCount(tweetId) {
        try {
            const tweet = this.model.findByIdAndUpdate(
                tweetId,
                { $inc: { likeCount: 1 } },
                { new: true }
            );
            return tweet;
        } catch (error) {
            console.log("Error in TweetRepository while incrementing like count:", error);
            throw error;
        }
    }
    decrementLikeCount(tweetId) {
        try {
            const tweet = this.model.findByIdAndUpdate(
                tweetId,
                { $inc: { likeCount: -1 } },
                { new: true }
            );
            return tweet;
        } catch (error) {
            console.log("Error in TweetRepository while decrementing like count:", error);
            throw error;
        }
    }
}
module.exports = TweetRepository;