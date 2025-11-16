import ScenarioChallenge from "@/componets/ScenarioChallenge";
import { awardXP } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import useChallengeStore from "@/store/challenge.store";
import useProgressStore from "@/store/progress.store";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
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

  const handleSubmit = async (isCorrect: boolean, selectedAnswer: string) => {
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
      // Award XP
      await awardXP(user.userId, currentChallenge.xpReward);

      // Refresh user data to update completedChallenges
      await useAuthStore.getState().fetchAuthenticatedUser();

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push(`/quest/${currentChallenge.questId}`);
      }
    }
  };

  const handleRequestHint = () => {
    requestHint();
  };

  if (challengeLoading || !currentChallenge) {
    return (
      <LinearGradient
        colors={["#a8edea", "#fed6e3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 items-center justify-center">
          <View className="bg-white/95 border border-white/30 shadow-lg rounded-2xl p-8 items-center">
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="text-gray-800 mt-4 text-lg font-medium">
              Loading challenge...
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Only render ScenarioChallenge for multiple-choice type
  if (currentChallenge.type !== "multiple-choice") {
    return (
      <LinearGradient
        colors={["#a8edea", "#fed6e3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 items-center justify-center p-4">
          <View className="bg-white/95 border border-white/30 shadow-lg rounded-2xl p-8">
            <Text className="text-gray-800 text-center text-lg">
              Challenge type {currentChallenge.type} not yet implemented
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#a8edea", "#fed6e3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScenarioChallenge
          challenge={currentChallenge}
          onSubmit={handleSubmit}
          onRequestHint={handleRequestHint}
          hints={hints}
          isLoading={challengeLoading}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};
export default ChallengeScreen;
