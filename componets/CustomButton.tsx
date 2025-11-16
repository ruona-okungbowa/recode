import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
  const getGradientColors = (): [string, string] => {
    if (disabled || isLoading) return ["#6b7280", "#9ca3af"];

    switch (variant) {
      case "primary":
        return ["#667eea", "#764ba2"];
      case "secondary":
        return ["#f093fb", "#f5576c"];
      case "success":
        return ["#4facfe", "#00f2fe"];
      case "glass":
        return ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"];
      default:
        return ["#667eea", "#764ba2"];
    }
  };

  if (variant === "glass") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        className={cn("rounded-2xl overflow-hidden", style)}
      >
        <View className="bg-white/10 border border-white/20 rounded-2xl p-4 flex-row items-center justify-center">
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className={cn("text-white font-bold text-base", textStyle)}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn("rounded-2xl overflow-hidden", style)}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4 flex-row items-center justify-center"
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn("text-white font-bold text-base", textStyle)}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};
export default CustomButton;
