const express = require('express');
const passport = require('passport');
const router = express.Router();
const CommentService = require('../../services/comment-service.js');
const commentService = new CommentService();
const { createTopLevelComment, nestedReply, getCommentsForTweet, getRepliesForComment} = require('../../controllers/comment-controller.js');

router.post('/comment/:parentTweet', passport.authenticate('jwt', { session: false }), createTopLevelComment);
router.post('/reply/:parentTweet/:parentCommentId', passport.authenticate('jwt', { session: false }), nestedReply);
router.get('/comments/:parentTweet', getCommentsForTweet);
router.get('/replies/:parentCommentId', getRepliesForComment);  