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

const API_BASE = `${env.NEXT_PUBLIC_API_URL}/api/auth/google`;

const getToken = () => localStorage.getItem("auth_token");

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  fetchMe: async () => {
    set({ isLoading: true });
    // Pick up token from URL after Google redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("auth_token", urlToken);
      window.history.replaceState({}, "", window.location.pathname);
    }
    const token = getToken();
    if (!token) {
      set({ user: null, isLoading: false, isInitialized: true });
      return;
    }
    try {
      const response = await axios.get(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data, isLoading: false, isInitialized: true });
    } catch {
      localStorage.removeItem("auth_token");
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },

  login: () => {
    window.location.href = API_BASE;
  },

  logout: async () => {
    localStorage.removeItem("auth_token");
    set({ user: null });
  },

  setSpotifyConnected: (token: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, spotifyAccessToken: token } : null,
    }));
  },
}));