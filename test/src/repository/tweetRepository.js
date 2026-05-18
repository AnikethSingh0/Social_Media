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
}
module.exports = TweetRepository;