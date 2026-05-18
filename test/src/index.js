const express = require('express');
const connect = require('./config/database');
const routes = require('./routes/index');
const passport = require('passport');
const passportAuth = require('./middleware/jwt-middleware');
const passportGoogleAuth = require('./middleware/google-middleware');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(passport.initialize());
passportAuth(passport);
passportGoogleAuth(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
const run = () => {
    app.listen(3000, async () => {
        console.log('Server is running on port 3000');
        await connect();
        console.log('Database connected successfully');
    });
};

run();