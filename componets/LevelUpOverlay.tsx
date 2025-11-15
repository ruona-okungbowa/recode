import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  visible: boolean;
  newLevel: number;
  onComplete?: () => void;
}

const LevelUpOverlay = ({ visible, newLevel, onComplete }: Props) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Fade in background
      opacity.value = withTiming(1, { duration: 300 });

      // Scale in content
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1)
      );

      // Pulsing glow effect
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.5, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          if (onComplete) {
            onComplete();
          }
        });
      }, 3000);
    } else {
      opacity.value = 0;
      scale.value = 0.5;
      glowOpacity.value = 0;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={overlayStyle}
      className="absolute inset-0 bg-black/80 items-center justify-center z-50"
    >
      <Animated.View style={contentStyle} className="items-center">
        {/* Glow effect */}
        <Animated.View
          style={glowStyle}
          className="absolute w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"
        />

        {/* Content */}
        <View className="items-center z-10">
          <Text className="text-cyan-400 text-6xl font-bold mb-4">⭐</Text>
          <Text className="text-white text-3xl font-bold mb-2">LEVEL UP!</Text>
          <Text className="text-cyan-400 text-5xl font-bold mb-4">
            {newLevel}
          </Text>
          <Text className="text-gray-400 text-lg">
            You're getting stronger!
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default LevelUpOverlay;
