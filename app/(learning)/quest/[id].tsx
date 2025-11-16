import useAuthStore from "@/store/auth.store";
import useQuestStore from "@/store/quest.store";
import cn from "clsx";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QuestDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    currentQuest,
    loadQuest,
    isLoading,
    showCompletionOverlay,
    completionData,
    hideCompletionOverlay,
    checkAndCompleteQuest,
  } = useQuestStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id && user) {
      loadQuest(id);
      // Delay quest completion check to prevent interference with challenge completion modal
      setTimeout(() => {
        checkAndCompleteQuest(user.userId, id);
      }, 100000);
    }
  }, [checkAndCompleteQuest, id, loadQuest, user]);

  if (isLoading || !currentQuest) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-black mt-4">Loading quest...</Text>
      </SafeAreaView>
    );
  }

  const completedChallenges = user?.completedChallenges || [];
  const questChallenges = currentQuest.challengeIds || [];
  const completedCount = questChallenges.filter((cId) =>
    completedChallenges.includes(cId)
  ).length;
  const progressPercentage = (completedCount / questChallenges.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-400 text-sm">← Back</Text>
        </TouchableOpacity>
        <View className="flex-row items-start justify-between mb-4">
          <Text className="text-black text-2xl font-bold flex-1 mr-4">
            {currentQuest.title}
          </Text>
          <View className="bg-cyan-500/20 px-4 py-2 rounded-full">
            <Text className="text-cyan-400 text-sm font-semibold">
              {currentQuest.totalXP} XP
            </Text>
          </View>
        </View>
        <View className="mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 text-sm">Quest Progress</Text>
            <Text className="text-gray-600 text-sm">
              {completedCount}/{questChallenges.length} challenges
            </Text>
          </View>
          <View className="w-full h-3 bg-gray-500 rounded-full overflow-hidden border border-gray-700">
            <View
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>
        <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <Text className="text-blue-400 text-xs font-semibold mb-2">
            📖 STORY
          </Text>
          <Text className="text-black text-base leading-6">
            {currentQuest.narrative}
          </Text>
        </View>
        {currentQuest.objectives && currentQuest.objectives.length > 0 && (
          <View className="mb-6">
            <Text className="text-black text-lg font-bold mb-3">
              Objectives
            </Text>
            {currentQuest.objectives.map((objective, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-cyan-400 mr-2">•</Text>
                <Text className="text-gray-600 text-sm flex-1">
                  {objective}
                </Text>
              </View>
            ))}
          </View>
        )}
        {currentQuest.theoryContent && (
          <TouchableOpacity
            onPress={() => router.push(`/theory/${currentQuest.$id}` as any)}
            className="bg-gray-400 border border-gray-700 rounded-lg p-4 mb-6"
          >
            <Text className="text-yellow-400 text-xs font-semibold mb-2">
              💡 THEORY
            </Text>
            <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
              {(() => {
                try {
                  const content =
                    typeof currentQuest.theoryContent === "string"
                      ? JSON.parse(currentQuest.theoryContent)
                      : currentQuest.theoryContent;
                  return (
                    content.content || "Learn the theory behind this quest"
                  );
                } catch {
                  return typeof currentQuest.theoryContent === "string"
                    ? currentQuest.theoryContent
                    : "Learn the theory behind this quest";
                }
              })()}
            </Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-blue-400 text-sm">Read full theory</Text>
              <Text className="text-blue-400 text-sm ml-1">→</Text>
            </View>
          </TouchableOpacity>
        )}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">
            Challenges ({completedCount}/{questChallenges.length})
          </Text>
          {questChallenges.map((challengeId, index) => {
            const isCompleted = completedChallenges.includes(challengeId);
            const isLocked =
              index > 0 &&
              !completedChallenges.includes(questChallenges[index - 1]);

            return (
              <TouchableOpacity
                key={challengeId}
                onPress={() => {
                  if (!isLocked) {
                    router.push(`/challenge/${challengeId}`);
                  }
                }}
                disabled={isLocked}
                className={cn(
                  "flex-row items-center justify-between p-4 mb-3 rounded-lg border-2",
                  isCompleted && "bg-green-500/10 border-green-500/30",
                  !isCompleted && !isLocked && "bg-gray-400 border-gray-400",
                  isLocked && "bg-gray-700/50 border-gray-700/50"
                )}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={cn(
                      "w-8 h-8 rounded-full items-center justify-center mr-3",
                      isCompleted && "bg-green-500",
                      !isCompleted && !isLocked && "bg-blue-500",
                      isLocked && "bg-gray-700"
                    )}
                  >
                    <Text className="text-black text-sm font-bold">
                      {isCompleted ? "✓" : isLocked ? "🔒" : index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={cn(
                        "text-sm font-semibold",
                        isCompleted && "text-green-400",
                        !isCompleted && !isLocked && "text-black",
                        isLocked && "text-gray-500"
                      )}
                    >
                      Challenge {index + 1}
                    </Text>
                    {isLocked && (
                      <Text className="text-gray-600 text-xs">
                        Complete previous challenge
                      </Text>
                    )}
                  </View>
                </View>
                {!isLocked && <Text className="text-blue-400 text-sm">→</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestDetail;
