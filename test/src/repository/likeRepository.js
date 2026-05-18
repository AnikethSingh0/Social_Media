const likeModel = require('../models/like.js');
class LikeRepository {
    async create(data) {
        try {
            const like = await likeModel.create(data);
            return like;
        } catch (error) {
            throw error;
        }
    }
    async delete(id){
        try {
            const like = await likeModel.findByIdAndDelete(id);
            return like;
        } catch (error) {
            throw error;
        }
    }
    async findById(id){
        try {
            const like = await likeModel.findById(id);
            return like;
        } catch (error) {
            throw error;
        }
    }
    async update(id, data){
        try {
            const like = await likeModel.findByIdAndUpdate
            (id, data, { new: true });
            return like;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = LikeRepository;
