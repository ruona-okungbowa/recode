import { ScenarioChallengeProps, ScenarioContent } from "@/type";
import cn from "clsx";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-black text-center">
          Error loading challenge content
        </Text>
      </View>
    );
  }

  // Validate content structure
  if (!content.options || !Array.isArray(content.options)) {
    console.error("❌ Invalid challenge content structure:", content);
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-black text-center">Invalid challenge format</Text>
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
        ? "bg-blue-600 border-blue-400"
        : "bg-gray-800 border-gray-600";
    }

    const option = content.options.find((opt) => opt.id === optionId);
    if (option?.isCorrect) {
      return "bg-green-600 border-green-400";
    }
    if (selectedOption === optionId && !option?.isCorrect) {
      return "bg-red-600 border-red-400";
    }
    return "bg-gray-800 border-gray-600";
  };

  const getOptionIcon = (optionId: string) => {
    if (!hasSubmitted) {
      return selectedOption === optionId ? "●" : "○";
    }

    const option = content.options.find((opt) => opt.id === optionId);
    if (option?.isCorrect) {
      return "✓";
    }
    if (selectedOption === optionId && !option?.isCorrect) {
      return "✗";
    }
    return "○";
  };

  return (
    <SafeAreaView className="flex flex-1 bg-white">
      <ScrollView contentContainerClassName="p-4">
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-black text-lg font-semibold">
              {challenge.title}
            </Text>
            <View
              className={cn(
                "px-3 py-1 rounded-full",
                challenge.difficulty === "easy" && "bg-green-500/20",
                challenge.difficulty === "medium" && "bg-yellow-500/20",
                challenge.difficulty === "hard" && "bg-red-500/20"
              )}
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  challenge.difficulty === "easy" && "text-green-400",
                  challenge.difficulty === "medium" && "text-yellow-400",
                  challenge.difficulty === "hard" && "text-red-400"
                )}
              >
                {challenge.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text className="text-gray-400 text-sm">{challenge.xpReward} XP</Text>
        </View>

        <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <Text className="text-blue-400 text-xs font-semibold mb-2">
            📖 SCENARIO
          </Text>
          <Text className="text-black text-base leading-6">
            {content.scenario}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-black text-lg font-semibold mb-4">
            {content.question}
          </Text>
        </View>
        <View className="mb-6">
          {content.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionSelect(option.id)}
              disabled={hasSubmitted}
              className={cn(
                "border-2 rounded-lg p-4 mb-3 flex-row items-center",
                getOptionStyle(option.id)
              )}
            >
              <Text className="text-black text-xl mr-3">
                {getOptionIcon(option.id)}
              </Text>
              <Text className="text-black text-base flex-1">{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {showExplanation && selectedOption && (
          <View
            className={cn(
              "border-2 rounded-lg p-4 mb-6",
              content.options.find((opt) => opt.id === selectedOption)
                ?.isCorrect
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            )}
          >
            <Text
              className={cn(
                "text-sm font-semibold mb-2",
                content.options.find((opt) => opt.id === selectedOption)
                  ?.isCorrect
                  ? "text-green-400"
                  : "text-red-400"
              )}
            >
              {content.options.find((opt) => opt.id === selectedOption)
                ?.isCorrect
                ? "✓ Correct!"
                : "✗ Not quite right"}
            </Text>
            <Text className="text-gray-300 text-sm">
              {
                content.options.find((opt) => opt.id === selectedOption)
                  ?.explanation
              }
            </Text>
          </View>
        )}

        {hints.length > 0 && (
          <View className="mb-6">
            <Text className="text-yellow-400 text-sm font-semibold mb-2">
              💡 HINTS
            </Text>
            {hints.map((hint, index) => (
              <View
                key={index}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-2"
              >
                <Text className="text-gray-300 text-sm">{hint}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="flex-row gap-3 mb-8">
          {!hasSubmitted && (
            <>
              <TouchableOpacity
                onPress={onRequestHint}
                disabled={isLoading}
                className="flex-1 bg-yellow-500/20 border border-yellow-500 rounded-lg py-3 items-center"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FCD34D" />
                ) : (
                  <Text className="text-yellow-400 font-semibold">
                    💡 Get Hint
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!selectedOption || isLoading}
                className={cn(
                  "flex-1 rounded-lg py-3 items-center",
                  selectedOption && !isLoading
                    ? "bg-blue-500 border border-blue-400"
                    : "bg-gray-700 border border-gray-600"
                )}
              >
                <Text
                  className={cn(
                    "font-semibold",
                    selectedOption && !isLoading
                      ? "text-black"
                      : "text-gray-400"
                  )}
                >
                  Submit Answer
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ScenarioChallenge;
