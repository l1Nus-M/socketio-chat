import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ currentRoom, onlineUsers, onRoomChange }) => {
  const [rooms, setRooms] = useState([
    { id: 'general', name: 'General', description: 'General chat room' },
    { id: 'random', name: 'Random', description: 'Random chat room' }
  ]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="rooms-list">
        <h3>Rooms</h3>
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`room-item ${currentRoom === room.id ? 'active' : ''}`}
            onClick={() => onRoomChange(room.id)}
          >
            <span className="room-icon">#</span>
            <div>
              <div>{room.name}</div>
              <small style={{ opacity: 0.7 }}>{room.description}</small>
            </div>
          </div>
        ))}
      </div>
      
      <div className="users-list">
        <h3>Online Users ({onlineUsers.length})</h3>
        {onlineUsers.map((user) => (
          <div key={user.id} className="user-item">
            <img 
              src={user.avatar} 
              alt={user.username} 
              style={{ width: '24px', height: '24px', borderRadius: '50%' }}
            />
            <span>{user.username}</span>
            <div className="user-status"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 