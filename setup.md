# Socket.io Chat Application - Quick Setup Guide

## 🚀 Quick Start Instructions

### Step 1: Environment Setup
Create a `.env` file in the `server` directory with the following content:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Step 2: Start the Server
Open a terminal and run:
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

### Step 3: Start the Client
Open another terminal and run:
```bash
cd client
npm start
```
The client will start on `http://localhost:3000`

### Step 4: Test the Application
1. Open your browser and go to `http://localhost:3000`
2. Register a new account
3. Start chatting!

## 📋 Commands Summary

### Server Commands
```bash
cd server
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
npm test            # Run tests
```

### Client Commands
```bash
cd client
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
```

## 🔧 Troubleshooting

### Common Issues:

1. **Port already in use**
   - Change the PORT in server/.env file
   - Kill processes using the port: `npx kill-port 5000`

2. **CORS errors**
   - Make sure CLIENT_URL in server/.env matches your client URL
   - Check that both server and client are running

3. **Socket connection failed**
   - Verify the server is running on the correct port
   - Check browser console for connection errors

4. **Authentication errors**
   - Clear browser localStorage
   - Check JWT_SECRET in server/.env

## 🎯 Features to Test

1. **User Registration/Login**
   - Register with username, email, password
   - Login with credentials

2. **Real-time Messaging**
   - Send messages in real-time
   - See messages from other users instantly

3. **Room Switching**
   - Switch between General and Random rooms
   - Messages are room-specific

4. **Typing Indicators**
   - Start typing to see "user is typing" indicator
   - Stop typing to clear indicator

5. **Message Reactions**
   - Click the emoji button on messages
   - Add reactions like 👍, ❤️, 😂

6. **Online Status**
   - See online users in sidebar
   - Real-time status updates

7. **Read Receipts**
   - Messages show read status
   - Track who has read messages

## 🚀 Production Deployment

### Build for Production:
```bash
cd client
npm run build
```

### Environment Variables for Production:
```env
PORT=5000
JWT_SECRET=your-production-secret-key
CLIENT_URL=https://your-domain.com
NODE_ENV=production
```

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server console for errors
3. Verify all environment variables are set
4. Ensure both server and client are running

Happy Chatting! 🎉 