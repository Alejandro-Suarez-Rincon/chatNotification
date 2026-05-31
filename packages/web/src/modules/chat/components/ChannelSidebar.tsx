import { ChannelState } from "@/types/chat";
import { HiHashtag } from "react-icons/hi2";
import { IoAdd } from "react-icons/io5";
import UserAvatar from "./UserAvatar";

interface ChannelSidebarProps {
  channels: Map<string, ChannelState>;
  activeChannel: string | null;
  username: string;
  onSelectChannel: (room: string) => void;
  onJoinChannel: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChannelSidebar({
  channels,
  activeChannel,
  username,
  onSelectChannel,
  onJoinChannel,
  isOpen,
  onClose,
}: ChannelSidebarProps) {
  const channelList = Array.from(channels.values());

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40 md:z-auto
          top-0 left-0 h-full md:h-auto
          w-64 flex-shrink-0
          bg-gray-900 flex flex-col
          transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* App header */}
        <div className="px-4 py-4 bg-gradient-to-r from-violet-700 to-purple-800 shadow-md">
          <h1 className="text-white font-bold text-lg tracking-wide">
            💬 ChatRoom
          </h1>
          <p className="text-violet-200 text-xs mt-0.5">Chat local en tiempo real</p>
        </div>

        {/* Channels label */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Canales
          </span>
        </div>

        {/* Channel list */}
        <nav className="flex-1 overflow-y-auto px-2 py-1">
          {channelList.length === 0 && (
            <p className="text-gray-500 text-xs px-2 py-2">
              No te has unido a ningún canal.
            </p>
          )}
          {channelList.map((ch) => {
            const isActive = ch.name === activeChannel;
            return (
              <button
                key={ch.name}
                onClick={() => {
                  onSelectChannel(ch.name);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all
                  ${isActive
                    ? "bg-violet-600/30 text-violet-200 font-semibold"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                  }
                `}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <HiHashtag
                    size={15}
                    className={isActive ? "text-violet-400" : "text-gray-500"}
                  />
                  <span className="truncate">{ch.name}</span>
                </span>
                {ch.unreadCount > 0 && !isActive && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                    {ch.unreadCount > 99 ? "99+" : ch.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Join button */}
        <div className="px-3 py-2 border-t border-gray-700">
          <button
            onClick={onJoinChannel}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 transition"
          >
            <IoAdd size={18} />
            <span>Unirse a canal</span>
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 bg-gray-800/80 flex items-center gap-3 border-t border-gray-700">
          <UserAvatar username={username} size="sm" />
          <span className="text-gray-300 text-sm font-medium truncate">
            {username}
          </span>
        </div>
      </aside>
    </>
  );
}
