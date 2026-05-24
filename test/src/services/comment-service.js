const CommentReposirory = require('../repository/commentRepository');
const TweetRepository = require('../repository/tweetRepository');

class CommentService{
    constructor(){
        this.commentRepository = new CommentReposirory();
        this.tweetRepository = new TweetRepository();
    }
    async createTopLevelComment(data){
        try{
            const commentData = {
                content : data.content,
                user : data.user,
                parentTweet : data.parentTweet,
                onComment : null
            }

            const comment = await this.commentRepository.create(commentData);
            await this.tweetRepository.incrementCommentCount(data.parentTweet);

            return comment;
        }catch(error){
            console.log("Error in service layer while creating top level comment:", error);
            throw error;
        }
    }
    async createNestedReply(data){
        try{
            const replyData = {
                content : data.content,
                user : data.user,
                parentTweet : data.parentTweet,
                onComment : data.parentCommentId
            };

            const reply = await this.commentRepository.create(replyData);
            await this.tweetRepository.incrementCommentCount(data.parentTweet);
            await this.commentRepository.incrementCommentCount(data.parentCommentId);

            return reply;
        }catch(error){
            console.log("Error in service layer while creating nested reply:", error);
            throw error;
        }
    }
    async getCommentsForTweet(tweetId){
        try{
            const comments = await this.commentRepository.model.find({ parentTweet: tweetId, onComment: null })
            .populate('user', 'name username')
            .sort({ createdAt: -1 });

            return comments;
        }catch(error){
            console.log("Error in service layer while fetching comments for tweet:", error);
            throw error;
        }
    }

    async getRepliesForComment(commentId){
        try{
            const replies = await this.commentRepository.model.find({ onComment: commentId })
            .populate('user', 'name username')
            .sort({ createdAt: -1 });

            return replies;
        }catch(error){
            console.log("Error in service layer while fetching replies for comment:", error);
            throw error;
        }
    }

    async deleteComment(commentId, userId){
        try{
            const comment = await this.commentRepository.model.findById(commentId);
            if(!comment){
                throw new Error("Comment not found");
            }
            if(comment.user.toString() !== userId){
                throw new Error("Unauthorized to delete this comment");
            }
            if(comment.onComment){
                
            }
        }catch(error){
            console.log("Error in service layer while deleting comment:", error);
            throw error;
        }
    }
}
module.exports = CommentService;