export interface ChatMessage {
  id: string;
  room: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ChannelState {
  name: string;
  messages: ChatMessage[];
  unreadCount: number;
}

export type ChannelsMap = Map<string, ChannelState>;

export type ChatAction =
  | { type: "JOIN_CHANNEL"; room: string }
  | { type: "SET_ACTIVE_CHANNEL"; room: string }
  | { type: "RECEIVE_MESSAGE"; msg: ChatMessage }
  | { type: "CLEAR_UNREAD"; room: string }
  | { type: "TOGGLE_SIDEBAR" };

export interface ChatState {
  channels: ChannelsMap;
  activeChannel: string | null;
  isSidebarOpen: boolean;
}
