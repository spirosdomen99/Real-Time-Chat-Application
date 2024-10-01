const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = { user_1: false, user_2: false };

io.on('connection', (socket) => {
    console.log('A user connected');

    // When a user connects, mark them as online
    socket.on('userConnected', (username) => {
        connectedUsers[username] = true;
        io.emit('userStatus', connectedUsers); // Broadcast updated user status
    });

    // When a user disconnects, mark them as offline
    socket.on('disconnect', () => {
        for (let user in connectedUsers) {
            if (connectedUsers[user]) {
                connectedUsers[user] = false;
                io.emit('userStatus', connectedUsers); // Broadcast updated user status
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
