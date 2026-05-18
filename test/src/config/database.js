const mongoose = require('mongoose');

const connectDatabase = async () => {
    await mongoose.connect('mongodb://localhost:27017/twitter_dev');
}

module.exports = connectDatabase;