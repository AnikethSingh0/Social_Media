const TweetService = require('../services/tweet-service');

const tweetService = new TweetService();
const createTweet = async (req, res) => {
    try {
        const data = req.body;
        const tweet = await tweetService.create(data);
        return res.status(201).json({
            data : tweet,
            status : 'success',
            message: 'Tweet created successfully',
            error : {},
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error creating tweet',
            error: error.message
        });
    }
};

module.exports = {
    createTweet,
};