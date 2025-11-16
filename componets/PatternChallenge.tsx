import { PatternChallengeProps, PatternContent } from "@/type";
import cn from "clsx";
import { Check, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PatternChallenge = ({
  challenge,
  onSubmit,
  onRequestHint,
  hints,
  isLoading,
}: PatternChallengeProps) => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  let content: PatternContent;
  try {
    content =
      typeof challenge.content === "string"
        ? JSON.parse(challenge.content)
        : challenge.content;
  } catch (error) {
    console.error("Failed to parse challenge content", error);
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-black text-center">
          Error loading challenge content
        </Text>
      </View>
    );
  }
  const handlePatternSelect = (patternId: string) => {
    if (!hasSubmitted) {
      setSelectedPattern(patternId);
    }
  };

  const handleSubmit = () => {
    if (!selectedPattern) return;

    const isCorrect = selectedPattern === content.correctPattern;

    setHasSubmitted(true);
    setShowExplanation(true);
    onSubmit(isCorrect, selectedPattern);
  };

  const getPatternStyle = (patternId: string) => {
    if (!hasSubmitted) {
      return selectedPattern === patternId
        ? "bg-blue-600 border-blue-400"
        : "bg-gray-800 border-gray-600";
    }

    if (patternId === content.correctPattern) {
      return "bg-green-600 border-green-400";
    }
    if (selectedPattern === patternId && patternId !== content.correctPattern) {
      return "bg-red-600 border-red-400";
    }
    return "bg-gray-800 border-gray-600";
  };

  const getPatternIcon = (patternId: string) => {
    if (!hasSubmitted) {
      return selectedPattern === patternId ? "●" : "○";
    }

    if (patternId === content.correctPattern) {
      return <Check />;
    }
    if (selectedPattern === patternId && patternId !== content.correctPattern) {
      return <X />;
    }
    return "○";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="p-16 flex-1">
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

        {/* Problem Statement */}
        <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <Text className="text-blue-400 text-xs font-semibold mb-2">
            🎯 PROBLEM
          </Text>
          <Text className="text-black text-base leading-6">
            {content.problemStatement}
          </Text>
        </View>

        {/* Code Snippets */}
        {content.codeSnippets.map((snippet, index) => (
          <View
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4"
          >
            <Text className="text-cyan-400 text-xs font-semibold mb-2">
              {snippet.language.toUpperCase()}
            </Text>
            <Text className="text-gray-300 font-mono text-sm leading-5">
              {snippet.code}
            </Text>
          </View>
        ))}

        {/* Pattern Selection */}
        <View className="mb-4">
          <Text className="text-black text-lg font-semibold mb-4">
            Which pattern does this code demonstrate?
          </Text>
        </View>

        <View className="mb-6">
          {content.patterns.map((pattern) => (
            <TouchableOpacity
              key={pattern.id}
              onPress={() => handlePatternSelect(pattern.id)}
              disabled={hasSubmitted}
              className={cn(
                "border-2 rounded-lg p-4 mb-3",
                getPatternStyle(pattern.id)
              )}
            >
              <View className="flex-row items-start">
                <Text className="text-black text-xl mr-3">
                  {getPatternIcon(pattern.id)}
                </Text>
                <View className="flex-1">
                  <Text className="text-black text-base font-semibold mb-1">
                    {pattern.name}
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    {pattern.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation */}
        {showExplanation && (
          <View
            className={cn(
              "border-2 rounded-lg p-4 mb-6",
              selectedPattern === content.correctPattern
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            )}
          >
            <Text
              className={cn(
                "text-sm font-semibold mb-2",
                selectedPattern === content.correctPattern
                  ? "text-green-400"
                  : "text-red-400"
              )}
            >
              {selectedPattern === content.correctPattern
                ? "✓ Correct!"
                : "✗ Not quite right"}
            </Text>
            <Text className="text-gray-300 text-sm mb-3">
              {content.explanation}
            </Text>

            {selectedPattern === content.correctPattern &&
              content.useCases.length > 0 && (
                <>
                  <Text className="text-cyan-400 text-xs font-semibold mb-2">
                    💡 COMMON USE CASES
                  </Text>
                  {content.useCases.map((useCase, index) => (
                    <Text key={index} className="text-gray-300 text-sm mb-1">
                      • {useCase}
                    </Text>
                  ))}
                </>
              )}
          </View>
        )}

        {/* Hints */}
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

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-8">
          {!hasSubmitted && (
            <>
              <Pressable
                onPress={onRequestHint}
                disabled={isLoading}
                className="flex-1 bg-yellow-500 rounded-xl py-3 items-center"
                style={({ pressed }: { pressed: boolean }) => [
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">💡 Get Hint</Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={!selectedPattern || isLoading}
                className={cn(
                  "flex-1 rounded-xl py-3 items-center",
                  selectedPattern && !isLoading ? "bg-blue-600" : "bg-gray-500"
                )}
                style={({ pressed }: { pressed: boolean }) => [
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text className="text-white font-semibold">Submit Answer</Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default PatternChallenge;
