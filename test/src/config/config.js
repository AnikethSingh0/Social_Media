const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    salt_round : process.env.SALT_ROUND,
    jwt_secret : process.env.JWT_SECRET,
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
}