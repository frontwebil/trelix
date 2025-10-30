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
  isOpenSidebar: boolean;
  closeSidebar: () => void;
  setSidebarOpen: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  onlineIds: [],
  activeChatUser: null,
  isOpenSidebar: true,
  setActiveChatUser: (user) => set({ activeChatUser: user }),
  closeSidebar: () => set({ isOpenSidebar: false }), // исправлено
  setSidebarOpen: () => set({ isOpenSidebar: true }), // исправлено
}));
