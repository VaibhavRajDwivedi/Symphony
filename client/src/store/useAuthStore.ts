import { create } from "zustand";
import axios from "axios";

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

// 1. Set global axios config
axios.defaults.withCredentials = true;

// 2. Use the Hardcoded Render Base for production stability
const API_BASE = "https://symphony-faql.onrender.com/api/auth/google";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      // 3. Explicitly request with credentials
      const response = await axios.get(`${API_BASE}/me`, { withCredentials: true });
      set({ user: response.data, isLoading: false, isInitialized: true });
    } catch (err) {
      console.error("Auth check failed:", err);
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  login: () => {
    // 4. Trigger the redirect to the backend
    window.location.href = API_BASE;
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
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