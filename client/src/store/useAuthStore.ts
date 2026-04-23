import { create } from "zustand";
import axios from "axios";
import { env } from "../config/env";

export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  spotifyAccessToken: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  fetchMe: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
  setSpotifyConnected: (token: string) => void;
}

// Configures axios to send cookies
axios.defaults.withCredentials = true;
const API_BASE = `${env.NEXT_PUBLIC_API_URL}/api/auth/google`;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_BASE}/me`);
      set({ user: response.data, isLoading: false, isInitialized: true });
    } catch (err) {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  login: () => {
  window.location.href = "https://symphony-faql.onrender.com/api/auth/google";
},

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_BASE}/logout`);
      set({ user: null, isLoading: false });
    } catch (err) {
      console.error("Logout failed", err);
      set({ isLoading: false });
    }
  },

  setSpotifyConnected: (token: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, spotifyAccessToken: token } : null,
    }));
  },
}));
