import ScenarioChallenge from "@/componets/ScenarioChallenge";
import { awardXP } from "@/lib/appwrite";
import useAnimationStore from "@/store/animation.store";
import useAuthStore from "@/store/auth.store";
import useChallengeStore from "@/store/challenge.store";
import useProgressStore from "@/store/progress.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChallengeScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    currentChallenge,
    loadChallenge,
    requestHint,
    hints,
    isLoading: challengeLoading,
    attempts,
    startTime,
    resetChallenge,
  } = useChallengeStore();
  const { trackAttempt } = useProgressStore();
  const { showXPGain, showCelebration } = useAnimationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      loadChallenge(id);
    }

    return () => {
      resetChallenge();
    };
  }, [id]);

  const handleSubmit = async (isCorrect: boolean, selectedAnswer: string) => {
    if (!currentChallenge || !user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds

    // Track the attempt
    await trackAttempt(
      user.$id,
      currentChallenge.$id,
      currentChallenge.topicId,
      isCorrect,
      isCorrect ? 100 : 0
    );

    if (isCorrect) {
      // Award XP
      const result = await awardXP(user.$id, currentChallenge.xpReward);

      // Show animations
      showXPGain(currentChallenge.xpReward);
      showCelebration("challenge");

      // Check for level up
      if (result.leveledUp) {
        setTimeout(() => {
          // Show level up animation after XP gain
          useAnimationStore.getState().showLevelUp(result.newLevel);
        }, 2000);
      }
      router.back();
    }
  };

  const handleRequestHint = () => {
    requestHint();
  };

  if (challengeLoading || !currentChallenge) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-black mt-4">Loading challenge...</Text>
      </SafeAreaView>
    );
  }

  // Only render ScenarioChallenge for multiple-choice type
  if (currentChallenge.type !== "multiple-choice") {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-black text-center">
          Challenge type "{currentChallenge.type}" not yet implemented
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScenarioChallenge
        challenge={currentChallenge}
        onSubmit={handleSubmit}
        onRequestHint={handleRequestHint}
        hints={hints}
        isLoading={challengeLoading}
      />
    </SafeAreaView>
  );
};
export default ChallengeScreen;
