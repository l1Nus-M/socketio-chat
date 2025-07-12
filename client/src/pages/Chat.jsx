import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import Sidebar from '../components/Sidebar';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Chat = () => {
  const { user, logout } = useAuth();
  const { 
    connected, 
    currentRoom, 
    messages, 
    typingUsers, 
    onlineUsers,
    joinRoom,
    sendMessage,
    startTyping,
    stopTyping
  } = useSocket();
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (connected) {
      joinRoom('general');
    }
  }, [connected, joinRoom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText, currentRoom);
      setMessageText('');
      stopTyping(currentRoom);
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      startTyping(currentRoom);
    }
    
    // Clear typing indicator after 3 seconds of no typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
      stopTyping(currentRoom);
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getTypingIndicator = () => {
    const typingInCurrentRoom = typingUsers.filter(
      typing => typing.roomId === currentRoom && typing.userId !== user?.id
    );
    
    if (typingInCurrentRoom.length > 0) {
      const names = typingInCurrentRoom.map(t => t.username).join(', ');
      return `${names} ${typingInCurrentRoom.length === 1 ? 'is' : 'are'} typing...`;
    }
    return null;
  };

  return (
    <div className="chat-container">
      <Sidebar 
        currentRoom={currentRoom}
        onlineUsers={onlineUsers}
        onRoomChange={joinRoom}
      />
      
      <div className="chat-main">
        <div className="chat-header">
          <h2>{currentRoom}</h2>
          <div className="header-actions">
            <div className="user-info">
              <img 
                src={user?.avatar} 
                alt={user?.username} 
                className="user-avatar"
              />
              <span>{user?.username}</span>
              <div className={`user-status ${connected ? '' : 'offline'}`}></div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
        
        <div className="messages-container">
          <MessageList 
            messages={messages}
            currentUser={user}
            onMarkRead={(messageId) => {
              // Handle mark as read
            }}
          />
          
          {getTypingIndicator() && (
            <div className="typing-indicator">
              {getTypingIndicator()}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput
          value={messageText}
          onChange={handleTyping}
          onSubmit={handleSendMessage}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default Chat; 