// public/script.js

const socket = io();
let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2';
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const messages = document.getElementById('messages');
const user1Status = document.getElementById('user1-status');
const user2Status = document.getElementById('user2-status');

// Update the user status when a user connects or disconnects
socket.on('connect', () => {
    socket.emit('userConnected', username);
});

socket.on('userStatus', (users) => {
    user1Status.style.backgroundColor = users['user_1'] ? 'green' : 'red';
    user2Status.style.backgroundColor = users['user_2'] ? 'green' : 'red';
});

// Send chat message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value || fileInput.files.length > 0) {
        const message = {
            text: input.value,
            user: username,
            time: new Date().toLocaleTimeString(),
            file: fileInput.files.length ? fileInput.files[0].name : null
        };
        socket.emit('chatMessage', message);
        input.value = '';
        fileInput.value = '';
    }
});

// Display chat message with timestamp
socket.on('chatMessage', (msg) => {
    const li = document.createElement('li');
    li.classList.add(msg.user === username ? 'sent' : 'received');
    li.innerHTML = `${msg.text} ${msg.file ? `<br><i>File: ${msg.file}</i>` : ''}<div class="timestamp">${msg.time}</div>`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});

// Handle user disconnection
socket.on('userDisconnected', (user) => {
    const li = document.createElement('li');
    li.classList.add('received');
    li.innerHTML = `<i>${user} has left the chat</i>`;
    messages.appendChild(li);
});
