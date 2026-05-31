import { HiMenuAlt2 } from "react-icons/hi";
import { HiHashtag } from "react-icons/hi2";

interface ChannelHeaderProps {
  channelName: string | null;
  onToggleSidebar: () => void;
}

export default function ChannelHeader({
  channelName,
  onToggleSidebar,
}: ChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-gray-800 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="md:hidden text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-gray-700"
      >
        <HiMenuAlt2 size={22} />
      </button>
      <div className="flex items-center gap-2">
        {channelName ? (
          <>
            <HiHashtag className="text-violet-400" size={20} />
            <span className="font-semibold text-white">{channelName}</span>
          </>
        ) : (
          <span className="text-gray-400 text-sm">
            Selecciona o únete a un canal
          </span>
        )}
      </div>
    </div>
  );
}
