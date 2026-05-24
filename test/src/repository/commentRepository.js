const Comment = require('../models/comment');
const baseRepository = require('./baseRepository.js');

class CommentRepository extends baseRepository {
    constructor() {
        super(Comment);
    }
}

module.exports = CommentRepository;