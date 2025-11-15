import { create } from "zustand";
// Created using Cline

interface AnimationState {
  xpGain: { visible: boolean; amount: number };
  levelUp: { visible: boolean; newLevel: number };
  rankUp: { visible: boolean; newRank: string };
  celebration: { visible: boolean; type: string };

  showXPGain: (amount: number) => void;
  hideXPGain: () => void;
  showLevelUp: (newLevel: number) => void;
  hideLevelUp: () => void;
  showRankUp: (newRank: string) => void;
  hideRankUp: () => void;
  showCelebration: (type: string) => void;
  hideCelebration: () => void;
}

const useAnimationStore = create<AnimationState>((set) => ({
  xpGain: { visible: false, amount: 0 },
  levelUp: { visible: false, newLevel: 0 },
  rankUp: { visible: false, newRank: "" },
  celebration: { visible: false, type: "" },

  showXPGain: (amount) => set({ xpGain: { visible: true, amount } }),

  hideXPGain: () => set({ xpGain: { visible: false, amount: 0 } }),

  showLevelUp: (newLevel) => set({ levelUp: { visible: true, newLevel } }),

  hideLevelUp: () => set({ levelUp: { visible: false, newLevel: 0 } }),

  showRankUp: (newRank) => set({ rankUp: { visible: true, newRank } }),

  hideRankUp: () => set({ rankUp: { visible: false, newRank: "" } }),

  showCelebration: (type) => set({ celebration: { visible: true, type } }),

  hideCelebration: () => set({ celebration: { visible: false, type: "" } }),
}));

export default useAnimationStore;
