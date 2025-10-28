import Image from "next/image";
import { MessageType } from "../../types/types";
import { AiFillMessage } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../lib/store";
import { pusherClient } from "../../lib/pusher-client";

export function ChatWindow({ messages }: { messages: MessageType[] }) {
  const { activeChatUser } = useChatStore();
  const receiverId = activeChatUser?.id;
  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const [chatMessages, setChatMessages] = useState<MessageType[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // subscribe to private chat channel
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    // get private channel name
    const ids = [currentUserId, receiverId].sort();
    const channelName = `chat-${ids[0]}-${ids[1]}`;

    const channel = pusherClient.subscribe(channelName);

    const handleNewMessage = (message: MessageType) => {
      setChatMessages((prev) => {
        // avoid duplicate messages;
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusherClient.unsubscribe(channelName);
    };
  }, [currentUserId, receiverId]);

  return (
    <div
      className="flex-1 overflow-y-auto
       p-2 space-y-4 mt-6"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-indigo-600">
            <AiFillMessage size={50} />
          </div>
          <p className="text-3xl font-semibold text-gray-300">
            No messages yet. Start chatting!
          </p>
        </div>
      ) : (
        chatMessages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          return (
            <div
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }  gap-2`}
              key={message.id}
            >
              {!isOwnMessage && message.sender.avatar && (
                <Image
                  src={message.sender.avatar}
                  width={1000}
                  height={1000}
                  alt="profile-pic"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-xs ${
                  isOwnMessage ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`${
                    isOwnMessage
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 rounded-br-2xl"
                      : "bg-slate-800 rounded-bl-2xl"
                  } px-4 py-2 text-white rounded-br-2xl rounded-lg`}
                >
                  <p className="break-all">{message.text}</p>
                </div>
                <span className="text-xs text-gray-400 mr-2">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {isOwnMessage && message.sender.avatar && (
                <Image
                  src={message.sender.avatar}
                  width={1000}
                  height={1000}
                  alt="profile-pic"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
