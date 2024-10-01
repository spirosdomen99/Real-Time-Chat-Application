document.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const input = document.getElementById('message-input');
    const form = document.getElementById('chat-form');
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.getElementById('file-btn');
    const messages = document.getElementById('messages');
    
    let selectedFile = null;

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

     // When a file is selected, show the file name with a checkmark to indicate it's ready
     fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];

            const filePreview = document.createElement('div');
            filePreview.classList.add('file-ready');
            filePreview.textContent = `${selectedFile.name}  ✔ `;

            const existingPreview = document.querySelector('.file-ready');
            if (existingPreview) {
                existingPreview.remove(); // Remove old preview if a new file is selected
            }

            document.querySelector('.input-container').appendChild(filePreview);
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

            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    message.file = {
                        name: selectedFile.name,
                        data: reader.result,
                        type: selectedFile.type
                    };
                    socket.emit('chatMessage', message);
                    selectedFile = null; // Clear the file after sending
                    document.querySelector('.file-ready').remove(); // Remove file preview after sending
                    fileInput.value = ''; // Clear the file input
                };
                reader.readAsDataURL(selectedFile);
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
    
        const nameHTML = `<span class="name">${msg.user === username ? 'ME' : 'FRIEND'} <span class="dot">●</span></span>`;
    
        const lastMessage = messages.lastElementChild;
        if (!lastMessage || lastMessage.getAttribute('data-user') !== msg.user) {
            li.classList.add('show-name');
            li.innerHTML = `${nameHTML}<br>`;
        } else {
            lastMessage.classList.remove('last-in-group'); // Remove last-in-group from the previous message
        }
    
        // Append message text if exists
        if (msg.text) {
            li.innerHTML += `${msg.text}<br>`;
        }
    
        // Append file download link if a file was sent
        if (msg.file) {
            const fileLink = document.createElement('a');
            fileLink.href = msg.file.data;  // The Base64 data or file URL
            fileLink.download = msg.file.name;  // The file name for download
            fileLink.textContent = `Download ${msg.file.name}`;  // Display text for the download link
            li.appendChild(fileLink);  // Add the file download link to the message element
        }
    
        li.classList.add('last-in-group'); // Mark this as the last in the group
        li.innerHTML += `<div class="timestamp">${msg.time}</div>`;
    
        li.setAttribute('data-user', msg.user);
        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom of the chat
    });
    
});
