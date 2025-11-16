import { create } from "zustand";
// Created using Cline

interface AnimationState {
  celebration: { visible: boolean; type: string };

  showCelebration: (type: string) => void;
  hideCelebration: () => void;
}

const useAnimationStore = create<AnimationState>((set) => ({
  celebration: { visible: false, type: "" },

  showCelebration: (type) => set({ celebration: { visible: true, type } }),

  hideCelebration: () => set({ celebration: { visible: false, type: "" } }),
}));

export default useAnimationStore;
