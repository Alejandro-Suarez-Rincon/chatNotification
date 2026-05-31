"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    sessionStorage.setItem("chat_username", trimmed);
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Header gradient */}
          <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 px-8 py-10 text-center">
            <div className="text-5xl mb-3">💬</div>
            <h1 className="text-white text-3xl font-bold tracking-tight">
              ChatRoom
            </h1>
            <p className="text-violet-200 mt-2 text-sm">
              Chat local en tiempo real
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-gray-300 text-sm font-semibold"
              >
                ¿Cómo te llamas?
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre o apodo..."
                autoFocus
                maxLength={32}
                className="bg-gray-700 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim()}
              className="bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 text-sm"
            >
              Entrar al chat →
            </button>

            <p className="text-gray-500 text-xs text-center">
              Cualquiera en la misma red WiFi puede unirse.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
