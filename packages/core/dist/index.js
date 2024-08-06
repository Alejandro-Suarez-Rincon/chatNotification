"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
