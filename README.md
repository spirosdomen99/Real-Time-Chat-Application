
# Real-Time Chat Application

This is a real-time chat application built using **Node.js**, **Express**, and **Socket.IO**. It allows users to send real-time messages, share files, and use emojis. The application provides a responsive chat interface with a simple design.

## Features
- **Real-time messaging**: Messages are updated instantly for all connected users.
- **File sharing**: Users can upload and share files, with download links available to others.
- **Emoji support**: Users can insert emojis into their messages via a built-in emoji picker.
- **User status**: Online/offline indicators next to usernames (green = online, red = offline).
- **Timestamps**: Messages include the timestamp indicating when they were sent.
- **Responsive design**: Works well on both desktop and mobile devices.

---

## Components

### Frontend (HTML/CSS/JavaScript)
- **`index.html`**: Contains the structure of the chat interface, including the message input, emoji button, file upload button, and message display area.
- **`styles.css`**: Provides styling for the chat application, including message bubbles, file preview, and the emoji picker.
- **`script.js`**: Contains client-side logic, including handling chat messages, file uploads, emoji selection, and interaction with the backend via **Socket.IO**.

### Backend (Node.js/Express/Socket.IO)
- **`server.js`**: Sets up the backend with **Express** to serve the frontend and **Socket.IO** to handle real-time messaging between users.
- **`package.json`**: Manages project dependencies such as **Express** and **Socket.IO**.

---

## Prerequisites

To run the application, you need to have the following installed:
- **Node.js**: [Download and install Node.js](https://nodejs.org/en/).
- **npm**: This comes with Node.js, used to manage dependencies.

---

## Running the Application Locally

Follow these steps to set up and run the application on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/real-time-chat-application.git
cd real-time-chat-application
```

### 2. Install Dependencies

```bash
npm install
```

This installs the required packages from `package.json`, including:
- **express**: For serving the application.
- **socket.io**: For real-time messaging between the server and clients.

### 3. Start the Server

```bash
npm start
```

This will start the application at `http://localhost:3000`.

### 4. Open the Application

Open your browser and navigate to:

```bash
http://localhost:3000
```

You can open multiple tabs or browsers to simulate multiple users chatting in real-time.

---

## Deploying the Application Online

You can also deploy the application online using platforms like **Render**, **Heroku**, or other Node.js hosting services. Below are the steps to deploy it using **Render**.

### Deploying on Render

1. **Create a Render Account**: Go to [render.com](https://render.com/) and create an account (if you don't already have one).
   
2. **New Web Service**:
   - Click on "New" > "Web Service".
   
3. **Connect Your Repository**:
   - Connect your GitHub or GitLab repository that contains the code for this application.
   
4. **Set Environment**:
   - Choose **Node** as your environment.
   - In the **Build Command** field, enter:
     ```bash
     npm install
     ```
   - In the **Start Command** field, enter:
     ```bash
     npm start
     ```
   
5. **Deploy**:
   - Click on **Deploy**.
   - Render will automatically build your application and provide you with a URL to access it online.

### Deploying on Heroku

1. **Create a Heroku Account**: Go to [heroku.com](https://www.heroku.com/) and create an account (if you don't already have one).

2. **Install the Heroku CLI**: Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to deploy from the terminal.

3. **Login to Heroku**:

   ```bash
   heroku login
   ```

4. **Create a New Heroku App**:

   ```bash
   heroku create
   ```

5. **Push to Heroku**:

   ```bash
   git push heroku main
   ```

6. **Open the Application**:

   ```bash
   heroku open
   ```

7. **View Logs**:

   ```bash
   heroku logs --tail
   ```

---

## How the Application Works

- **Real-Time Messaging**: Messages sent by a user appear instantly in the chat window of all connected users using **Socket.IO**.
- **File Uploads**: Users can click the file attachment button to select a file. The file will be previewed before being sent, and it will appear in the chat as a downloadable link once sent.
- **Emoji Picker**: Clicking the emoji button opens a set of emojis that users can insert into their messages.
- **User Status**: A green dot indicates that a user is online, while a red dot indicates that a user has gone offline.
- **Responsive Design**: The application adjusts for both mobile and desktop users to ensure a consistent experience.

---

## Project Structure

```bash
real-time-chat-application/
├── public/                  # Public directory for static files like icons
├── index.html               # Main HTML file for the chat interface
├── styles.css               # CSS for styling the chat application
├── script.js                # Client-side JavaScript logic (handles chat, files, emojis)
├── server.js                # Node.js server using Express and Socket.IO
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation (this file)
```

---

## Technologies Used

- **Node.js**: JavaScript runtime environment for backend logic.
- **Express**: Minimalist web framework for handling HTTP requests.
- **Socket.IO**: Enables real-time communication between clients and the server.
- **HTML/CSS/JavaScript**: Frontend technologies for building the user interface.
- **FileReader API**: Handles file uploads and previews in the client browser.

---

## License

This project is licensed under the MIT License.

---

## Author

Feel free to modify and expand this project as needed. Contributions are always welcome!
