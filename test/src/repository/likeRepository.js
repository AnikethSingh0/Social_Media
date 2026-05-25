const Like = require('../models/like');
const BaseRepository = require('./baseRepository');
const TweetRepository = require('./tweetRepository');
const CommentRepository = require('./commentRepository');
class LikeRepository extends BaseRespository {
    constructor() {
        super(Like);
        this.tweetRepository = new TweetRepository();
        this.commentRepository = new CommentRepository();
    }
    async findByUserAndLikeable(data) {
        try {
            return await this.model.findOne({
                likedBy: data.user,
                likeable: data.modelId,
                onModel: data.modelType
            });
        } catch (error) {
            console.error("Error finding like:", error);
            throw error;
        }
    }
}
module.exports = LikeRepository;