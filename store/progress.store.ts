import { getAllDomains } from "@/lib/appwrite";
import { Challenge, Domain, Topic, UserProgress } from "@/type";
import { create } from "zustand";

type ProgressState = {
  domains: Domain[];
  currentDomain: Domain | null;
  currentTopic: Topic | null;
  userProgress: UserProgress[];
  isLoading: boolean;
  error: string | null;
  topics: Topic[];
  challenges: Challenge[];

  setDomains: (domains: Domain[]) => void;
  setCurrentDomain: (domain: Domain | null) => void;
  setCurrentTopic: (topic: Topic | null) => void;
  addUserProgress: (progress: UserProgress) => void;
  setError: (error: string | null) => void;
  setTopics: (topics: Topic[]) => void;
  setChallenges: (challenges: Challenge[]) => void;

  fetchDomains: () => Promise<void>;
  fetchTopicsByDomain: (domainId: string) => Promise<void>;
  fetchTopicById: (topicId: string) => Promise<void>;
  fetchChallengesByTopic: (topicId: string) => Promise<void>;
};

const useProgressStore = create<ProgressState>((set) => ({
  domains: [],
  currentDomain: null,
  currentTopic: null,
  userProgress: [],
  isLoading: false,
  error: null,
  topics: [],
  challenges: [],

  setDomains: (domains) => set({ domains }),
  setCurrentDomain: (domain) => set({ currentDomain: domain }),
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  setError: (error) => set({ error }),
  addUserProgress: (progress) =>
    set((state) => ({
      userProgress: [...state.userProgress, progress],
    })),
  setTopics: (topics) => set({ topics }),
  setChallenges: (challenges) => set({ challenges }),

  fetchDomains: async () => {
    set({ isLoading: true, error: null });

    try {
      const domainData = await getAllDomains();
      set({
        domains: domainData as Domain[],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error in fetchDomains", error);
      set({
        error: error.message || "Failed to fetch domains",
        isLoading: false,
        domains: [],
      });
    }
  },

  fetchTopicsByDomain: async (domainId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { getTopicsByDomain } = await import("@/lib/appwrite");
      const topicData = await getTopicsByDomain(domainId);
      set({ topics: topicData as Topic[], isLoading: false, error: null });
    } catch (error: any) {
      set({
        error: error.message || "Failed to load topics",
        isLoading: false,
        topics: [],
      });
    }
  },

  fetchTopicById: async (topicId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { getTopicById } = await import("@/lib/appwrite");
      const topic = await getTopicById(topicId);
      set({ currentTopic: topic as Topic, isLoading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching topic:", error);
      set({ 
        error: `Topic not found: ${error.message || "Failed to load topic"}`, 
        isLoading: false,
        currentTopic: null 
      });
    }
  },

  fetchChallengesByTopic: async (topicId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { getChallengesByTopic } = await import("@/lib/appwrite");
      const challengeData = await getChallengesByTopic(topicId);
      set({
        challenges: challengeData as Challenge[],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to load challenges",
        isLoading: false,
        challenges: [],
      });
    }
  },
}));

export default useProgressStore;
