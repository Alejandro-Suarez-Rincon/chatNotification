import { ChatMessage } from "@/types/chat";
import UserAvatar from "./UserAvatar";

interface MessageBubbleProps {
  msg: ChatMessage;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ msg }: MessageBubbleProps) {
  if (msg.isOwn) {
    return (
      <div className="flex justify-end mb-3 px-4">
        <div className="max-w-[75%] flex flex-col items-end gap-1">
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-md break-words">
            {msg.message}
          </div>
          <span className="text-xs text-gray-400 px-1">
            {formatTime(msg.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-3 px-4">
      <UserAvatar username={msg.sender} size="sm" />
      <div className="max-w-[75%] flex flex-col gap-1">
        <span className="text-xs font-semibold text-gray-400 px-1">
          {msg.sender}
        </span>
        <div className="bg-gray-700 text-gray-100 px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-md break-words">
          {msg.message}
        </div>
        <span className="text-xs text-gray-500 px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}
