import useProgressStore from "@/store/content.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

console.log("🔵 TOPIC DETAIL SCREEN RENDERED");

const TopicDetailScreen = () => {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const {
    currentTopic,
    challenges,
    isLoading,
    error,
    fetchTopicById,
    fetchChallengesByTopic,
  } = useProgressStore();

  useEffect(() => {
    if (topicId) {
      fetchTopicById(topicId);
      fetchChallengesByTopic(topicId);
    }
  }, [topicId]);

  const handleChallengePress = (challengeId: string) => {
    router.push(`/challenge/${challengeId}` as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !currentTopic) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg font-bold mb-2">⚠️ Error</Text>
          <Text className="text-gray-600 text-center">
            {error || "Topic not found"}
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
            <Text className="text-3xl font-bold text-gray-900">
              {currentTopic.name}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {currentTopic.description}
            </Text>
          </View>

          {/* Theory Section */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              📚 Theory
            </Text>
            <Text className="text-gray-700 leading-6">
              {currentTopic.theoryContent}
            </Text>
          </View>

          {/* Challenges Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              🎯 Challenges ({challenges.length})
            </Text>

            {challenges.length === 0 ? (
              <View className="bg-gray-50 rounded-xl p-6 items-center">
                <Text className="text-gray-500">No challenges yet</Text>
              </View>
            ) : (
              <FlatList
                data={challenges}
                keyExtractor={(item) => item.$id || item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <Pressable
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3"
                    onPress={() => handleChallengePress(item.$id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 mb-1">
                          Challenge {index + 1}: {item.title}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <View
                            className={`px-2 py-1 rounded-full ${
                              item.difficulty === "easy"
                                ? "bg-green-100"
                                : item.difficulty === "medium"
                                ? "bg-yellow-100"
                                : "bg-red-100"
                            }`}
                          >
                            <Text
                              className={`text-xs font-semibold ${
                                item.difficulty === "easy"
                                  ? "text-green-700"
                                  : item.difficulty === "medium"
                                  ? "text-yellow-700"
                                  : "text-red-700"
                              }`}
                            >
                              {item.difficulty.toUpperCase()}
                            </Text>
                          </View>
                          <Text className="text-xs text-blue-600 font-semibold">
                            +{item.xpReward} XP
                          </Text>
                        </View>
                      </View>
                      <View className="bg-blue-500 rounded-full w-10 h-10 justify-center items-center">
                        <Text className="text-white text-lg">▶</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TopicDetailScreen;
