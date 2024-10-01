document.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const input = document.getElementById('message-input');
    const form = document.getElementById('chat-form');
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.getElementById('file-btn');
    const messages = document.getElementById('messages');
    const filePreview = document.createElement('div'); // To show file preview
    filePreview.id = 'file-preview';
    document.querySelector('.input-container').appendChild(filePreview);

    // User status
    let username = window.location.href.includes('user_1') ? 'user_1' : 'user_2';
    let isUserOnline = { user_1: true, user_2: true }; // Assuming both users are online for demo

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

    // Display file preview once selected
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            filePreview.innerHTML = `<p>Selected file: ${file.name}</p>`;
        } else {
            filePreview.innerHTML = ''; // Clear preview if no file is selected
        }
    });

    // Socket.io connection (assuming it's set up)
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

            // Handle file upload
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                    message.file = {
                        name: file.name,
                        data: reader.result, // Base64-encoded file data
                        type: file.type
                    };
                    socket.emit('chatMessage', message); // Send message with file
                    fileInput.value = ''; // Clear the file input
                    filePreview.innerHTML = ''; // Clear the file preview
                };

                reader.readAsDataURL(file);
            } else {
                socket.emit('chatMessage', message); // Send message without file
            }

            input.value = ''; // Clear message input field
        }
    });

    // Receive and display chat message
    socket.on('chatMessage', (msg) => {
        const li = document.createElement('li');
        li.classList.add(msg.user === username ? 'sent' : 'received');
        li.classList.add(isUserOnline[msg.user] ? 'online' : 'offline');

        const nameHTML = `<span class="name">${msg.user === username ? 'ME' : 'FRIEND'} <span class="dot">●</span></span>`;

        const lastMessage = messages.lastElementChild;
        if (!lastMessage || lastMessage.getAttribute('data-user') !== msg.user) {
            li.classList.add('show-name');
            li.innerHTML = `${nameHTML}<br>${msg.text}`;
        } else {
            lastMessage.classList.remove('last-in-group'); // Remove last-in-group from the previous message
            li.innerHTML = `${msg.text}`;
        }

        li.classList.add('last-in-group'); // Mark this as the last in the group
        if (msg.file) {
            li.innerHTML += `<br><i>File: <a href="${msg.file.data}" download="${msg.file.name}">${msg.file.name}</a></i>`;
        }
        li.innerHTML += `<div class="timestamp">${msg.time}</div>`;

        li.setAttribute('data-user', msg.user);
        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the chat
    });
});
