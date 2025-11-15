import { getRankColor } from "@/lib/progression";
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
  newRank: string;
  onComplete?: () => void;
}

const RankUpOverlay = ({ visible, newRank, onComplete }: Props) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Fade in background
      opacity.value = withTiming(1, { duration: 300 });

      // Scale and rotate in
      scale.value = withSequence(
        withSpring(1.3, { damping: 6 }),
        withSpring(1)
      );
      rotation.value = withSequence(
        withTiming(360, { duration: 800 }),
        withTiming(0, { duration: 0 })
      );

      // Pulsing glow
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.6, { duration: 400 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.6, { duration: 400 })
      );

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, () => {
          if (onComplete) {
            onComplete();
          }
        });
      }, 4000);
    } else {
      opacity.value = 0;
      scale.value = 0.3;
      rotation.value = 0;
      glowOpacity.value = 0;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  if (!visible) return null;

  const rankColor = getRankColor(newRank);

  return (
    <Animated.View
      style={overlayStyle}
      className="absolute inset-0 bg-black/90 items-center justify-center z-50"
    >
      <Animated.View style={contentStyle} className="items-center">
        {/* Glow effect */}
        <Animated.View
          style={[glowStyle, { backgroundColor: `${rankColor}40` }]}
          className="absolute w-80 h-80 rounded-full blur-3xl"
        />

        {/* Content */}
        <View className="items-center z-10">
          <Text className="text-6xl font-bold mb-4">👑</Text>
          <Text className="text-white text-4xl font-bold mb-2">RANK UP!</Text>
          <View
            className="border-4 rounded-2xl px-8 py-4 mb-4"
            style={{ borderColor: rankColor }}
          >
            <Text className="text-5xl font-bold" style={{ color: rankColor }}>
              {newRank}
            </Text>
          </View>
          <Text className="text-gray-400 text-lg text-center px-8">
            You've ascended to a new rank!
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default RankUpOverlay;
