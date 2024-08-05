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

const userSockets: Map<string, string> = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("identify", (username: string) => {
    userSockets.set(username, socket.id);
    console.log(`User identified: ${username}`);
  });

  socket.on(
    "chat message",
    ({
      sender,
      receiver,
      message,
    }: {
      sender: string;
      receiver: string;
      message: string;
    }) => {
      const receiverSocketId = userSockets.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("chat message", { sender, message });
      } else {
        console.log(`Receiver ${receiver} not connected`);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSockets.forEach((socketId, username) => {
      if (socketId === socket.id) {
        userSockets.delete(username);
      }
    });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
