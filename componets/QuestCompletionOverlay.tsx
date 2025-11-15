import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface QuestCompletionOverlayProps {
  visible: boolean;
  questTitle: string;
  totalXP: number;
  bonusXP: number;
  unlockedContent?: string[];
  relatedTopics?: string[];
  leetcodeProblems?: {
    title: string;
    difficulty: string;
    url: string;
  }[];
  onClose: () => void;
}

const QuestCompletionOverlay = ({
  visible,
  questTitle,
  totalXP,
  bonusXP,
  unlockedContent = [],
  relatedTopics = [],
  leetcodeProblems = [],
  onClose,
}: QuestCompletionOverlayProps) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const confettiScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1)
      );
      confettiScale.value = withSequence(withSpring(1.5), withSpring(1));
    } else {
      opacity.value = 0;
      scale.value = 0.5;
      confettiScale.value = 0;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confettiScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={overlayStyle}
      className="absolute inset-0 bg-black/90 items-center justify-center z-50 px-4"
    >
      <Animated.View style={contentStyle} className="w-full max-w-md">
        {/* Confetti/Celebration Icon */}
        <Animated.View style={confettiStyle} className="items-center mb-4">
          <Text className="text-6xl">🎉</Text>
        </Animated.View>

        {/* Main Content Card */}
        <View className="bg-gray-800 rounded-2xl p-6 border-2 border-cyan-500">
          {/* Title */}
          <Text className="text-white text-2xl font-bold text-center mb-2">
            Quest Complete!
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-6">
            {questTitle}
          </Text>

          {/* XP Rewards */}
          <View className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-300 text-sm">Quest XP</Text>
              <Text className="text-cyan-400 text-lg font-bold">
                +{totalXP} XP
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-300 text-sm">Completion Bonus</Text>
              <Text className="text-green-400 text-lg font-bold">
                +{bonusXP} XP
              </Text>
            </View>
            <View className="border-t border-gray-700 mt-2 pt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-base font-semibold">
                  Total
                </Text>
                <Text className="text-cyan-400 text-xl font-bold">
                  +{totalXP + bonusXP} XP
                </Text>
              </View>
            </View>
          </View>

          {/* Unlocked Content */}
          {unlockedContent.length > 0 && (
            <View className="mb-4">
              <Text className="text-yellow-400 text-sm font-semibold mb-2">
                🔓 UNLOCKED
              </Text>
              {unlockedContent.map((content, index) => (
                <View
                  key={index}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-2"
                >
                  <Text className="text-gray-300 text-sm">• {content}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Topics */}
          {relatedTopics.length > 0 && (
            <View className="mb-4">
              <Text className="text-blue-400 text-sm font-semibold mb-2">
                🔗 RELATED TOPICS
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {relatedTopics.map((topic, index) => (
                  <View
                    key={index}
                    className="bg-blue-500/20 px-3 py-1 rounded-full"
                  >
                    <Text className="text-blue-400 text-xs">{topic}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* LeetCode Problems */}
          {leetcodeProblems.length > 0 && (
            <View className="mb-4">
              <Text className="text-green-400 text-sm font-semibold mb-2">
                💻 PRACTICE ON LEETCODE
              </Text>
              <ScrollView className="max-h-32">
                {leetcodeProblems.map((problem, index) => (
                  <View
                    key={index}
                    className="bg-gray-700 rounded-lg p-3 mb-2 flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="text-white text-sm font-semibold">
                        {problem.title}
                      </Text>
                      <Text
                        className={`text-xs ${
                          problem.difficulty === "Easy"
                            ? "text-green-400"
                            : problem.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </Text>
                    </View>
                    <Text className="text-blue-400 text-xs">→</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-cyan-500 rounded-lg py-3 items-center mt-2"
          >
            <Text className="text-white font-bold text-base">Continue</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default QuestCompletionOverlay;
