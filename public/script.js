// public/script.js

const socket = io();
let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2';
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const messages = document.getElementById('messages');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const sendBtn = document.getElementById('send-btn');

// Emoji options
const emojis = ['😊', '😂', '😍', '😢', '👍', '🙏', '🎉', '🔥'];

// Generate emoji picker buttons
emojis.forEach(emoji => {
    const emojiButton = document.createElement('button');
    emojiButton.textContent = emoji;
    emojiButton.onclick = () => {
        input.value += emoji;
    };
    emojiPicker.appendChild(emojiButton);
});

// Toggle emoji picker visibility
emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
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
        emojiPicker.style.display = 'none';
    }
});

// Display chat message
socket.on('chatMessage', (msg) => {
    const li = document.createElement('li');
    li.classList.add(msg.user === username ? 'sent' : 'received');
    li.setAttribute('data-user', msg.user);
    li.innerHTML = `${msg.text} ${msg.file ? `<br><i>File: ${msg.file}</i>` : ''}<div class="timestamp">${msg.time}</div>`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});
