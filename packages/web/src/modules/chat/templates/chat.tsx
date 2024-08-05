"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FiSend } from "react-icons/fi";

const socket = io(process.env.SOCKET_CLIENT ?? "http://localhost:4000");

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
      //socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          className="border"
          id="input"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button>
          <FiSend className="" />
        </button>
      </form>
    </section>
  );
}
