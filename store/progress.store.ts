import { Domain, Topic, UserProgress } from "@/type";
import { create } from "zustand";

type ProgressState = {
  domains: Domain[];
  currentDomain: Domain | null;
  currentTopic: Topic | null;
  userProgress: UserProgress[];

  setDomains: (domains: Domain[]) => void;
  setCurrentDomain: (domain: Domain | null) => void;
  setCurrentTopic: (topic: Topic | null) => void;
  addUserProgress: (progress: UserProgress) => void;
};

const useProgressStore = create<ProgressState>((set) => ({
  domains: [],
  currentDomain: null,
  currentTopic: null,
  userProgress: [],

  setDomains: (domains) => set({ domains }),
  setCurrentDomain: (domain) => set({ currentDomain: domain }),
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  addUserProgress: (progress) =>
    set((state) => ({
      userProgress: [...state.userProgress, progress],
    })),
}));

export default useProgressStore;
