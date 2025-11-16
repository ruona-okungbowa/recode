import cn from "clsx";
import React from "react";
import { View, ViewProps } from "react-native";

interface GlassCardProps extends ViewProps {
  variant?: "default" | "dark" | "primary" | "success";
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({
  variant = "default",
  children,
  className,
  ...props
}: GlassCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "dark":
        return "bg-black/10 border border-white/10";
      case "primary":
        return "bg-blue-500/10 border border-blue-400/30";
      case "success":
        return "bg-green-500/10 border border-green-400/30";
      default:
        return "bg-white border border-gray-300 shadow-lg";
    }
  };

  return (
    <View
      className={cn("rounded-2xl p-6", getVariantStyles(), className)}
      {...props}
    >
      {children}
    </View>
  );
};

export default GlassCard;
