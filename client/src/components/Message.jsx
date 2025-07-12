import React, { useState } from 'react';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';

const Message = ({ message, isOwn, currentUser, onClick }) => {
  const { addReaction, removeReaction } = useSocket();
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (reaction) => {
    const hasReacted = message.reactions && message.reactions[currentUser?.id] === reaction;
    
    if (hasReacted) {
      removeReaction(message.id);
    } else {
      addReaction(message.id, reaction);
    }
  };

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className={`message ${isOwn ? 'own' : ''}`}>
      {!isOwn && (
        <img 
          src={message.sender?.avatar} 
          alt={message.sender?.username} 
          className="message-avatar"
        />
      )}
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {message.sender?.username}
          </span>
          <span className="message-time">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
        </div>
        
        <div className="message-text">
          {message.content}
          {message.isEdited && (
            <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '8px' }}>
              (edited)
            </span>
          )}
        </div>
        
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="message-reactions">
            {Object.entries(message.reactions).map(([userId, reaction]) => (
              <span key={userId} className="reaction">
                {reaction}
              </span>
            ))}
          </div>
        )}
        
        {message.readBy && message.readBy.length > 0 && (
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
            Read by {message.readBy.length} user{message.readBy.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div className="message-actions">
        <button 
          onClick={() => setShowReactions(!showReactions)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '16px',
            opacity: 0.7
          }}
        >
          😊
        </button>
        
        {showReactions && (
          <div className="reactions-panel" style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            gap: '4px',
            zIndex: 1000
          }}>
            {reactions.map((reaction) => (
              <button
                key={reaction}
                onClick={() => {
                  handleReaction(reaction);
                  setShowReactions(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 