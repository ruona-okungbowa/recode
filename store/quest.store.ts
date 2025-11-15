import { completeQuest, getQuestById, getQuestsByTopic } from "@/lib/appwrite";
import { Quest } from "@/type";
import { create } from "zustand";

interface QuestState {
  currentQuest: Quest | null;
  unlockedQuests: string[];
  completedQuests: string[];
  isLoading: boolean;
  error: string | null;

  loadQuest: (questId: string) => Promise<void>;
  loadQuestsByTopic: (topicId: string) => Promise<Quest[]>;
  completeCurrentQuest: (userId: string) => Promise<void>;
  setUnlockedQuests: (questIds: string[]) => void;
  setCompletedQuests: (questIds: string[]) => void;
  resetQuest: () => void;
}

const useQuestStore = create<QuestState>((set, get) => ({
  currentQuest: null,
  unlockedQuests: [],
  completedQuests: [],
  isLoading: false,
  error: null,

  loadQuest: async (questId: string) => {
    set({ isLoading: true, error: null });
    try {
      const quest = await getQuestById(questId);
      set({
        currentQuest: quest as Quest,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Failed to load quest",
        isLoading: false,
      });
      console.error("Error loading quest:", error);
    }
  },

  loadQuestsByTopic: async (topicId: string) => {
    set({ isLoading: true, error: null });
    try {
      const quests = await getQuestsByTopic(topicId);
      set({ isLoading: false });
      return quests as Quest[];
    } catch (error) {
      set({
        error: "Failed to load quests",
        isLoading: false,
      });
      console.error("Error loading quests:", error);
      return [];
    }
  },

  completeCurrentQuest: async (userId: string) => {
    const { currentQuest } = get();
    if (!currentQuest) return;

    set({ isLoading: true });
    try {
      await completeQuest(userId, currentQuest.$id);
      set((state) => ({
        completedQuests: [...state.completedQuests, currentQuest.$id],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error completing quest:", error);
      set({ isLoading: false });
    }
  },

  setUnlockedQuests: (questIds: string[]) => {
    set({ unlockedQuests: questIds });
  },

  setCompletedQuests: (questIds: string[]) => {
    set({ completedQuests: questIds });
  },

  resetQuest: () => {
    set({
      currentQuest: null,
      unlockedQuests: [],
      completedQuests: [],
      isLoading: false,
      error: null,
    });
  },
}));

export default useQuestStore;
