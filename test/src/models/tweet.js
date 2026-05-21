const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: [250,'Tweet length should be less than 250 characters'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    hashtags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hashtag',
        }
    ]
} , { timestamps: true });

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;