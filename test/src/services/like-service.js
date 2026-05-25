const LikeRepository = require('../repositories/like-repository');
const TweetRepository = require('../repositories/tweetRepository');
const CommentRepository = require('../repositories/commentRepository');

class LikeService {
    constructor(){
        this.likeRepository = new LikeRepository();
        this.tweetRepository = new TweetRepository();
        this.commentRepository = new CommentRepository();
    }
    async toggleLike(userId, modelId, modelType){
        try {
            const existingLike = await this.likeRepository.findByUserAndLikeable({
                user : userId, 
                modelId : modelId, 
                onModel : modelType 
            });
            if(existingLike){
                await this.likeRepository.delete(existingLike.id);
                if(modelType === 'Tweet'){
                    await this.tweetRepository.decrementLikeCount(modelId);
                }else if(modelType === 'Comment'){
                    await this.commentRepository.decrementLikeCount(modelId);
                }
            }else{
                await this.likeRepository.create({
                    user: userId,
                    modelId: modelId,
                    onModel: modelType
                });
                if(modelType === 'Tweet'){
                    await this.tweetRepository.incrementLikeCount(modelId);
                }else if(modelType === 'Comment'){
                    await this.commentRepository.incrementLikeCount(modelId);
                }
            }
        }catch(error){
            console.log("Error in service layer while toggling like:", error);
            throw error;
        }
    }
}
module.exports = LikeService;