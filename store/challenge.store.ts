import { getChallengeById } from "@/lib/appwrite";
import { Challenge } from "@/type";
import { create } from "zustand";

interface ChallengeState {
  currentChallenge: Challenge | null;
  attempts: number;
  startTime: number;
  hints: string[];
  isLoading: boolean;
  error: string | null;

  loadChallenge: (challengeId: string) => Promise<void>;
  submitSolution: (solution: any) => boolean;
  requestHint: () => void;
  incrementAttempts: () => void;
  resetChallenge: () => void;
}

const useChallengeStore = create<ChallengeState>((set, get) => ({
  currentChallenge: null,
  attempts: 0,
  startTime: 0,
  hints: [],
  isLoading: false,
  error: null,

  loadChallenge: async (challengeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const challenge = await getChallengeById(challengeId);

      let parsedHints: string[] = [];
      if (challenge.hints) {
        if (typeof challenge.hints === "string") {
          try {
            parsedHints = JSON.parse(challenge.hints);
          } catch {
            parsedHints = [challenge.hints];
          }
        } else if (Array.isArray(challenge.hints)) {
          parsedHints = challenge.hints;
        }
      }

      set({
        currentChallenge: {
          ...challenge,
          hints: parsedHints,
        } as Challenge,
        attempts: 0,
        startTime: Date.now(),
        hints: [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Failed to load challenge",
        isLoading: false,
      });
      console.error("Error loading challenge:", error);
    }
  },

  submitSolution: (solution: any) => {
    const { currentChallenge } = get();
    if (!currentChallenge) return false;

    set((state) => ({ attempts: state.attempts + 1 }));

    let correctAnswer = currentChallenge.correctAnswer;
    if (typeof correctAnswer === "string") {
      try {
        correctAnswer = JSON.parse(correctAnswer);
      } catch (error) {
        console.error(error as string);
      }
    }

    const isCorrect =
      JSON.stringify(solution) === JSON.stringify(correctAnswer);

    return isCorrect;
  },

  requestHint: () => {
    const { currentChallenge, hints } = get();
    if (!currentChallenge) return;

    const availableHints = (currentChallenge as any).hints || [];

    const nextHintIndex = hints.length;

    if (nextHintIndex < availableHints.length) {
      const nextHint = availableHints[nextHintIndex];
      set((state) => ({
        hints: [...state.hints, nextHint],
      }));
    } else {
      set((state) => ({
        hints: [...state.hints, "No more hints available. Try your best!"],
      }));
    }
  },

  incrementAttempts: () => {
    set((state) => ({ attempts: state.attempts + 1 }));
  },

  resetChallenge: () => {
    set({
      currentChallenge: null,
      attempts: 0,
      startTime: 0,
      hints: [],
      isLoading: false,
      error: null,
    });
  },
}));

export default useChallengeStore;
