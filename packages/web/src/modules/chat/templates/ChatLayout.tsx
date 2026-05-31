"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { ChatAction, ChatMessage, ChatState } from "@/types/chat";
import ChannelSidebar from "../components/ChannelSidebar";
import ChannelHeader from "../components/ChannelHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import JoinChannelModal from "../components/JoinChannelModal";

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "JOIN_CHANNEL": {
      if (state.channels.has(action.room)) return state;
      const next = new Map(state.channels);
      next.set(action.room, { name: action.room, messages: [], unreadCount: 0 });
      return { ...state, channels: next };
    }
    case "SET_ACTIVE_CHANNEL": {
      return { ...state, activeChannel: action.room, isSidebarOpen: false };
    }
    case "RECEIVE_MESSAGE": {
      const next = new Map(state.channels);
      const existing = next.get(action.msg.room) ?? {
        name: action.msg.room,
        messages: [],
        unreadCount: 0,
      };
      const isActive = state.activeChannel === action.msg.room;
      next.set(action.msg.room, {
        ...existing,
        messages: [...existing.messages, action.msg],
        unreadCount: isActive ? 0 : existing.unreadCount + 1,
      });
      return { ...state, channels: next };
    }
    case "CLEAR_UNREAD": {
      const next = new Map(state.channels);
      const ch = next.get(action.room);
      if (!ch) return state;
      next.set(action.room, { ...ch, unreadCount: 0 });
      return { ...state, channels: next };
    }
    case "TOGGLE_SIDEBAR": {
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    }
    default:
      return state;
  }
}

const initialState: ChatState = {
  channels: new Map(),
  activeChannel: null,
  isSidebarOpen: false,
};

interface ChatLayoutProps {
  username: string;
}

export default function ChatLayout({ username }: ChatLayoutProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const activeChannelRef = useRef<string | null>(null);

  // Sync synchronously during render (not in useEffect) so the socket handler
  // never reads a stale value right after a channel join
  activeChannelRef.current = state.activeChannel;

  // Initialize socket once
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
    socketRef.current = socket;

    socket.on(
      "message:client",
      (raw: { room: string; sender: string; message: string; timestamp: string }) => {
        if (!raw.room) return;
        const msg: ChatMessage = {
          id: Math.random().toString(36).slice(2) + Date.now().toString(36),
          ...raw,
          isOwn: raw.sender === username,
        };
        dispatch({ type: "RECEIVE_MESSAGE", msg });

        if (raw.room !== activeChannelRef.current) {
          toast.message(`#${raw.room}`, {
            description: `${raw.sender}: ${raw.message.slice(0, 80)}`,
            duration: 4000,
          });
        }
      }
    );

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJoinChannel = (room: string) => {
if (!socketRef.current) return;
    dispatch({ type: "JOIN_CHANNEL", room });
    socketRef.current.emit("join room", { room, username });
    dispatch({ type: "SET_ACTIVE_CHANNEL", room });
  };

  const handleSelectChannel = (room: string) => {
    dispatch({ type: "SET_ACTIVE_CHANNEL", room });
    dispatch({ type: "CLEAR_UNREAD", room });
  };

  const handleSendMessage = (message: string) => {
if (!socketRef.current || !state.activeChannel) return;
    socketRef.current.emit("message:server", {
      room: state.activeChannel,
      sender: username,
      message,
    });
  };

  const activeMessages = state.activeChannel
    ? (state.channels.get(state.activeChannel)?.messages ?? [])
    : [];

  return (
    <div className="flex h-[100dvh] bg-gray-900 overflow-hidden">
      <ChannelSidebar
        channels={state.channels}
        activeChannel={state.activeChannel}
        username={username}
        onSelectChannel={handleSelectChannel}
        onJoinChannel={() => setShowJoinModal(true)}
        isOpen={state.isSidebarOpen}
        onClose={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
      />

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <ChannelHeader
          channelName={state.activeChannel}
          onToggleSidebar={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        />
        <MessageList messages={activeMessages} />
        <MessageInput
          onSend={handleSendMessage}
          disabled={!state.activeChannel}
        />
      </div>

      {showJoinModal && (
        <JoinChannelModal
          onJoin={handleJoinChannel}
          onClose={() => setShowJoinModal(false)}
          existingChannels={Array.from(state.channels.keys())}
        />
      )}
    </div>
  );
}
