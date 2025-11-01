"use client";
import { LuUserRoundSearch } from "react-icons/lu";
import { FriendsList } from "./FriendsList";
import { useEffect } from "react";
import { pusherClient } from "../../lib/pusher-client";
import { useChatStore } from "../../lib/store";
import { Members } from "pusher-js";

type PresenceMember = {
  id: string;
};

export function LeftSideBar() {
  const { onlineIds, isOpenSidebar } = useChatStore();

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-online-users");

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      useChatStore.setState({ onlineIds: Object.keys(members.members) });
    });

    channel.bind("pusher:member_added", (member: PresenceMember) => {
      useChatStore.setState((state) => {
        if (state.onlineIds.includes(member.id)) return state;
        return { onlineIds: [...state.onlineIds, member.id] };
      });
    });

    channel.bind("pusher:member_removed", (member: PresenceMember) => {
      useChatStore.setState((state) => ({
        onlineIds: state.onlineIds.filter((id) => id !== member.id),
      }));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <aside
        className={`min-h-screen bg-slate-950 z-50 fixed w-full top-0 left-0 md:w-85 border-r border-border bg-background transform transition-transform duration-300 ease-in-out ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative p-4">
          <div
            className="w-full h-15 absolute
         top-0 left-0 p-4
          flex justify-between
          items-center"
          >
            <span className="text-2xl font-bold text-gray-400">Friends</span>
            <div
              className="h-9 w-9 rounded-full
           bg-gradient-to-r
           text-white text-xl from-blue-500 to-purple-600 flex justify-center items-center"
            >
              <LuUserRoundSearch />
            </div>
          </div>
          <FriendsList onlineIds={onlineIds} />
        </div>
      </aside>
    </div>
  );
}
