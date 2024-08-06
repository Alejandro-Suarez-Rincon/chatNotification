"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  useEffect(() => {
    if (username && room) {
      socket.emit("join room", { room, username });

      socket.on(
        "message:client",
        ({ sender, message }: { sender: string; message: string }) => {
          setMessages((prevMessages) => [...prevMessages, { sender, message }]);
        }
      );

      return () => {
        socket.off("chat message");
      };
    }
  }, [username, room]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && room && username) {
      socket.emit("message:server", { room, sender: username, message });
      setMessage("");
    }
  };

  return (
    <section>
      <div>
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          id="input"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </section>
  );
}
