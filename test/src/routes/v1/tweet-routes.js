const express = require('express');
const passport = require('passport');
const router = express.Router();

const tweetController = require('../../controllers/tweet-controller');
router.post('/tweet',passport.authenticate('jwt'
     ,{ session: false })
     ,upload.array('images', 10)
     ,tweetController.createTweet
    );
router.get('/tweets',tweetController.getAllTweets);
module.exports = router;