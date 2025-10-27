import { create } from "zustand";

type ChatUser = {
  id: string;
  name: string;
  avatar: string;
};

type ChatState = {
  onlineIds: string[];
  activeChatUser: ChatUser | null;
  setActiveChatUser: (user: ChatUser) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  onlineIds: [],
  activeChatUser: null,
  setActiveChatUser: (user) => {
    set({ activeChatUser: user });
  },
}));
