import React, { useEffect } from "react";
import { View, Text } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Props {
  xpAmount: number;
  onAnimationComplete?: () => void;
  visible: boolean;
}

const XPGain = ({ xpAmount, onAnimationComplete, visible }: Props) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Start animation
      translateY.value = withSequence(
        withSpring(-50),
        withTiming(-100, { duration: 1000 })
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 700 }, () => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        })
      );
      scale.value = withSpring(1);
    } else {
      // Reset animation values
      translateY.value = 0;
      opacity.value = 0;
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View className="absolute top-1/2 left-0 right-0 items-center justify-center pointer-events-none">
      <Animated.View
        style={animatedStyle}
        className="bg-cyan-500/20 border-2 border-cyan-400 rounded-full px-6 py-3"
      >
        <Text className="text-cyan-400 text-2xl font-bold">+{xpAmount}</Text>
      </Animated.View>
    </View>
  );
};
export default XPGain;
