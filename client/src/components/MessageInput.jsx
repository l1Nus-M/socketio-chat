import React from 'react';

const MessageInput = ({ value, onChange, onSubmit, placeholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form className="message-input-form" onSubmit={onSubmit}>
        <textarea
          className="message-input"
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          rows="1"
        />
        <button type="submit" className="send-button">
          ➤
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 