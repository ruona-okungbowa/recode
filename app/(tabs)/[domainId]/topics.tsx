import useAuthStore from "@/store/auth.store";
import useProgressStore from "@/store/progress.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopicsScreen = () => {
  const { domainId } = useLocalSearchParams<{ domainId: string }>();
  const { user } = useAuthStore();
  const { topics, isLoading, error, fetchTopicsByDomain } = useProgressStore();
  const router = useRouter();

  useEffect(() => {
    if (domainId) {
      fetchTopicsByDomain(domainId);
    }
  }, [domainId]);

  const handleTopicPress = (topicId: string) => {
    router.push(`/topics/${topicId}` as any);
  };

  const isTopicUnlocked = (topic: any) => {
    // First topic in a domain is always unlocked
    if (!topic.unlockRequirement || topic.order === 0 || topic.order === 1) {
      return true;
    }

    // Check if required topic is completed
    return (
      user?.completedChallenges?.some((id: string) =>
        id.includes(topic.unlockRequirement)
      ) || false
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4">Loading topics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg font-bold mb-2">⚠️ Error</Text>
          <Text className="text-gray-600 text-center">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex-1 p-5">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Topics</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Complete each topic to unlock the next
          </Text>
        </View>

        <FlatList
          data={topics}
          keyExtractor={(item) => item.$id || item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const unlocked = isTopicUnlocked(item);

            return (
              <Pressable
                className={`p-4 mb-4 rounded-xl border-2 ${
                  unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-100 border-gray-300"
                }`}
                disabled={!unlocked}
                onPress={() => handleTopicPress(item.$id)}
                style={({ pressed }) => [
                  { opacity: pressed && unlocked ? 0.7 : 1 },
                ]}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {item.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {item.description}
                    </Text>
                    {unlocked && (
                      <Text className="text-xs text-green-600 font-medium mt-2">
                        +{item.xpReward} XP
                      </Text>
                    )}
                  </View>

                  <View className="ml-3">
                    {!unlocked ? (
                      <View className="bg-gray-300 rounded-full p-2">
                        <Text className="text-gray-600">🔒</Text>
                      </View>
                    ) : (
                      <View className="bg-green-500 rounded-full w-8 h-8 justify-center items-center">
                        <Text className="text-white text-lg">▶</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default TopicsScreen;
