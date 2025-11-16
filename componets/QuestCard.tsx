import { Quest } from "@/type";
import cn from "clsx";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  quest: Quest;
  isLocked?: boolean;
  progress?: {
    completed: number;
    total: number;
  };
}

const QuestCard = ({ quest, isLocked = false, progress }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    if (!isLocked) {
      router.push(`/quest/${quest.$id}` as any);
    }
  };

  const progressPercentage = progress
    ? (progress.completed / progress.total) * 100
    : 0;

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLocked}
        className={cn(
          "rounded-xl p-4 mb-4 border-2",
          isLocked ? "bg-white border-gray-700" : "bg-white border-blue-500/30"
        )}
      >
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-1 mr-3">
            <Text
              className={cn(
                "text-lg font-bold mb-1",
                isLocked ? "text-gray-500" : "text-black"
              )}
            >
              {quest.title}
            </Text>
            {isLocked && (
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-xs">🔒 Locked</Text>
              </View>
            )}
          </View>
          <View className="bg-cyan-500/20 px-3 py-1 rounded-full">
            <Text className="text-cyan-400 text-xs font-semibold">
              {quest.totalXP} XP
            </Text>
          </View>
        </View>

        <Text
          className={cn(
            "text-sm mb-3 leading-5",
            isLocked ? "text-gray-600" : "text-gray-300"
          )}
          numberOfLines={2}
        >
          {quest.narrative}
        </Text>

        {!isLocked && quest.objectives && quest.objectives.length > 0 && (
          <View className="mb-3">
            <Text className="text-blue-400 text-xs font-semibold mb-2">
              OBJECTIVES
            </Text>
            {quest.objectives.slice(0, 2).map((objective, index) => (
              <Text key={index} className="text-gray-400 text-xs mb-1">
                • {objective}
              </Text>
            ))}
            {quest.objectives.length > 2 && (
              <Text className="text-gray-500 text-xs">
                +{quest.objectives.length - 2} more...
              </Text>
            )}
          </View>
        )}

        {!isLocked && progress && (
          <View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-400 text-xs">Progress</Text>
              <Text className="text-gray-400 text-xs">
                {progress.completed}/{progress.total} challenges
              </Text>
            </View>
            <View className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>
        )}

        {isLocked &&
          quest.unlockRequirements &&
          quest.unlockRequirements.length > 0 && (
            <View className="mt-2">
              <Text className="text-gray-600 text-xs">
                Complete: {quest.unlockRequirements.join(", ")}
              </Text>
            </View>
          )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default QuestCard;
