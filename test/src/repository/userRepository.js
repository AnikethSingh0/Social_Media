const User = require('../models/user.js');
const baseRepository = require('./baseRepository.js');
class UserRepository extends baseRepository {
    constructor() {
        super(User);
    }
}
module.exports = UserRepository;
