import cn from "clsx";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface Props {
  onPress: () => void;
  title?: string;
  style?: string;
  textStyle?: string;
  leftIcon?: React.ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "success" | "glass";
  disabled?: boolean;
}

const CustomButton = ({
  onPress,
  title = "Click Me",
  style,
  textStyle,
  leftIcon,
  isLoading = false,
  variant = "primary",
  disabled = false,
}: Props) => {
  const getButtonStyles = () => {
    if (disabled || isLoading) return "bg-gray-500";

    switch (variant) {
      case "primary":
        return "bg-blue-600";
      case "secondary":
        return "bg-pink-500";
      case "success":
        return "bg-cyan-500";
      case "glass":
        return "bg-white/10 border border-white/20";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        "rounded-xl px-6 py-4 flex-row items-center justify-center min-h-[56px]",
        getButtonStyles(),
        style
      )}
      style={({ pressed }: { pressed: boolean }) => [
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      {leftIcon && <View className="mr-2">{leftIcon}</View>}
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className={cn("text-white font-bold text-base", textStyle)}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};
export default CustomButton;
