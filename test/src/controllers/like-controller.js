const LikeService = require('../services/like-service');
const likeService = new LikeService();


const toggleLike = async (req, res) => {
    try {
        const { modelId, modelType } = req.body;
        await likeService.toggleLike(req.user.id, modelId, modelType);