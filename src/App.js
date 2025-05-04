import React, { useState } from 'react';
import '@livekit/components-styles';
import { Toaster } from 'react-hot-toast';
import JoinForm from './components/JoinForm';
import VideoRoom from './components/VideoRoom';
import './livekit-theme.css';
import './App.css';

function App() {
  const [roomData, setRoomData] = useState(null);

  const handleJoinRoom = (data) => {
    setRoomData(data);
  };

  const handleLeaveRoom = () => {
    setRoomData(null);
  };

  return (
    <div className="app">
      <Toaster position="top-center" />
      {!roomData ? (
        <JoinForm onJoinRoom={handleJoinRoom} />
      ) : (
        <VideoRoom 
          token={roomData.token} 
          roomName={roomData.roomName} 
          serverUrl={roomData.serverUrl}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
