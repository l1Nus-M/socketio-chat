import React from 'react';
import { format } from 'date-fns';
import Message from './Message';

const MessageList = ({ messages, currentUser, onMarkRead }) => {
  const handleMessageClick = (messageId) => {
    onMarkRead(messageId);
  };

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.sender?.id === currentUser?.id}
          currentUser={currentUser}
          onClick={() => handleMessageClick(message.id)}
        />
      ))}
    </div>
  );
};

export default MessageList; 