# Socket.io Real-Time Chat Application

A comprehensive real-time chat application built with Socket.io, Node.js, Express, and React. This application demonstrates bidirectional communication between clients and server, implementing advanced features like live messaging, notifications, and online status updates.

## 🚀 Features

### Core Chat Functionality
- **Real-time messaging** using Socket.io
- **User authentication** with JWT tokens
- **Multiple chat rooms** with room switching
- **Typing indicators** showing when users are composing messages
- **Online/offline status** for all users
- **Message timestamps** and sender information

### Advanced Features
- **Message reactions** (like, love, laugh, etc.)
- **Read receipts** showing who has read messages
- **Message editing** and deletion
- **Private messaging** between users
- **File sharing** support (images and documents)
- **Message search** functionality
- **Real-time notifications** for new messages

### User Experience
- **Responsive design** for desktop and mobile
- **Modern UI** with smooth animations
- **Auto-scroll** to latest messages
- **Connection status** indicators
- **User avatars** with automatic generation
- **Toast notifications** for user feedback

## 🏗️ Project Structure

```
socketio-chat/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Node.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Socket event handlers
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.io server setup
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Socket.io-client** - Real-time client
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

### Step 1: Clone the Repository
```bash
git clone <https://github.com/l1Nus-M/socketio-chat>
cd socketio-chat
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 4: Environment Setup
Create a `.env` file in the server directory:
```env
PORT=5000
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
```

### Step 5: Start the Development Servers

#### Start the Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

#### Start the Client (in a new terminal)
```bash
cd client
npm start
```
The client will start on `http://localhost:3000`

## 🎯 Usage Guide

### 1. User Registration
- Navigate to the registration page
- Fill in username, email, and password
- Click "Register" to create an account

### 2. User Login
- Enter your username and password
- Click "Login" to access the chat

### 3. Chat Features
- **Send Messages**: Type in the input field and press Enter or click send
- **Switch Rooms**: Click on different rooms in the sidebar
- **React to Messages**: Click the emoji button on any message
- **View Online Users**: See who's online in the sidebar
- **Typing Indicators**: See when others are typing

### 4. Advanced Features
- **Private Messages**: Click on a user to start a private conversation
- **Message Reactions**: Add reactions to messages with emojis
- **Read Receipts**: See who has read your messages
- **File Sharing**: Upload images and documents

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/online` - Get online users
- `GET /api/users/:id` - Get specific user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get specific room
- `POST /api/rooms` - Create new room

## 🔌 Socket.io Events

### Client to Server
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `add_reaction` - Add reaction to message
- `remove_reaction` - Remove reaction from message
- `mark_read` - Mark message as read
- `send_private_message` - Send private message

### Server to Client
- `new_message` - New message received
- `room_history` - Room message history
- `user_typing` - User started typing
- `user_stopped_typing` - User stopped typing
- `user_joined` - User joined room
- `user_left` - User left room
- `user_status_changed` - User online status changed
- `message_reaction_added` - Reaction added to message
- `message_reaction_removed` - Reaction removed from message
- `message_read` - Message marked as read

### Configuration
- Server port: Modify `PORT` in server `.env` file
- JWT secret: Change `JWT_SECRET` in server `.env` file
- Client URL: Update `CLIENT_URL` in server `.env` file

**Happy Chatting! 🎉** 
