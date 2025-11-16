import {
  awardXP,
  checkQuestCompletion,
  completeQuest as completeQuestService,
  getQuestById,
  getQuestsByTopic,
} from "@/lib/appwrite";
import { Quest } from "@/type";
import { create } from "zustand";

interface QuestState {
  currentQuest: Quest | null;
  unlockedQuests: Quest[];
  completedQuests: string[];
  isLoading: boolean;
  error: string | null;
  showCompletionOverlay: boolean;
  completionData: {
    questTitle: string;
    totalXP: number;
    bonusXP: number;
    unlockedContent: string[];
    relatedTopics: string[];
    leetcodeProblems: any[];
  } | null;

  loadQuest: (questId: string) => Promise<void>;
  loadQuestsByTopic: (topicId: string) => Promise<Quest[]>;
  completeCurrentQuest: (userId: string, questId: string) => Promise<void>;
  completeQuest: (questId: string) => void;
  checkAndCompleteQuest: (userId: string, questId: string) => Promise<void>;
  setUnlockedQuests: (quests: Quest[]) => void;
  setCompletedQuests: (questIds: string[]) => void;
  hideCompletionOverlay: () => void;
  resetQuest: () => void;
}

const QUEST_COMPLETION_BONUS_XP = 200;

const useQuestStore = create<QuestState>((set, get) => ({
  currentQuest: null,
  unlockedQuests: [],
  completedQuests: [],
  isLoading: false,
  error: null,
  showCompletionOverlay: false,
  completionData: null,

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
    const { currentQuest, completedQuests } = get();
    if (!currentQuest) return;

    try {
      const isComplete = await checkQuestCompletion(userId, currentQuest.$id);
      if (isComplete) {
        const wasAlreadyCompleted = completedQuests.includes(currentQuest.$id);

        if (!wasAlreadyCompleted) {
          // Complete quest in database
          await completeQuestService(userId, currentQuest.$id);

          // Award bonus XP
          await awardXP(userId, QUEST_COMPLETION_BONUS_XP);

          // Prepare completion data
          const completionData = {
            questTitle: currentQuest.title,
            totalXP: currentQuest.totalXP,
            bonusXP: QUEST_COMPLETION_BONUS_XP,
            unlockedContent: [
              "Deeper theory content",
              "Advanced challenges",
              "Related topic connections",
            ],
            relatedTopics: [],
            leetcodeProblems: [
              {
                title: "Valid Parentheses",
                difficulty: "Easy",
                url: "https://leetcode.com/problems/valid-parentheses/",
              },
              {
                title: "Min Stack",
                difficulty: "Medium",
                url: "https://leetcode.com/problems/min-stack/",
              },
            ],
          };

          set({
            completedQuests: [...completedQuests, currentQuest.$id],
            showCompletionOverlay: true,
            completionData,
          });

          console.log("🎉 Quest completed!");
        } else {
          get().completeQuest(currentQuest.$id);
        }
      }
    } catch (error) {
      console.error("Error completing quest:", error);
      set({ isLoading: false });
    }
  },

  completeQuest: (questId: string) => {
    set((state) => ({
      completedQuests: [...state.completedQuests, questId],
    }));
  },

  setUnlockedQuests: (questIds: Quest[]) => {
    set({ unlockedQuests: questIds });
  },

  setCompletedQuests: (questIds: string[]) => {
    set({ completedQuests: questIds });
  },

  checkAndCompleteQuest: async (userId: string, questId: string) => {
    try {
      const { completedQuests } = get();

      // Check if already completed
      if (completedQuests.includes(questId)) {
        return;
      }

      // Check if all challenges in quest are completed
      const isComplete = await checkQuestCompletion(userId, questId);

      if (isComplete) {
        // Load the quest if not current
        const { currentQuest } = get();
        const quest =
          currentQuest?.$id === questId
            ? currentQuest
            : await getQuestById(questId);

        // Complete quest in database
        await completeQuestService(userId, questId);

        // Award bonus XP
        await awardXP(userId, QUEST_COMPLETION_BONUS_XP);

        // Prepare completion data
        const completionData = {
          questTitle: quest.title,
          totalXP: quest.totalXP,
          bonusXP: QUEST_COMPLETION_BONUS_XP,
          unlockedContent: [
            "Deeper theory content",
            "Advanced challenges",
            "Related topic connections",
          ],
          relatedTopics: [],
          leetcodeProblems: [
            {
              title: "Valid Parentheses",
              difficulty: "Easy",
              url: "https://leetcode.com/problems/valid-parentheses/",
            },
            {
              title: "Min Stack",
              difficulty: "Medium",
              url: "https://leetcode.com/problems/min-stack/",
            },
          ],
        };

        set({
          completedQuests: [...completedQuests, questId],
          showCompletionOverlay: true,
          completionData,
        });

        console.log("🎉 Quest completed!");
      }
    } catch (error) {
      console.error("Error checking quest completion:", error);
    }
  },

  hideCompletionOverlay: () => {
    console.log("Hiding quest completion overlay");
    set({ showCompletionOverlay: false, completionData: null });
  },

  resetQuest: () => {
    set({
      currentQuest: null,
      unlockedQuests: [],
      completedQuests: [],
      isLoading: false,
      error: null,
      showCompletionOverlay: false,
      completionData: null,
    });
  },
}));

export default useQuestStore;
