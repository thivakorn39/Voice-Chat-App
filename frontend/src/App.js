import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const SERVER_URL = "https://voice-chat-app-kvt1.onrender.com"; // Replace with Render URL when deployed
const socket = io(SERVER_URL);

const App = () => {
  const [isTalking, setIsTalking] = useState(false);
  const [speaker, setSpeaker] = useState(null);

  const handleStartTalking = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      socket.emit("start-talking");
      setIsTalking(true);
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  };

  const handleStopTalking = () => {
    socket.emit("stop-talking");
    setIsTalking(false);
  };

  useEffect(() => {
    socket.on("user-talking", (id) => {
      setSpeaker(id);
    });

    socket.on("user-stopped", (id) => {
      if (speaker === id) setSpeaker(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [speaker]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Voice Chat (Push-to-Talk)</h1>
      <div>
        <p>Current Speaker: {speaker ? speaker : "No one"}</p>
      </div>
      <button
        onMouseDown={handleStartTalking}
        onMouseUp={handleStopTalking}
        disabled={isTalking}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {isTalking ? "Talking..." : "Push to Talk"}
      </button>
    </div>
  );
};

export default App;
