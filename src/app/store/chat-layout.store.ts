import { create } from "zustand";

/**
 * Zustand store for managing chat layout state.
 * Controls visibility of the sidebar across the chat UI.
 */
interface ChatLayoutState {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

/**
 *  layout store to toggle sidebar visibility in the chat module.
 */
export const useChatLayoutStore = create<ChatLayoutState>((set) => ({
  showSidebar: false,

  // Update sidebar visibility
  setShowSidebar: (show) => set({ showSidebar: show }),
}));

