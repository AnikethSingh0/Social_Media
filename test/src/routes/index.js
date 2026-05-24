const express = require('express');

const router = express.Router();
const v1Api = require('./v1/tweet-routes.js');
const v1AuthRoutes = require('./v1/auth-routes.js');
const v1CommentRoutes = require('./v1/comment-routes.js');

router.use('/v1/comments', v1CommentRoutes);
router.use('/v1/auth', v1AuthRoutes);

router.use('/v1', v1Api);
module.exports = router;