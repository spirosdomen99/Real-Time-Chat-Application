// public/script.js

const socket = io();

// Capture form submission
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

// Emit a new chat message when the form is submitted
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting the usual way
    if (input.value) {
        socket.emit('chatMessage', input.value); // Send message to the server
        input.value = ''; // Clear the input field
    }
});

// Listen for new messages from the server
socket.on('chatMessage', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li); // Add the new message to the message list
    window.scrollTo(0, document.body.scrollHeight); // Auto-scroll to the bottom
});
