// public/script.js

const socket = io();
let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2'; // Identify the user based on URL
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const messages = document.getElementById('messages');
const fileBtn = document.getElementById('file-btn');

// Handle file button click
fileBtn.addEventListener('click', () => {
    fileInput.click(); // Open file input dialog
});

// Send chat message (including file if selected)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value || fileInput.files.length > 0) {
        const message = {
            text: input.value,
            user: username,
            time: new Date().toLocaleTimeString(),
        };

        // If a file is selected, convert it to base64 and send it
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = function () {
                message.file = {
                    name: file.name,
                    data: reader.result, // Base64-encoded file data
                    type: file.type
                };
                socket.emit('chatMessage', message); // Send message with file
                fileInput.value = ''; // Clear the file input
            };

            reader.readAsDataURL(file); // Convert file to base64
        } else {
            socket.emit('chatMessage', message); // Send message without file
        }

        input.value = ''; // Clear input field
    }
});

// Receive and display chat message (including file if attached)
socket.on('chatMessage', (msg) => {
    const li = document.createElement('li');
    li.classList.add(msg.user === username ? 'sent' : 'received');
    li.setAttribute('data-user', msg.user);
    li.innerHTML = `${msg.text} ${msg.file ? `<br><i>File: <a href="${msg.file.data}" download="${msg.file.name}">${msg.file.name}</a></i>` : ''}<div class="timestamp">${msg.time}</div>`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});
