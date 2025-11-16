import { ScenarioChallengeProps, ScenarioContent } from "@/type";
import cn from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GlassCard from "./GlassCard";

const ScenarioChallenge = ({
  challenge,
  onSubmit,
  onRequestHint,
  hints,
  isLoading = false,
}: ScenarioChallengeProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const router = useRouter();

  // Parse content with error handling
  let content: ScenarioContent;
  try {
    content =
      typeof challenge.content === "string"
        ? JSON.parse(challenge.content)
        : challenge.content;
  } catch (error) {
    console.error("❌ Failed to parse challenge content:", error);
    return (
      <View className="flex-1 items-center justify-center p-4">
        <GlassCard>
          <Text className="text-gray-800 text-center text-lg">
            Error loading challenge content
          </Text>
        </GlassCard>
      </View>
    );
  }

  // Validate content structure
  if (!content.options || !Array.isArray(content.options)) {
    console.error("❌ Invalid challenge content structure:", content);
    return (
      <View className="flex-1 items-center justify-center p-4">
        <GlassCard>
          <Text className="text-gray-800 text-center text-lg">
            Invalid challenge format
          </Text>
        </GlassCard>
      </View>
    );
  }

  const handleOptionSelect = (optionId: string) => {
    if (!hasSubmitted) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) return;

    const selectedOptionData = content.options.find(
      (opt) => opt.id === selectedOption
    );
    const isCorrect = selectedOptionData?.isCorrect || false;

    setHasSubmitted(true);
    setShowExplanation(true);
    onSubmit(isCorrect, selectedOption);
  };

  const getOptionStyle = (optionId: string) => {
    if (!hasSubmitted) {
      return selectedOption === optionId
        ? "bg-white/95 border border-blue-400/50"
        : "bg-white/95 border border-white/30";
    }

    const option = content.options.find((opt) => opt.id === optionId);
    if (option?.isCorrect) {
      return "bg-green-500/20 border-green-400/50";
    }
    if (selectedOption === optionId && !option?.isCorrect) {
      return "bg-red-500/20 border-red-400/50";
    }
    return "bg-white/95 border border-white/30";
  };

  const getOptionIcon = (optionId: string) => {
    if (!hasSubmitted) {
      return selectedOption === optionId ? "●" : "○";
    }

    const option = content.options.find((opt) => opt.id === optionId);
    if (option?.isCorrect) {
      return <CheckCircle color="#10b981" size={20} />;
    }
    if (selectedOption === optionId && !option?.isCorrect) {
      return <XCircle color="#ef4444" size={20} />;
    }
    return "○";
  };

  const getDifficultyColor = (): [string, string] => {
    switch (challenge.difficulty) {
      case "easy":
        return ["#10b981", "#34d399"];
      case "medium":
        return ["#f59e0b", "#fbbf24"];
      case "hard":
        return ["#ef4444", "#f87171"];
      default:
        return ["#6b7280", "#9ca3af"];
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center"
          >
            <ArrowLeft color="white" size={20} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <View className="px-3 py-1 rounded-full overflow-hidden">
              <LinearGradient
                colors={getDifficultyColor()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-3 py-1 rounded-full"
              >
                <Text className="text-white text-xs font-bold">
                  {challenge.difficulty.toUpperCase()}
                </Text>
              </LinearGradient>
            </View>

            <View className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
              <Text className="text-white text-xs font-semibold">
                {challenge.xpReward} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Challenge Title */}
        <GlassCard className="mb-6">
          <Text className="text-gray-800 text-xl font-bold mb-2">
            {challenge.title}
          </Text>
          <Text className="text-gray-600 text-sm">
            Complete this challenge to earn {challenge.xpReward} XP
          </Text>
        </GlassCard>

        {/* Scenario Card */}
        <GlassCard variant="primary" className="mb-6">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">📖</Text>
            <Text className="text-blue-600 text-sm font-bold">SCENARIO</Text>
          </View>
          <Text className="text-gray-800 text-base leading-6">
            {content.scenario}
          </Text>
        </GlassCard>

        {/* Question */}
        <GlassCard className="mb-6">
          <Text className="text-gray-800 text-lg font-semibold">
            {content.question}
          </Text>
        </GlassCard>

        {/* Options */}
        <View className="mb-6">
          {content.options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionSelect(option.id)}
              disabled={hasSubmitted}
              className={cn(
                "rounded-2xl p-4 mb-3 flex-row items-center border-2",
                getOptionStyle(option.id)
              )}
            >
              <View className="w-6 h-6 mr-4 items-center justify-center">
                {typeof getOptionIcon(option.id) === "string" ? (
                  <Text className="text-gray-800 text-lg font-bold">
                    {getOptionIcon(option.id)}
                  </Text>
                ) : (
                  getOptionIcon(option.id)
                )}
              </View>
              <Text className="text-gray-800 text-base flex-1 font-medium">
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && selectedOption && (
          <GlassCard
            variant={
              content.options.find((opt) => opt.id === selectedOption)
                ?.isCorrect
                ? "success"
                : "dark"
            }
            className="mb-6"
          >
            <View className="flex-row items-center mb-3">
              {content.options.find((opt) => opt.id === selectedOption)
                ?.isCorrect ? (
                <CheckCircle color="#10b981" size={24} />
              ) : (
                <XCircle color="#ef4444" size={24} />
              )}
              <Text
                className={cn(
                  "text-lg font-bold ml-2",
                  content.options.find((opt) => opt.id === selectedOption)
                    ?.isCorrect
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {content.options.find((opt) => opt.id === selectedOption)
                  ?.isCorrect
                  ? "Correct!"
                  : "Not quite right"}
              </Text>
            </View>
            <Text className="text-gray-700 text-base leading-6">
              {
                content.options.find((opt) => opt.id === selectedOption)
                  ?.explanation
              }
            </Text>
          </GlassCard>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Lightbulb color="#f59e0b" size={20} />
              <Text className="text-white font-bold ml-2">HINTS</Text>
            </View>
            {hints.map((hint, index) => (
              <GlassCard
                key={index}
                className="mb-3 bg-yellow-500/10 border-yellow-400/30"
              >
                <Text className="text-gray-800 text-base">{hint}</Text>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        {!hasSubmitted && (
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={onRequestHint}
              disabled={isLoading}
              className="flex-1 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#f59e0b", "#fbbf24"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 flex-row items-center justify-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Lightbulb color="white" size={20} />
                    <Text className="text-white font-bold ml-2">Get Hint</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!selectedOption || isLoading}
              className="flex-1 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={
                  selectedOption && !isLoading
                    ? ["#667eea", "#764ba2"]
                    : ["#6b7280", "#9ca3af"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 items-center justify-center"
              >
                <Text className="text-white font-bold">Submit Answer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
export default ScenarioChallenge;
