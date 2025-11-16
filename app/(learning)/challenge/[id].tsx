import PatternChallenge from "@/componets/PatternChallenge";
import ScenarioChallenge from "@/componets/ScenarioChallenge";
import VisualChallenge from "@/componets/VisualChallenge";
import { awardXP, updateStreak } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import useChallengeStore from "@/store/challenge.store";
import useProgressStore from "@/store/progress.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChallengeScreen = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();

  const {
    currentChallenge,
    loadChallenge,
    requestHint,
    hints,
    isLoading: challengeLoading,
    resetChallenge,
  } = useChallengeStore();

  const { trackAttempt } = useProgressStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      loadChallenge(id);
    }

    return () => {
      resetChallenge();
    };
  }, [id, loadChallenge, resetChallenge]);

  const handleSubmit = async (isCorrect: boolean, selectedAnswer: any) => {
    if (!currentChallenge || !user) return;

    // Track the attempt
    const topicId =
      typeof currentChallenge.topicId === "string"
        ? currentChallenge.topicId
        : (currentChallenge.topicId as any)?.$id || currentChallenge.topicId;

    await trackAttempt(
      user.userId,
      currentChallenge.$id,
      topicId,
      isCorrect,
      isCorrect ? 100 : 0
    );

    if (isCorrect) {
      try {
        // Award XP
        await awardXP(user.userId, currentChallenge.xpReward);

        // Update streak for completing a challenge
        const streakResult = await updateStreak(user.userId);

        // Show streak feedback
        if (streakResult.streakIncremented) {
          if (streakResult.isNewStreak) {
            Alert.alert(
              "🔥 Streak Started!",
              "You've started a new learning streak! Complete challenges daily to keep it going.",
              [{ text: "Great!", style: "default" }]
            );
          } else {
            Alert.alert(
              "🔥 Streak Continued!",
              `Amazing! You're on a ${streakResult.streak}-day streak. Keep it up!`,
              [{ text: "Awesome!", style: "default" }]
            );
          }
        }

        // Refresh user data to update completedChallenges and streak
        await useAuthStore.getState().fetchAuthenticatedUser();

        if (router.canGoBack()) {
          router.back();
        } else {
          router.push(`/quest/${currentChallenge.questId}`);
        }
      } catch (error) {
        console.error("Error updating progress:", error);
        // Still navigate back even if streak update fails
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push(`/quest/${currentChallenge.questId}`);
        }
      }
    }
  };

  const handleRequestHint = () => {
    requestHint();
  };

  if (challengeLoading || !currentChallenge) {
    return (
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center">
          <View className="bg-white/95 border border-white/30 shadow-lg rounded-2xl p-8 items-center">
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="text-gray-800 mt-4 text-lg font-medium">
              Loading challenge...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Render appropriate challenge component based on type
  const renderChallenge = () => {
    switch (currentChallenge.type) {
      case "multiple-choice":
        return (
          <ScenarioChallenge
            challenge={currentChallenge}
            onSubmit={handleSubmit}
            onRequestHint={handleRequestHint}
            hints={hints}
            isLoading={challengeLoading}
          />
        );

      case "pattern-recognition":
        return (
          <PatternChallenge
            challenge={currentChallenge as any}
            onSubmit={handleSubmit}
            onRequestHint={handleRequestHint}
            hints={hints}
            isLoading={challengeLoading}
          />
        );

      case "visual-builder":
        return (
          <VisualChallenge
            challenge={currentChallenge as any}
            onSubmit={handleSubmit}
            onRequestHint={handleRequestHint}
            hints={hints}
            isLoading={challengeLoading}
          />
        );

      default:
        return (
          <View className="flex-1 items-center justify-center p-4">
            <View className="bg-white/95 border border-white/30 shadow-lg rounded-2xl p-8">
              <Text className="text-gray-800 text-center text-lg">
                Challenge type &quot;{currentChallenge.type}&quot; not yet
                implemented
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1">{renderChallenge()}</SafeAreaView>
    </View>
  );
};
export default ChallengeScreen;
