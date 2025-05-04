import React, { useState } from 'react';
import '@livekit/components-styles';
import { Toaster } from 'react-hot-toast';
import JoinForm from './components/JoinForm';
import VideoRoom from './components/VideoRoom';
import './livekit-theme.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import JoinPage from './components/JoinPage';

function App() {
  const [roomData, setRoomData] = useState(null);

  const handleLeaveRoom = () => setRoomData(null);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<JoinForm onJoinRoom={setRoomData} />} />
        <Route path="/join/:roomName" element={
          roomData ? (
            <VideoRoom 
              token={roomData.token}
              roomName={roomData.roomName}
              serverUrl={roomData.serverUrl}
              onLeaveRoom={handleLeaveRoom}
            />
          ) : (
            <JoinPage onJoinRoom={setRoomData} />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
