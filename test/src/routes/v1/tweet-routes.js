const express = require('express');
const passport = require('passport');
const router = express.Router();

const tweetController = require('../../controllers/tweet-controller');
router.post('/tweet',passport.authenticate('jwt', { session: false }),tweetController.createTweet);
router.get('/tweets',passport.authenticate('jwt', { session: false }),tweetController.getAllTweets);
module.exports = router;