"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi";

const socket = io(process.env.SOCKET_CLIENT ?? "http://localhost:4000");

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [username, setUsername] = useState<string>(""); // Nombre de usuario actual
  const [receiver, setReceiver] = useState<string>(""); // Usuario receptor

  useEffect(() => {
    if (username) {
      socket.emit("identify", username);
    }

    socket.on(
      "chat message",
      ({ sender, message }: { sender: string; message: string }) => {
        setMessages((prevMessages) => [...prevMessages, { sender, message }]);
      }
    );

    return () => {
      socket.off("chat message");
    };
  }, [username]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && receiver && username) {
      socket.emit("chat message", { sender: username, receiver, message });
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
          placeholder="Recipient"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
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
