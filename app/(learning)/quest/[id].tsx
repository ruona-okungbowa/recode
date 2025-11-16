import GlassCard from "@/componets/GlassCard";
import useAuthStore from "@/store/auth.store";
import useQuestStore from "@/store/quest.store";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  Target,
  Trophy,
  Zap,
} from "lucide-react-native";
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
  const { currentQuest, loadQuest, isLoading, checkAndCompleteQuest } =
    useQuestStore();
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
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center">
          <GlassCard className="p-8 items-center">
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="text-gray-800 mt-4 text-lg font-medium">
              Loading quest...
            </Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  const completedChallenges = user?.completedChallenges || [];
  const questChallenges = currentQuest.challengeIds || [];
  const completedCount = questChallenges.filter((cId) =>
    completedChallenges.includes(cId)
  ).length;
  const progressPercentage = (completedCount / questChallenges.length) * 100;

  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center"
            >
              <ArrowLeft color="white" size={20} />
            </TouchableOpacity>

            <View className="flex-1 ml-4">
              <Text className="text-white text-xl font-bold">
                {currentQuest.title}
              </Text>
              <View className="flex-row items-center mt-2">
                <Zap color="#fbbf24" size={16} />
                <Text className="text-yellow-300 text-sm font-semibold ml-1">
                  {currentQuest.totalXP} XP Total
                </Text>
              </View>
            </View>
          </View>

          {/* Quest Overview Card */}
          <View className="mb-6 p-6 bg-white rounded-2xl shadow-lg">
            {/* Progress Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Trophy color="#667eea" size={24} />
                  <Text className="text-gray-800 text-lg font-bold ml-3">
                    Quest Progress
                  </Text>
                </View>
                <Text className="text-gray-600 text-sm font-semibold">
                  {completedCount}/{questChallenges.length} challenges
                </Text>
              </View>

              <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#4facfe", "#00f2fe"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-full rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </View>

              <Text className="text-gray-600 text-xs text-center mt-2">
                {Math.round(progressPercentage)}% complete
              </Text>
            </View>

            {/* Story Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <BookOpen color="#667eea" size={24} />
                <Text className="text-gray-800 text-lg font-bold ml-3">
                  Story
                </Text>
              </View>
              <Text className="text-gray-700 text-base leading-6">
                {currentQuest.narrative}
              </Text>
            </View>

            {/* Objectives Section */}
            {currentQuest.objectives && currentQuest.objectives.length > 0 && (
              <View>
                <View className="flex-row items-center mb-4">
                  <Target color="#667eea" size={24} />
                  <Text className="text-gray-800 text-lg font-bold ml-3">
                    Objectives
                  </Text>
                </View>
                {currentQuest.objectives.map((objective, index) => (
                  <View
                    key={index}
                    className={`flex-row items-start ${
                      index < currentQuest.objectives.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    <View className="w-6 h-6 bg-blue-500/20 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Text className="text-blue-600 text-xs font-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-gray-700 text-sm flex-1 leading-5">
                      {objective}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Theory Section */}
          {currentQuest.theoryContent && (
            <TouchableOpacity
              onPress={() => router.push(`/theory/${currentQuest.$id}`)}
              className="mb-6 overflow-hidden rounded-2xl"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#f59e0b", "#fbbf24"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5"
              >
                <View className="flex-row items-center mb-3 p-3 m-3">
                  <BookOpen color="white" size={24} />
                  <Text className="text-white text-lg font-bold ml-3">
                    Theory Content
                  </Text>
                </View>
                <Text
                  className="text-white/90 text-sm leading-5 mb-3 p-3 m-3"
                  numberOfLines={3}
                >
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
                <View className="flex-row items-center">
                  <Text className="text-white text-sm font-semibold mb-3 p-3 m-3">
                    Read full theory
                  </Text>
                  <Text className="text-white text-sm ml-2">→</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Challenges Section */}
          <GlassCard className="p-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Target color="#667eea" size={24} />
                <Text className="text-gray-800 text-xl font-bold ml-3">
                  Challenges
                </Text>
              </View>
              <View className="bg-blue-500/20 rounded-full px-3 py-1">
                <Text className="text-blue-600 text-sm font-bold">
                  {completedCount}/{questChallenges.length}
                </Text>
              </View>
            </View>

            <View style={{ gap: 12 }}>
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
                    className="overflow-hidden rounded-2xl"
                    activeOpacity={isLocked ? 0.5 : 0.8}
                  >
                    <LinearGradient
                      colors={
                        isCompleted
                          ? ["#10b981", "#34d399"]
                          : isLocked
                          ? ["#6b7280", "#9ca3af"]
                          : ["#667eea", "#764ba2"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="p-4"
                    >
                      <View className="flex-row items-center justify-between mb-1 p-1 m-1">
                        <View className="flex-row items-center flex-1">
                          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-4">
                            {isCompleted ? (
                              <CheckCircle color="white" size={20} />
                            ) : isLocked ? (
                              <Lock color="white" size={20} />
                            ) : (
                              <Text className="text-white text-sm font-bold">
                                {index + 1}
                              </Text>
                            )}
                          </View>
                          <View className="flex-1">
                            <Text className="text-white text-base font-bold">
                              Challenge {index + 1}
                            </Text>
                            {isLocked && (
                              <Text className="text-white/80 text-xs mt-1">
                                Complete previous challenge to unlock
                              </Text>
                            )}
                            {isCompleted && (
                              <Text className="text-white/80 text-xs mt-1">
                                ✓ Completed
                              </Text>
                            )}
                          </View>
                        </View>
                        {!isLocked && (
                          <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center">
                            <Text className="text-white text-sm">▶</Text>
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default QuestDetail;
