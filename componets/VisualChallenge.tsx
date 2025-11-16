import { VisualChallengeProps, VisualContent } from "@/type";
import cn from "clsx";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const StackVisualization = ({ state }: { state: any[] }) => {
  return (
    <View className="items-center justify-end min-h-96 bg-gray-800 rounded-lg p-4">
      {state.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Empty Stack</Text>
        </View>
      ) : (
        <View className="w-full">
          {/* Render from top to bottom (reverse order) */}
          {[...state].reverse().map((item, index) => (
            <StackItem key={`${item}-${index}`} value={item} />
          ))}
        </View>
      )}

      {/* Base of stack */}
      <View className="w-full h-2 bg-gray-600 mt-4 rounded" />
      <Text className="text-gray-500 text-xs mt-1">Bottom</Text>
    </View>
  );
};

// Animated Stack Item
const StackItem = ({ value }: { value: any }) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="bg-blue-500 border-2 border-blue-400 rounded-lg p-4 mb-2"
    >
      <Text className="text-white text-center text-xl font-bold">{value}</Text>
    </Animated.View>
  );
};

const VisualChallenge = ({
  challenge,
  onSubmit,
  onRequestHint,
  hints,
  isLoading = false,
}: VisualChallengeProps) => {
  let content: VisualContent;
  try {
    content =
      typeof challenge.content === "string"
        ? JSON.parse(challenge.content)
        : challenge.content;
  } catch (error) {
    console.error("❌ Failed to parse challenge content:", error);
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center p-4">
        <Text className="text-white text-center">
          Error loading challenge content
        </Text>
      </View>
    );
  }

  // State
  const [currentState, setCurrentState] = useState<any[]>(
    content.initialState || []
  );
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Handle Stack Operations
  const handleStackOperation = (operation: string, value?: string) => {
    let newState = [...currentState];
    let historyEntry = "";

    switch (operation) {
      case "push":
        if (value) {
          newState.push(value);
          historyEntry = `push(${value})`;
        }
        break;

      case "pop":
        if (newState.length > 0) {
          const popped = newState.pop();
          historyEntry = `pop() → ${popped}`;
        } else {
          historyEntry = "pop() → Stack is empty!";
        }
        break;

      case "peek":
        if (newState.length > 0) {
          const top = newState[newState.length - 1];
          historyEntry = `peek() → ${top}`;
        } else {
          historyEntry = "peek() → Stack is empty!";
        }
        break;

      case "clear":
        newState = [];
        historyEntry = "clear()";
        break;

      default:
        break;
    }

    if (historyEntry) {
      setCurrentState(newState);
      setOperationHistory([...operationHistory, historyEntry]);
    }
  };

  const checkSolution = () => {
    const isCorrect =
      JSON.stringify(currentState) === JSON.stringify(content.targetState);
    setHasSubmitted(true);
    onSubmit(isCorrect, currentState);
  };

  const handleReset = () => {
    setCurrentState(content.initialState || []);
    setOperationHistory([]);
    setHasSubmitted(false);
    setIsCorrect(null);
    setInputValue("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-lg font-semibold">
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
            🎯 CHALLENGE
          </Text>
          <Text className="text-white text-base leading-6">
            {content.problemStatement}
          </Text>
        </View>

        {/* Target State */}
        <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <Text className="text-yellow-400 text-sm font-semibold mb-2">
            🎯 TARGET STATE
          </Text>
          <Text className="text-white font-mono">
            [{content.targetState.join(", ")}]
          </Text>
        </View>

        {/* Data Structure Visualization */}
        <View className="mb-6">
          <Text className="text-white text-lg font-bold mb-3">
            Current Stack
          </Text>
          <StackVisualization state={currentState} />
          <Text className="text-gray-400 text-sm text-center mt-2">
            Current: [{currentState.join(", ")}]
          </Text>
        </View>

        {/* Operation Buttons */}
        {!hasSubmitted && (
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-3">
              Operations
            </Text>

            {/* Push operation with input */}
            {content.allowedOperations.includes("push") && (
              <View className="flex-row mb-3">
                <TextInput
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg mr-2 border border-gray-700"
                  placeholder="Enter value"
                  placeholderTextColor="#9CA3AF"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleStackOperation("push", inputValue);
                    setInputValue("");
                  }}
                  disabled={!inputValue}
                  className={cn(
                    "bg-blue-500 px-6 py-3 rounded-lg justify-center",
                    !inputValue && "opacity-50"
                  )}
                >
                  <Text className="text-white font-bold">Push</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Other operations */}
            <View className="flex-row flex-wrap gap-2">
              {content.allowedOperations
                .filter((op) => op !== "push")
                .map((operation) => (
                  <TouchableOpacity
                    key={operation}
                    onPress={() => handleStackOperation(operation)}
                    className="bg-gray-700 px-4 py-3 rounded-lg border border-gray-600"
                  >
                    <Text className="text-white font-semibold capitalize">
                      {operation}
                    </Text>
                  </TouchableOpacity>
                ))}

              {/* Reset button */}
              <TouchableOpacity
                onPress={handleReset}
                className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-red-400 font-semibold">Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Operation History */}
        {operationHistory.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-3">
              History ({operationHistory.length} operations)
            </Text>
            <ScrollView className="bg-gray-800 rounded-lg p-3 max-h-32 border border-gray-700">
              {operationHistory.map((op, index) => (
                <Text key={index} className="text-gray-300 text-sm mb-1">
                  {index + 1}. {op}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Result */}
        {hasSubmitted && isCorrect !== null && (
          <View
            className={cn(
              "border-2 rounded-lg p-4 mb-6",
              isCorrect
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            )}
          >
            <Text
              className={cn(
                "text-sm font-semibold mb-2",
                isCorrect ? "text-green-400" : "text-red-400"
              )}
            >
              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
            </Text>
            <Text className="text-gray-300 text-sm">
              {isCorrect
                ? "Great job! You've successfully built the target stack."
                : "Your stack doesn't match the target. Try again!"}
            </Text>
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
                onPress={checkSolution}
                disabled={isLoading}
                className="flex-1 bg-blue-600 rounded-xl py-3 items-center"
                style={({ pressed }: { pressed: boolean }) => [
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text className="text-white font-semibold">Check Solution</Text>
              </Pressable>
            </>
          )}

          {hasSubmitted && !isCorrect && (
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 bg-blue-500 border border-blue-400 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default VisualChallenge;
