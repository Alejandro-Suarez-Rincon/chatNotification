"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatLayout from "./ChatLayout";

export default function Chat() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("chat_username");
    if (!stored) {
      router.replace("/");
    } else {
      setUsername(stored);
    }
  }, [router]);

  if (!username) return null;

  return <ChatLayout username={username} />;
}
