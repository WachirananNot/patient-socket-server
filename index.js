const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  io.emit("connected", socket.id);

  socket.on("inputChanged", (data) => {
    socket.broadcast.emit("inputChanged", data);
  });

  socket.on("resetForm", () => {
    io.emit("resetForm");
  });

  socket.on("submitted", () => {
    io.emit("submitted", true);
  });

  socket.on("disconnect", () => {
    io.emit("disconnected", socket.id);
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
