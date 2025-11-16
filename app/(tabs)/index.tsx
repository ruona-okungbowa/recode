import GlassCard from "@/componets/GlassCard";
import {
  calculateRank,
  getXPForNextLevel,
  getXPProgress,
} from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import useProgressStore from "@/store/progress.store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Target, User, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { updateUserStreak } = useProgressStore();

  useEffect(() => {
    if (user && user.$id) {
      updateUserStreak(user.$id);
    }
  }, [user, updateUserStreak]);

  // First check if user is null
  if (!user) return null;

  const xpProgress = getXPProgress(user.xp || 0);
  const nextLevelXP = getXPForNextLevel(user.xp || 0);
  const currentRank = calculateRank(user.level || 1);

  return (
    <View className="flex-1 bg-blue-500">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View className="flex-1">
              <Text className="text-white/80 text-base mb-1">
                Welcome back,
              </Text>
              <Text className="text-white text-2xl font-bold">
                {user.name || "Learner"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/20 items-center justify-center ml-4"
            >
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Rank Card */}
          <GlassCard className="mb-6 items-center py-6">
            <View className="w-20 h-20 rounded-full mb-4 items-center justify-center">
              <LinearGradient
                colors={["#f093fb", "#f5576c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full rounded-full items-center justify-center"
              >
                <Text className="text-white text-lg font-bold">
                  {currentRank}
                </Text>
              </LinearGradient>
            </View>
            <Text className="text-gray-800 text-xl font-bold mb-2">
              Level {user.level || 1}
            </Text>
            <Text className="text-gray-600 text-sm">Current Rank</Text>
          </GlassCard>

          {/* Stats Grid */}
          <View className="flex-row mb-6" style={{ gap: 12 }}>
            {/* Streak Card */}
            <View className="flex-1">
              <GlassCard className="p-4">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">🔥</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 text-xl font-bold">
                      {user?.streak || 0}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">
                      Day Streak
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </View>

            {/* XP Card */}
            <View className="flex-1">
              <GlassCard className="p-4">
                <View className="flex-row items-center">
                  <Zap color="#f59e0b" size={20} />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-800 text-xl font-bold">
                      {user.xp || 0}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">Total XP</Text>
                  </View>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Progress Card */}
          <GlassCard className="mb-6 p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 text-lg font-semibold">
                Level Progress
              </Text>
              <Target color="#667eea" size={20} />
            </View>

            <View className="mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600 text-sm">Current XP</Text>
                <Text className="text-gray-800 text-sm font-medium">
                  {user.xp || 0} / {nextLevelXP}
                </Text>
              </View>

              <View className="w-full bg-gray-200 rounded-full h-3">
                <LinearGradient
                  colors={["#4facfe", "#00f2fe"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-3 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </View>
            </View>

            <Text className="text-gray-600 text-xs text-center">
              {Math.round(xpProgress)}% to next level
            </Text>
          </GlassCard>

          {/* Quick Actions */}
          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => router.push("/learn")}
              className="overflow-hidden rounded-2xl"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#a8edea", "#fed6e3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 py-5 flex-row items-center justify-between"
              >
                <View className="flex-1 flex-row m-3">
                  <View className="flex-1">
                    <Text className="text-gray-800 text-lg font-bold mb-1">
                      Explore Topics
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Discover new challenges
                    </Text>
                  </View>
                  <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center ml-4">
                    <Text className="text-xl">🚀</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Index;
