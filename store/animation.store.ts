import { create } from "zustand";
// Created using Cline

interface AnimationState {
  showingXPGain: boolean;
  xpGainAmount: number;
  showingLevelUp: boolean;
  newLevel: number;
  showingRankUp: boolean;
  newRank: string;
  showingCelebration: boolean;
  celebrationType: "challenge" | "quest" | "streak" | null;

  showXPGain: (amount: number) => void;
  hideXPGain: () => void;
  showLevelUp: (level: number) => void;
  hideLevelUp: () => void;
  showRankUp: (rank: string) => void;
  hideRankUp: () => void;
  showCelebration: (type: "challenge" | "quest" | "streak") => void;
  hideCelebration: () => void;
  resetAnimations: () => void;
}

const useAnimationStore = create<AnimationState>((set) => ({
  showingXPGain: false,
  xpGainAmount: 0,
  showingLevelUp: false,
  newLevel: 0,
  showingRankUp: false,
  newRank: "",
  showingCelebration: false,
  celebrationType: null,

  // Show XP gain animation
  showXPGain: (amount: number) => {
    set({
      showingXPGain: true,
      xpGainAmount: amount,
    });

    setTimeout(() => {
      set({ showingXPGain: false });
    }, 2000);
  },

  hideXPGain: () => {
    set({ showingXPGain: false });
  },

  // Show level up animation
  showLevelUp: (level: number) => {
    set({
      showingLevelUp: true,
      newLevel: level,
    });
  },

  hideLevelUp: () => {
    set({ showingLevelUp: false });
  },

  // Show rank up animation
  showRankUp: (rank: string) => {
    set({
      showingRankUp: true,
      newRank: rank,
    });
  },

  hideRankUp: () => {
    set({ showingRankUp: false });
  },

  // Show celebration animation
  showCelebration: (type: "challenge" | "quest" | "streak") => {
    set({
      showingCelebration: true,
      celebrationType: type,
    });

    setTimeout(() => {
      set({ showingCelebration: false, celebrationType: null });
    }, 3000);
  },

  hideCelebration: () => {
    set({ showingCelebration: false, celebrationType: null });
  },

  // Reset all animations
  resetAnimations: () => {
    set({
      showingXPGain: false,
      xpGainAmount: 0,
      showingLevelUp: false,
      newLevel: 0,
      showingRankUp: false,
      newRank: "",
      showingCelebration: false,
      celebrationType: null,
    });
  },
}));

export default useAnimationStore;
