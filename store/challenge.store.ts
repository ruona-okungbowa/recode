import { generateHint } from "@/lib/aiService";
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

  requestHint: async () => {
    const { currentChallenge, hints, attempts } = get();
    if (!currentChallenge) return;

    set({ isLoading: true });
    try {
      // Try AI-generated hint first
      const aiHint = await generateHint(
        currentChallenge.$id,
        currentChallenge.title,
        currentChallenge.description,
        attempts,
        currentChallenge.type
      );

      set((state) => ({
        hints: [...state.hints, aiHint],
        isLoading: false,
      }));
    } catch (error) {
      // Fallback to static hints if AI fails
      const staticHints = (currentChallenge as any).hints || [];
      const nextHint = staticHints[hints.length] || "No more hints available.";

      set((state) => ({
        hints: [...state.hints, nextHint],
        isLoading: false,
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
