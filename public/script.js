document.addEventListener('DOMContentLoaded', () => {
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPicker = document.getElementById('emoji-picker');
    const input = document.getElementById('message-input');
    const form = document.getElementById('chat-form');
    const fileInput = document.getElementById('file-input');
    const fileBtn = document.getElementById('file-btn');
    const messages = document.getElementById('messages');
    let selectedFile = null;

    // Array of emojis (keeping your existing emoji array)
    const emojis = ['😊', '😂', '😍', '😢', '😡', '😱', '👍', '👎', '🔥', '❤️'];

    // Handle emoji picker
    emojiBtn.addEventListener('click', () => {
        emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
    });

    // Handle file button click
    fileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // When a file is selected, show the file name with a checkmark to indicate it's ready
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];

            const filePreview = document.createElement('div');
            filePreview.classList.add('file-ready');
            filePreview.textContent = `${selectedFile.name}  ✔`;

            const existingPreview = document.querySelector('.file-ready');
            if (existingPreview) {
                existingPreview.remove(); // Remove old preview if a new file is selected
            }

            document.querySelector('.input-container').appendChild(filePreview);
        }
    });

    // Socket.io connection
    const socket = io();

    // Submit chat message or file
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value || selectedFile) {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const message = {
                text: input.value || '',
                user: window.location.href.includes('user_1') ? 'user_1' : 'user_2',
                time: timeString
            };

            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                    message.file = {
                        name: selectedFile.name,
                        data: reader.result, // Base64-encoded file data
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

            input.value = ''; // Clear the input field
        }
    });

    // Receive and display chat message
    socket.on('chatMessage', (msg) => {
        const li = document.createElement('li');
        li.classList.add(msg.user === window.location.href.includes('user_1') ? 'sent' : 'received');

        if (msg.text) {
            li.innerHTML = msg.text;
        }

        if (msg.file) {
            const fileLink = document.createElement('a');
            fileLink.href = msg.file.data;
            fileLink.download = msg.file.name;
            fileLink.textContent = `Download ${msg.file.name}`;
            li.appendChild(fileLink);
        }

        const timestamp = document.createElement('div');
        timestamp.classList.add('timestamp');
        timestamp.textContent = msg.time;
        li.appendChild(timestamp);

        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
    });
});
