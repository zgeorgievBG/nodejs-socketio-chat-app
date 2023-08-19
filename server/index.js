const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const messages = [];

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("join_room", (data) => {
    socket.join(data);
    socket.emit("message_history", messages);
  });

  socket.on("send_message", (data) => {
    
    console.log(data.room);
    messages.push(data);
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
