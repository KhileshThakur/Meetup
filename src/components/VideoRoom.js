import React, { useCallback, useEffect } from "react";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  CarouselView,
} from "@livekit/components-react";
import { Track } from "livekit-client";
// import { FaSignOutAlt } from "react-icons/fa";
import "./VideoRoom.css";

// Prevent style warning
const preventStyleWarning = () => {
  if (document.querySelector("style[data-lk-themes]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-lk-themes", "true");
  document.head.appendChild(style);
};
function VideoConferenceComponent() {
  useEffect(() => {
    preventStyleWarning();
  }, []);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.ScreenShare,
  ]);

  return (
    <div className="conference-wrapper">
      <div className="video-grid">
        <VideoConference>
          {tracks.length > 0 ? (
            <GridLayout tracks={tracks}>
              <ParticipantTile />
            </GridLayout>
          ) : (
            <CarouselView />
          )}
          <ControlBar />
        </VideoConference>
      </div>

      <RoomAudioRenderer />
    </div>
  );
}

function VideoRoom({ token, roomName, serverUrl, onLeaveRoom }) {
  useEffect(() => {
    preventStyleWarning();
  }, []);

  const roomOptions = {
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      simulcast: true,
    },
    videoCaptureDefaults: {
      resolution: { width: 1280, height: 720 },
    },
  };

  const handleDisconnected = useCallback(() => {
    console.log("Disconnected from room");
    onLeaveRoom();
  }, [onLeaveRoom]);

  const handleError = useCallback(
    (error) => {
      console.error("Room connection error:", error);
      onLeaveRoom();
    },
    [onLeaveRoom]
  );

  const handleConnected = useCallback((room) => {
    if (room) {
      console.log("Connected to room:", room.name);
    }
  }, []);

  if (!token || !serverUrl) {
    console.error("Missing connection parameters:", { token, serverUrl });
    return (
      <div className="error-message">
        Missing required connection parameters
      </div>
    );
  }

  return (
    <div className="video-room">
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        options={roomOptions}
        connect={true}
        onDisconnected={handleDisconnected}
        onError={handleError}
        onConnected={handleConnected}
        data-lk-theme="default"
      >
        <VideoConferenceComponent />
        
      </LiveKitRoom>
    </div>
  );
}

export default VideoRoom;
