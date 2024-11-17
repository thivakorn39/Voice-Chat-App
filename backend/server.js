const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let activeSpeaker = null; // To track who is speaking

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user starts talking
  socket.on("start-talking", () => {
    if (!activeSpeaker) {
      activeSpeaker = socket.id;
      io.emit("user-talking", activeSpeaker);
      console.log(`${socket.id} started talking`);
    }
  });

  // When a user stops talking
  socket.on("stop-talking", () => {
    if (activeSpeaker === socket.id) {
      activeSpeaker = null;
      io.emit("user-stopped", socket.id);
      console.log(`${socket.id} stopped talking`);
    }
  });

  socket.on("disconnect", () => {
    if (activeSpeaker === socket.id) {
      activeSpeaker = null;
      io.emit("user-stopped", socket.id);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
