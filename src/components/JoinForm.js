import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaVideo, FaUserPlus } from 'react-icons/fa';
import './JoinForm.css';

const API_URL = process.env.REACT_APP_BACKEND;

// Add axios interceptors for better error handling
axios.interceptors.request.use(request => {
  console.log('Starting Request:', {
    method: request.method,
    url: request.url,
    data: request.data
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Request Error:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
);

function JoinForm({ onJoinRoom }) {
  const [isCreating, setIsCreating] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isCreating) {
        // Create a new room
        const createResponse = await axios.post(`${API_URL}/create-meet`, {
          roomName: roomName || undefined
        });

        if (!createResponse.data.success) {
          throw new Error(createResponse.data.message || 'Failed to create room');
        }

        // Join the created room
        const joinResponse = await axios.post(`${API_URL}/join-meet`, {
          roomName: createResponse.data.roomName,
          userIdentity: userName
        });

        if (!joinResponse.data.success) {
          throw new Error(joinResponse.data.message || 'Failed to join room');
        }

        const roomLink = `${window.location.origin}/join/${createResponse.data.roomName}`;
        toast.success('Room created successfully! Share this link:');
        prompt('Copy and share this meeting link:', roomLink);
      } else {
        // Join existing room
        const joinResponse = await axios.post(`${API_URL}/join-meet`, {
          roomName,
          userIdentity: userName
        });

        if (!joinResponse.data.success) {
          throw new Error(joinResponse.data.message || 'Failed to join room');
        }

        onJoinRoom(joinResponse.data);
        toast.success('Joined room successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="join-form-container">
      <div className="join-form-card">
        <h1 className="join-form-title">
          {isCreating ? 'Create Meeting' : 'Join Meeting'}
        </h1>

        <div className="join-form-tabs">
          <button
            className={`tab-button ${isCreating ? 'active' : ''}`}
            onClick={() => setIsCreating(true)}
          >
            <FaVideo /> Create
          </button>
          <button
            className={`tab-button ${!isCreating ? 'active' : ''}`}
            onClick={() => setIsCreating(false)}
          >
            <FaUserPlus /> Join
          </button>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder={isCreating ? "Enter room name (optional)" : "Enter room name"}
              required={!isCreating}
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || (!isCreating && !roomName) || !userName}
          >
            {isLoading ? 'Loading...' : (isCreating ? 'Create & Join' : 'Join')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinForm; 