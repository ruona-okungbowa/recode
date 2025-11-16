import GlassCard from "@/componets/GlassCard";
import { getQuestsByTopic } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import useProgressStore from "@/store/content.store";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Lock, MapPin, Trophy, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopicsScreen = () => {
  const { domainId } = useLocalSearchParams<{ domainId: string }>();
  const { user } = useAuthStore();
  const { topics, isLoading, error, fetchTopicsByDomain } = useProgressStore();
  const router = useRouter();
  const [topicQuests, setTopicQuests] = useState<Record<string, any>>({});

  useEffect(() => {
    if (domainId) {
      fetchTopicsByDomain(domainId);
    }
  }, [domainId, fetchTopicsByDomain]);

  // Fetch quests for each topic
  useEffect(() => {
    const fetchQuestsForTopics = async () => {
      const questsMap: Record<string, any> = {};
      for (const topic of topics) {
        try {
          const quests = await getQuestsByTopic(topic.$id);
          if (quests.length > 0) {
            // Use the first quest for each topic
            questsMap[topic.$id] = quests[0];
          }
        } catch (error) {
          console.error(`Error fetching quests for topic ${topic.$id}:`, error);
        }
      }
      setTopicQuests(questsMap);
    };

    if (topics.length > 0) {
      fetchQuestsForTopics();
    }
  }, [topics]);

  const handleTopicPress = (topicId: string) => {
    // Navigate to the quest for this topic
    const quest = topicQuests[topicId];
    if (quest) {
      router.push(`/quest/${quest.$id}` as any);
    } else {
      // Fallback
      router.push(`/topics/${topicId}` as any);
    }
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
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center">
          <GlassCard className="p-8 items-center">
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="text-gray-800 mt-4 text-lg font-medium">
              Loading subtopics...
            </Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <GlassCard className="p-6 items-center">
            <Text className="text-red-500 text-lg font-bold mb-2">
              ⚠️ Error
            </Text>
            <Text className="text-gray-600 text-center">{error}</Text>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

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
          <View className="flex-row items-center mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center"
            >
              <ArrowLeft color="white" size={20} />
            </TouchableOpacity>

            <View className="flex-1 ml-4">
              <Text className="text-white text-2xl font-bold">Sub-Topics</Text>
              <Text className="text-white/80 text-sm mt-1">
                Choose a topic to start your learning journey
              </Text>
            </View>
          </View>

          <View style={{ gap: 16 }}>
            {topics.map((item) => {
              const unlocked = isTopicUnlocked(item);
              const hasQuest = topicQuests[item.$id];

              return (
                <TouchableOpacity
                  key={item.$id || item.id}
                  onPress={() => unlocked && handleTopicPress(item.$id)}
                  disabled={!unlocked}
                  className="overflow-hidden rounded-2xl"
                  activeOpacity={unlocked ? 0.8 : 0.5}
                >
                  <LinearGradient
                    colors={
                      unlocked
                        ? hasQuest
                          ? ["#667eea", "#764ba2"]
                          : ["#4facfe", "#00f2fe"]
                        : ["#9CA3AF", "#6B7280"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-5 py-6"
                  >
                    <View className="flex-row justify-between items-center mb-2 p-2 m-2">
                      <View className="flex-1">
                        <Text className="text-white text-lg font-bold mb-2">
                          {item.name}
                        </Text>
                        <Text className="text-white/90 text-sm mb-3 leading-5">
                          {item.description}
                        </Text>

                        {unlocked && hasQuest && (
                          <View
                            className="flex-row items-center"
                            style={{ gap: 8 }}
                          >
                            <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
                              <MapPin color="white" size={12} />
                              <Text className="text-white text-xs font-bold ml-1">
                                Quest Available
                              </Text>
                            </View>
                            <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
                              <Zap color="white" size={12} />
                              <Text className="text-white text-xs font-bold ml-1">
                                +{topicQuests[item.$id].totalXP} XP
                              </Text>
                            </View>
                          </View>
                        )}

                        {unlocked && !hasQuest && (
                          <View className="bg-white/20 rounded-full px-3 py-1 self-start">
                            <Text className="text-white/80 text-xs font-medium">
                              Coming Soon
                            </Text>
                          </View>
                        )}

                        {!unlocked && (
                          <View className="bg-white/20 rounded-full px-3 py-1 self-start">
                            <Text className="text-white text-xs font-bold">
                              🔒 Complete previous topic to unlock
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="ml-4">
                        {!unlocked ? (
                          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                            <Lock color="white" size={20} />
                          </View>
                        ) : hasQuest ? (
                          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                            <Trophy color="white" size={20} />
                          </View>
                        ) : (
                          <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                            <Text className="text-white text-lg">▶</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TopicsScreen;
