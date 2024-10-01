document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const input = document.getElementById('message-input');
    const form = document.getElementById('chat-form');
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.getElementById('file-btn');
    const messages = document.getElementById('messages');

    // User status
    let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2';
    let isUserOnline = { user_1: false, user_2: false };

    // Emojis to display in the picker
    const emojis = ['😊', '😂', '😍', '😢', '😡', '😱', '👍', '👎', '🔥', '❤️'];

    // Initialize: Ensure emoji picker is hidden
    emojiPicker.style.display = 'none';

    // Toggle emoji picker visibility on button click
    emojiBtn.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
    });

    // Generate emoji picker buttons dynamically
    emojiPicker.innerHTML = ''; // Clear any existing content
    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.textContent = emoji;
        emojiButton.classList.add('emoji'); // Optional for styling
        emojiButton.onclick = () => {
            input.value += emoji;
            emojiPicker.style.display = 'none'; // Hide emoji picker after selection
        };
        emojiPicker.appendChild(emojiButton);
    });

    // Handle file input click
    fileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Socket.io connection
    const socket = io();

    // Submit chat message
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (input.value || fileInput.files.length > 0) {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const message = {
                text: input.value,
                user: username,
                time: timeString
            };

            // If a file is selected, send the file as base64
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                    message.file = {
                        name: file.name,
                        data: reader.result, // Base64-encoded file data
                        type: file.type
                    };
                    socket.emit('chatMessage', message);
                    fileInput.value = ''; // Clear the file input
                };

                reader.readAsDataURL(file);
            } else {
                socket.emit('chatMessage', message);
            }

            input.value = ''; // Clear message input field
        }
    });

    // Receive and display chat message
    socket.on('chatMessage', (msg) => {
        const li = document.createElement('li');
        li.classList.add(msg.user === username ? 'sent' : 'received');
        li.classList.add(isUserOnline[msg.user] ? 'online' : 'offline');
        
        // Check if the last message is from a different user
        const lastMessage = messages.lastElementChild;
        if (!lastMessage || lastMessage.getAttribute('data-user') !== msg.user) {
            li.classList.add('show-name'); // Show name if it's a new user or first message
        } else {
            lastMessage.querySelector('.timestamp').style.display = 'none'; // Hide timestamp for non-final messages
        }

        li.setAttribute('data-user', msg.user);
        li.innerHTML = `
            ${msg.text} 
            ${msg.file ? `<br><i>File: <a href="${msg.file.data}" download="${msg.file.name}">${msg.file.name}</a></i>` : ''}
            <div class="timestamp">${msg.time}</div>
        `;
        
        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the chat
    });

    // Handle user connection status updates
    socket.on('userStatus', (status) => {
        isUserOnline = status;
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

    // Emit user connection event when connected
    socket.emit('userConnected', username);

    // Handle user disconnect event
    socket.on('disconnect', () => {
        socket.emit('userDisconnected', username);
    });
});
