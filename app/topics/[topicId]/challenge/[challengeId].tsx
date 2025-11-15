import {
  awardXP,
  getChallengeById,
  saveProgress,
  validateAnswer,
} from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChallengeScreen = () => {
  const { topicId, challengeId } = useLocalSearchParams<{
    topicId: string;
    challengeId: string;
  }>();
  const { user, fetchAuthenticatedUser } = useAuthStore();
  const router = useRouter();

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const loadChallenge = async () => {
    try {
      setLoading(true);
      const data = await getChallengeById(challengeId!);
      setChallenge(data);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load challenge");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      Alert.alert("No Answer", "Please select an answer before submitting");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate answer
      const correct = validateAnswer(selectedAnswer, challenge.correctAnswer);
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        // Award XP and save progress
        const result = await awardXP(user.userId, challenge.xpReward);
        await saveProgress(user.userId, challengeId!, topicId!, true, 100);

        // Refresh user data
        await fetchAuthenticatedUser();

        // Show success
        Alert.alert(
          "🎉 Correct!",
          `${challenge.explanation}\n\n+${challenge.xpReward} XP earned!${
            result.leveledUp
              ? `\n\n🎊 Level Up! You're now level ${result.newLevel}!`
              : ""
          }`,
          [
            {
              text: "Next Challenge",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        // Save failed attempt
        await saveProgress(user.userId, challengeId!, topicId!, false, 0);

        Alert.alert(
          "❌ Incorrect",
          `${challenge.explanation}\n\nTry again to earn XP!`,
          [
            {
              text: "Try Again",
              onPress: () => {
                setSelectedAnswer(null);
                setShowResult(false);
              },
            },
            {
              text: "Back to Topic",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit answer");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg font-bold">
            Challenge not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="flex-1">
        <View className="p-5">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View
                className={`px-3 py-1 rounded-full ${
                  challenge.difficulty === "easy"
                    ? "bg-green-100"
                    : challenge.difficulty === "medium"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    challenge.difficulty === "easy"
                      ? "text-green-700"
                      : challenge.difficulty === "medium"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {challenge.difficulty.toUpperCase()}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-blue-600">
                +{challenge.xpReward} XP
              </Text>
            </View>

            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {challenge.title}
            </Text>
            <Text className="text-sm text-gray-600">
              {challenge.description}
            </Text>
          </View>

          {/* Question */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <Text className="text-base font-medium text-gray-900 leading-6">
              {challenge.content.question}
            </Text>
          </View>

          {/* Options */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Select your answer:
            </Text>
            {challenge.content.options.map((option: string, index: number) => (
              <Pressable
                key={index}
                onPress={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`p-4 mb-3 rounded-xl border-2 ${
                  selectedAnswer === option
                    ? showResult
                      ? isCorrect
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50 border-red-500"
                      : "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200"
                }`}
                style={({ pressed }) => [
                  { opacity: pressed && !showResult ? 0.7 : 1 },
                ]}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedAnswer === option
                        ? showResult
                          ? isCorrect
                            ? "border-green-500 bg-green-500"
                            : "border-red-500 bg-red-500"
                          : "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === option && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-base text-gray-900 flex-1">
                    {option}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && !showResult && (
            <View className="bg-yellow-50 rounded-xl p-4 mb-6 border border-yellow-200">
              <Text className="text-sm font-bold text-yellow-800 mb-2">
                💡 Hints:
              </Text>
              {challenge.hints.map((hint: string, index: number) => (
                <Text key={index} className="text-sm text-yellow-700 mb-1">
                  • {hint}
                </Text>
              ))}
            </View>
          )}

          {/* Submit Button */}
          {!showResult && (
            <Pressable
              onPress={handleSubmit}
              disabled={!selectedAnswer || isSubmitting}
              className={`py-4 rounded-xl ${
                selectedAnswer && !isSubmitting ? "bg-blue-600" : "bg-gray-300"
              }`}
              style={({ pressed }) => [
                { opacity: pressed && selectedAnswer ? 0.8 : 1 },
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Submit Answer
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChallengeScreen;
