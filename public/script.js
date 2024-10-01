// public/script.js

const socket = io();
let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2';
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const messages = document.getElementById('messages');
const fileBtn = document.getElementById('file-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');

// Emoji options
const emojis = ['😊', '😂', '😍', '😢', '😡' , '😱' , '👍' , '👎', '🔥' , '❤️'];// Generate emoji picker buttons
    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.textContent = emoji;
        emojiButton.onclick = () => {
            input.value += emoji;
        };
        emojiPicker.appendChild(emojiButton);
    });

// Track user connection status
let isUserOnline = { user_1: false, user_2: false };

// Handle file button click
fileBtn.addEventListener('click', () => {
    fileInput.click(); // Open file input dialog
});

// Generate emoji picker buttons
emojis.forEach(emoji => {
    const emojiButton = document.createElement('button');
    emojiButton.textContent = emoji;
    emojiButton.onclick = () => {
        input.value += emoji;
    };
    emojiPicker.appendChild(emojiButton);
});

// Handle emoji button click (toggle emoji picker)
emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block'; // Toggle display
});

// Send chat message (including file if selected)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value || fileInput.files.length > 0) {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // Format HH:MM
        const message = {
            text: input.value,
            user: username,
            time: timeString,
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
    li.classList.add(isUserOnline[msg.user] ? 'online' : 'offline');
    
    // Check if the last message was from the same user
    const lastMessage = messages.lastElementChild;
    if (!lastMessage || lastMessage.getAttribute('data-user') !== msg.user) {
        li.classList.add('show-name'); // Show name if it's the first message from this user
    }

    li.setAttribute('data-user', msg.user);
    li.innerHTML = `${msg.text} ${msg.file ? `<br><i>File: <a href="${msg.file.data}" download="${msg.file.name}">${msg.file.name}</a></i>` : ''}<div class="timestamp">${msg.time}</div>`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});

// Handle user connection status
socket.on('userStatus', (status) => {
    isUserOnline = status;
    // Update the online/offline status of all messages
    document.querySelectorAll('li').forEach((li) => {
        const user = li.getAttribute('data-user');
        if (isUserOnline[user]) {
            li.classList.add('online');
            li.classList.remove('offline');
        } else {
            li.classList.add('offline');
            li.classList.remove('online');
        }
    });
});

// Emit user status when connected
socket.emit('userConnected', username);

// Handle user disconnect
socket.on('disconnect', () => {
    socket.emit('userDisconnected', username);
});
