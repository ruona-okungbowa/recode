import {
  calculateRank,
  getXPForNextLevel,
  getXPProgress,
} from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  // First check if user is null
  if (!user) return null;

  const xpProgress = getXPProgress(user.xp || 0);
  const nextLevelXP = getXPForNextLevel(user.xp || 0);
  const currentRank = calculateRank(user.level || 1);

  return (
    <SafeAreaView className="flex flex-1 bg-white">
      <View className=" flex-1 justify-center items-center p-5">
        <View className="bg-blue-500 rounded-full p-4 mb-4">
          <Text className="text-white text-2xl font-bold"> {currentRank}</Text>
        </View>
        <Text className="text-xl mb-2">Level {user.level || 1}</Text>
        <View className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <View
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${xpProgress}%` }}
          />
        </View>
        <Text className="text-gray-600">
          {user.xp || 0} / {nextLevelXP}
        </Text>
        <TouchableOpacity
          className="mt-8 bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => router.push("/domain")}
        >
          <Text className="text-white font-bold">Learning </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default index;
