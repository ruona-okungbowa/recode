import { calculateRank } from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import { useRouter } from "expo-router";
import { Award, LogOut, Mail, TrendingUp } from "lucide-react-native";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, signOutUser } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const currentRank = calculateRank(user.level || 1);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOutUser();
            router.replace("/signIn");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  // Skill data
  const skills = [
    {
      name: "Data Structures",
      score: user.dataStructuresScore || 0,
      color: "bg-blue-500",
    },
    {
      name: "Algorithms",
      score: user.algorithmsScore || 0,
      color: "bg-purple-500",
    },
    {
      name: "Problem Solving",
      score: user.problemSolvingScore || 0,
      color: "bg-green-500",
    },
    {
      name: "System Design",
      score: user.systemDesignScore || 0,
      color: "bg-orange-500",
    },
    {
      name: "Behavioral",
      score: user.behavioralScore || 0,
      color: "bg-pink-500",
    },
  ];

  return (
    <SafeAreaView className="flex flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-3">
              <Text className="text-white text-4xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {user.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Mail size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 ml-1">{user.email}</Text>
            </View>
          </View>
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <View className="flex-row items-center justify-between">
                <Award size={20} color="#3B82F6" />
                <Text className="text-xs text-blue-600 font-semibold">
                  RANK
                </Text>
              </View>
              <Text className="text-2xl font-bold text-blue-700 mt-2">
                {currentRank}
              </Text>
            </View>

            {/* Level Card */}
            <View className="flex-1 bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <View className="flex-row items-center justify-between">
                <TrendingUp size={20} color="#10B981" />
                <Text className="text-xs text-green-600 font-semibold">
                  LEVEL
                </Text>
              </View>
              <Text className="text-2xl font-bold text-green-700 mt-2">
                {user.level || 1}
              </Text>
            </View>
          </View>

          {/* XP Progress */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Total Experience
            </Text>
            <Text className="text-3xl font-bold text-gray-900">
              {user.xp || 0} XP
            </Text>
          </View>

          {/* Skill Breakdown */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Skill Breakdown
            </Text>

            {skills.map((skill, index) => (
              <View key={index} className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-semibold text-gray-700">
                    {skill.name}
                  </Text>
                  <Text className="text-sm font-bold text-gray-900">
                    {skill.score}%
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className={`h-full ${skill.color} rounded-full`}
                    style={{ width: `${skill.score}%` }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Progress Stats */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Progress Overview
            </Text>

            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600">
                Completed Challenges
              </Text>
              <Text className="text-sm font-bold">
                {user.completedChallenges?.length || 0}
              </Text>
            </View>

            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-sm text-gray-600">Unlocked Domains</Text>
              <Text className="text-sm font-bold">
                {user.unlockedDomains?.length || 1}/5
              </Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-600">Current Streak</Text>
              <Text className="text-sm font-bold">0 days</Text>
            </View>
          </View>

          {/* Sign Out Button */}
          <Pressable
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleSignOut}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <LogOut size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;
