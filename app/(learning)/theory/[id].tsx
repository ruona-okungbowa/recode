import TheorySection from "@/componets/TheorySection";
import useQuestStore from "@/store/quest.store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, BookOpen } from "lucide-react-native";
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
  }, [id, loadQuest]);

  if (isLoading || !currentQuest) {
    return (
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center">
          <View className="bg-white/95 border border-white/30 shadow-lg rounded-2xl p-8 items-center">
            <ActivityIndicator size="large" color="#667eea" />
            <Text className="text-gray-800 mt-4 text-lg font-medium">
              Loading theory...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  let theoryData;
  try {
    theoryData =
      typeof currentQuest.theoryContent === "string"
        ? JSON.parse(currentQuest.theoryContent)
        : currentQuest.theoryContent;
  } catch {
    theoryData = {
      title: currentQuest.title,
      content: currentQuest.theoryContent,
      codeExamples: [],
      diagrams: [],
      analogies: [],
    };
  }

  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center"
            >
              <ArrowLeft color="white" size={20} />
            </TouchableOpacity>

            <View className="flex-1 ml-4">
              <View className="flex-row items-center">
                <BookOpen color="white" size={24} />
                <Text className="text-white text-xl font-bold ml-3">
                  Theory
                </Text>
              </View>
              <Text className="text-white/80 text-sm mt-1">
                {theoryData.title || currentQuest.title}
              </Text>
            </View>
          </View>

          {/* Theory Content */}
          <View className="bg-white rounded-2xl shadow-lg p-6">
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
    </View>
  );
};
export default TheoryDetail;
