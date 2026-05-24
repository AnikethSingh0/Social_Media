const Comment = require('../models/comment.js');
const baseRepository = require('./baseRepository.js');

class CommentRepository extends baseRepository {
    constructor() {
        super(Comment);
    }
    async incrementCommentCount(commentId) {
        try {
            const comment = await this.model.findByIdAndUpdate(
                commentId,
                { $inc: { commentCount: 1 } },
                { new: true } 
            );
            return comment;
        } catch (error) {
            console.log("Error in CommentRepository while incrementing comment count:", error);
            throw error;
        }
    }
    async decrementCommentCount(commentId) {
        try {
            const comment = await this.model.findByIdAndUpdate(
                commentId,
                { $inc: { commentCount: -1 } },
                { new: true }
            );
            return comment;
        } catch (error) {
            console.log("Error in CommentRepository while decrementing comment count:", error);
            throw error;
        }
    }
}

module.exports = CommentRepository;