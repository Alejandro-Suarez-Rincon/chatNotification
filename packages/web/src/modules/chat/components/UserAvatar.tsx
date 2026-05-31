import { getUserColor, getUserInitials } from "@/hooks/useUserColor";

interface UserAvatarProps {
  username: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export default function UserAvatar({ username, size = "md" }: UserAvatarProps) {
  const color = getUserColor(username);
  const initials = getUserInitials(username);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none`}
      style={{ backgroundColor: color }}
      title={username}
    >
      {initials}
    </div>
  );
}
