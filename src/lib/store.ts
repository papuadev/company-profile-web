import { create } from 'zustand';
import Backendless from './backendless';

interface AuthState {
  user: Backendless.User | null;
  isLoading: boolean;
  setUser: (user: Backendless.User | null) => void;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  checkSession: async () => {
    if (get().user) {
      set({ isLoading: false });
      return;
    }
    try {
      set({ isLoading: true });
      const isValid = await Backendless.UserService.isValidLogin();
      if (isValid) {
        const currentUser = await Backendless.UserService.getCurrentUser();
        if (currentUser) {
          set({ user: currentUser });
        } else {
          set({ user: null });
        }
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Session check failed", error);
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await Backendless.UserService.logout();
      set({ user: null });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }
}));
