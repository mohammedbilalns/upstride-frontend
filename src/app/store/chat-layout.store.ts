import { create } from 'zustand';

interface ChatLayoutState {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export const useChatLayoutStore = create<ChatLayoutState>((set) => ({
  showSidebar: false,
  setShowSidebar: (show) => set({ showSidebar: show }),
}));
