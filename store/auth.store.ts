import { account, createUser, getCurrentUser, signIn } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signInUser: (email: string, password: string) => Promise<void>;
  signUpUser: (name: string, email: string, password: string) => Promise<void>;
  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  signInUser: async (email, password) => {
    set({ isLoading: true });
    try {
      const account = await signIn({ email, password });
      const user = await getCurrentUser();
      set({ isAuthenticated: true, user: user as User });
    } catch (err) {
      console.error("Login failed:", err);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  signUpUser: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const account = await createUser({ name, email, password });
      const user = await getCurrentUser();
      set({ isAuthenticated: true, user: user as User });
    } catch (err) {
      console.error("Signup failed:", err);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  signOutUser: async () => {
    try {
      await account.deleteSession("current");
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Sign out error:", error);
      throw new Error("Failed to sign out");
    }
  },

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const session = await account.getSession("current");
      if (session) {
        const user = await getCurrentUser();
        set({ isAuthenticated: true, user: user as User });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
