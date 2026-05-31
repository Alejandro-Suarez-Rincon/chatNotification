import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN || "*", // Configuración de origen desde .env
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send({ message: "Hello from the server!" });
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join room", ({ room, username }) => {
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  });

  socket.on("message:server", ({ room, sender, message }) => {
io.to(room).emit("message:client", {
      room,
      sender,
      message,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Configurar el puerto y dirección de escucha
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
