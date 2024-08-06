import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send({ message: "Hello from the server!" });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join room", ({ room, username }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  });

  socket.on("message:server", ({ room, sender, message }) => {
    io.to(room).emit("message:client", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
