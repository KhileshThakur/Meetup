import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_BACKEND;

function JoinPage({ onJoinRoom }) {
  const { roomName } = useParams(); // Get the room name from the URL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(`${API_URL}/join/${roomName}`);
        if (res.data.success) {
          onJoinRoom(res.data); // Pass the data to the parent component
        } else {
          toast.error(res.data.message || "Failed to join");
        }
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomName, onJoinRoom]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="join-page-container">
      <h2>Joining Room: {roomName}</h2>
      <p>Please wait while we prepare your room.</p>
    </div>
  );
}

export default JoinPage;
