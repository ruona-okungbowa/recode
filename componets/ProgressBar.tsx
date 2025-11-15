import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  currentXP: number;
  maxXP: number;
  level: number;
  showLabel?: boolean;
}

const ProgressBar = ({ currentXP, maxXP, level, showLabel = true }: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    const percentage = (currentXP / maxXP) * 100;
    progress.value = withSpring(percentage, {
      damping: 15,
      stiffness: 100,
    });
  }, [currentXP, maxXP]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="w-full">
      {showLabel && (
        <View className="flex-row justify-between mb-2">
          <Text className="text-white text-sm font-semibold">
            Level {level}
          </Text>
          <Text className="text-gray-400 text-sm">
            {currentXP} / {maxXP} XP
          </Text>
        </View>
      )}
      <View className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <Animated.View
          style={progressStyle}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
        />
      </View>
    </View>
  );
};

export default ProgressBar;
