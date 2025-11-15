import { saveProgress, updateStreak } from "@/lib/appwrite";
import { create } from "zustand";

interface ProgressState {
  completedChallenges: string[];
  streak: number;
  lastActivityDate: string;
  isLoading: boolean;

  trackAttempt: (
    userId: string,
    challengeId: string,
    topicId: string,
    success: boolean,
    score?: number
  ) => Promise<void>;
  updateUserStreak: (userId: string) => Promise<void>;
  loadUserProgress: (userId: string) => Promise<void>;
  resetProgress: () => void;
}

const useProgressStore = create<ProgressState>((set, get) => ({
  // Initial state
  completedChallenges: [],
  streak: 0,
  lastActivityDate: "",
  isLoading: false,

  // Track a challenge attempt
  trackAttempt: async (
    userId: string,
    challengeId: string,
    topicId: string,
    success: boolean,
    score: number = 100
  ) => {
    set({ isLoading: true });
    try {
      await saveProgress(userId, challengeId, topicId, success, score);

      // If successful, add to completed challenges
      if (success) {
        set((state) => ({
          completedChallenges: [...state.completedChallenges, challengeId],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error tracking attempt:", error);
      set({ isLoading: false });
    }
  },

  updateUserStreak: async (userId: string) => {
    try {
      const result = await updateStreak(userId);
      set({
        streak: result.streak,
      });
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  },

  loadUserProgress: async (userId: string) => {
    set({ isLoading: true });
    try {
      set({ isLoading: false });
    } catch (error) {
      console.error("Error loading progress:", error);
      set({ isLoading: false });
    }
  },

  resetProgress: () => {
    set({
      completedChallenges: [],
      streak: 0,
      lastActivityDate: "",
      isLoading: false,
    });
  },
}));

export default useProgressStore;
