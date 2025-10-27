"use client";

import Image from "next/image";
import { useGetUsers } from "../../custom-hooks/useUser";
import { useChatStore } from "../../lib/store";
import { SpinnerCircularFixed } from "spinners-react";
import { useWindowWidth } from "../../custom-hooks/useWindowWidth";

type User = {
  name: string;
  id: string;
  email: string;
  avatar: string;
  bio: string | null;
  password: string;
  hasProfile: boolean;
  createdAt: Date;
};

type FriendsListProps = {
  onlineIds: string[];
  setSidebarOpen: (value: boolean) => void;
};

export function FriendsList({ onlineIds, setSidebarOpen }: FriendsListProps) {
  const { users, isLoading, isError } = useGetUsers();
  const { setActiveChatUser } = useChatStore();
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
      <div className="mt-15">
        <p className="text-xl text-gray-400">Error Fetching Users</p>
      </div>
    );
  }

  const handleSideBarToggle = () => {
    if (screenWidth > 768) return;

    setSidebarOpen(false);
  };

  return (
    <div className="mt-15">
      {users.map((user: User) => {
        const isOnline = onlineIds.includes(user.id);
        return (
          <div
            onClick={() => {
              setActiveChatUser({
                id: user.id,
                name: user.name,
                avatar: user.avatar,
              });
              handleSideBarToggle();
            }}
            key={user.id}
            className="flex items-center text-white
       gap-2 p-3 rounded-lg cursor-pointer
       hover:bg-input-bg"
          >
            {user.avatar && (
              <Image
                src={user.avatar}
                width={1000}
                height={100}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="">
              <p className="font-semibold text-white">{user.name}</p>
              {isOnline ? (
                <span className="text-sm text-green-400">online</span>
              ) : (
                <span className="text-sm text-gray-400">offline</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
