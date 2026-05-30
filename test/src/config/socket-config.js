const { Server } = require("socket.io");
const chatSocketHandler = require('../sockets/chat-sockets');

const configureSockets = (server) => {
    // Set up CORS security
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"]
        }
    });

    chatSocketHandler(io);

    return io;
};

module.exports = configureSockets;