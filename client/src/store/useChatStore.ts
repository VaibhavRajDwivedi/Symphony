import { create } from "zustand";
import axios from "axios";
import { env } from "../config/env";

export interface ChatSession {
  id: string;
  userId: string;
  title: string | null;
  mode: string;
  promptText: string | null;
  playlistUrl: string | null;
  tracks: any[] | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  isLoading: boolean;
  fetchChats: () => Promise<void>;
  createChat: (data: { title?: string; mode: string; promptText?: string; playlistUrl?: string; tracks?: any[] }) => Promise<void>;
  setActiveChat: (id: string | null) => void;
  deleteChat: (id: string) => Promise<void>;
}

const getToken = () => localStorage.getItem("auth_token");
const API_BASE = `${env.NEXT_PUBLIC_API_URL}/api/chats`;

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  isLoading: false,

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const token = getToken();
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ chats: response.data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch chats", err);
      set({ isLoading: false });
    }
  },

  createChat: async (data) => {
    try {
      const token = getToken();
      const response = await axios.post(API_BASE, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newChat = response.data;
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
      const token = getToken();
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId,
      }));
    } catch (err) {
      console.error("Failed to delete chat permanently", err);
    }
  },
}));
