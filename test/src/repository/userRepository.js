const User = require('../models/user.js');
const baseRepository = require('./baseRepository.js');
class UserRepository extends baseRepository {
    constructor() {
        super(User);
    }
    async getData(userId) {
        try {
            const user = await thi
}
module.exports = UserRepository;
