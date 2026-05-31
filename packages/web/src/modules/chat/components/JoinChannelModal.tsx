"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiHashtag } from "react-icons/hi2";

interface JoinChannelModalProps {
  onJoin: (room: string) => void;
  onClose: () => void;
  existingChannels: string[];
}

export default function JoinChannelModal({
  onJoin,
  onClose,
  existingChannels,
}: JoinChannelModalProps) {
  const [room, setRoom] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = room.trim().toLowerCase().replace(/\s+/g, "-");
if (!trimmed) return;
    if (existingChannels.includes(trimmed)) {
      setError("Ya estás en ese canal.");
      return;
    }
    onJoin(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg">Unirse a un canal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <IoClose size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <HiHashtag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setError("");
              }}
              placeholder="nombre-del-canal"
              autoFocus
              className="w-full bg-gray-700 text-gray-100 placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={!room.trim()}
            className="bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-md"
          >
            Unirse
          </button>
        </form>
      </div>
    </div>
  );
}
