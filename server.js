// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize the Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.io with the server

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Listen for incoming Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for chat messages from clients
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast the message to all connected clients
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Define the port for the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

