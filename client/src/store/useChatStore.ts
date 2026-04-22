import { create } from "zustand";
import axios from "axios";

export interface ChatSession {
  id: string;
  userId: string;
  title: string | null;
  mode: string;
  promptText: string | null;
  playlistUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  isLoading: boolean;
  fetchChats: () => Promise<void>;
  createChat: (data: { title?: string; mode: string; promptText?: string; playlistUrl?: string }) => Promise<void>;
  setActiveChat: (id: string | null) => void;
  deleteChat: (id: string) => Promise<void>;
}


// Configures axios to send cookies
axios.defaults.withCredentials = true;
const API_BASE = "http://127.0.0.1:5000/api/chats";

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(API_BASE);
      set({ chats: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch chats", err);
      set({ isLoading: false });
    }
  },

  createChat: async (data) => {
    try {
      const response = await axios.post(API_BASE, data);
      const newChat = response.data;
      // Prepends to array and sets as active
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id,
      }));
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  },

  setActiveChat: (id) => set({ activeChatId: id }),

  deleteChat: async (id) => {
    try {
      // Executes API call for permanent deletion
      await axios.delete(`${API_BASE}/${id}`);
      
      // Updates local state
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId,
      }));
    } catch (err) {
      console.error("Failed to delete chat permanently", err);
      // Note: User alerts can be added here, currently skipped to maintain clean UI
    }
  },
}));


