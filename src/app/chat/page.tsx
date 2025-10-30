"use client";

import { ChatInput } from "@/components/ChatInput";
import Image from "next/image";
import { useChatStore } from "../../../lib/store";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { GetMessage } from "../../../custom-hooks/useMessage";
import { ChatWindow } from "@/components/ChatWindow";
import { SpinnerCircularFixed } from "spinners-react";
import { useWindowWidth } from "../../../custom-hooks/useWindowWidth";

export default function Page() {
  const { activeChatUser, onlineIds } = useChatStore();
  const receiverId = activeChatUser?.id;
  const { messages, isLoading, isError } = GetMessage(receiverId);
  const screenWidth = useWindowWidth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-30">
        <SpinnerCircularFixed size={30} color="#4f39f6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center p-4">
        <p className="text-gray-400">Error fetching messages...</p>
      </div>
    );
  }

  if (!activeChatUser) {
    return (
      <div className="flex flex-col h-screen flex-1 p-4 justify-center">
        <div className="text-center space-y-2">
          <div className="text-indigo-600 flex justify-center">
            <FaUser size={50} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-300">
            Select a user to start chatting
          </h2>
          <p className="text-gray-500">Your conversations will appear here.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen flex-1">
      <div className="flex items-center gap-2 p-4 border-b border-b-border">
        {screenWidth && screenWidth <= 768 && (
          <div
            onClick={() => useChatStore.getState().setSidebarOpen()}
            className="text-gray-400 bg-transparent w-9 h-9 flex justify-center items-center rounded-full transition hover:bg-gray-900 cursor-pointer"
          >
            <FaArrowLeft size={18} />
          </div>
        )}

        {activeChatUser.avatar && (
          <Image
            src={activeChatUser.avatar}
            width={1000}
            height={1000}
            alt="profile-pic"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-white">{activeChatUser.name}</p>
          {onlineIds.includes(activeChatUser.id) ? (
            <p className="text-green-400 text-xs">online</p>
          ) : (
            <p className="text-gray-400 text-xs">offline</p>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow messages={messages} />

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
}
