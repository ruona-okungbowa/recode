import TheorySection from "@/componets/TheorySection";
import useQuestStore from "@/store/quest.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TheoryDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentQuest, loadQuest, isLoading } = useQuestStore();

  useEffect(() => {
    if (id) {
      loadQuest(id);
    }
  }, [id]);

  if (isLoading || !currentQuest) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-white mt-4">Loading theory...</Text>
      </SafeAreaView>
    );
  }

  let theoryData;
  try {
    theoryData =
      typeof currentQuest.theoryContent === "string"
        ? JSON.parse(currentQuest.theoryContent)
        : currentQuest.theoryContent;
  } catch (error) {
    theoryData = {
      title: currentQuest.title,
      content: currentQuest.theoryContent,
      codeExamples: [],
      diagrams: [],
      analogies: [],
    };
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex-1">
          <View className="px-4 py-3 border-b border-gray-800">
            <TouchableOpacity onPress={() => router.back()} className="mb-2">
              <Text className="text-blue-400 text-sm">← Back to Quest</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Theory</Text>
          </View>

          <TheorySection
            title={theoryData.title || currentQuest.title}
            content={theoryData.content || currentQuest.theoryContent}
            codeExamples={theoryData.codeExamples}
            diagrams={theoryData.diagrams}
            analogies={theoryData.analogies}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default TheoryDetail;
