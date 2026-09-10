"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header/Header";
import { isLoggedIn } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dynamically import components to avoid SSR issues
const ChatArea = dynamic(() => import("@/components/Chat/ChatArea"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/Chat/Sidebar"), {
  ssr: false,
});
const RightSidebar = dynamic(() => import("@/components/Chat/RightSidebar"), {
  ssr: false,
});

const ChatPage: React.FC = () => {
  const [streamedOutput, setStreamedOutput] = useState<any[]>([]);
  const [conversationsID, setConversationsID] = useState<string>("");
  const isUser = isLoggedIn();
  const router = useRouter();
  const [leftChatToggle, setLeftChatToggle] = useState<boolean>(false);
  const [rightToggle, setRightToggle] = useState<boolean>(false);

  useEffect(() => {
    // Redirect if user is not logged in
    if (!isUser) {
      router.push("/signin");
    }
  }, [isUser, router]);

  // Ensure components relying on browser APIs don't render on the server
  if (typeof window === "undefined") {
    return null;
  }

  if (!isUser) {
    return null;
  }

  return (
    <div className="h-screen flex relative">
      {/* Sidebar to manage the output */}
      <Sidebar
        setStreamedOutput={setStreamedOutput}
        leftChatToggle={leftChatToggle}
        setLeftChatToggle={setLeftChatToggle}
      />
      <div className="flex-1 flex flex-col">
        {/* ChatArea to display conversation */}
        <ChatArea
          streamedOutput={streamedOutput}
          conversationsID={conversationsID}
          setLeftChatToggle={setLeftChatToggle}
          setRightToggle={setRightToggle}
        />
        {/* Optionally uncomment Drawer if needed */}
        {/* <Drawer /> */}
      </div>
      {/* Right Sidebar to manage conversation ID */}
      <RightSidebar
        setConversationsID={setConversationsID}
        rightToggle={rightToggle}
        setRightToggle={setRightToggle}
      />
    </div>
  );
};

export default ChatPage;
