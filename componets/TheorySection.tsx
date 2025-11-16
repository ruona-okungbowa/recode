import cn from "clsx";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

interface Props {
  title: string;
  content: string;
  codeExamples?: CodeExample[];
  diagrams?: string[];
  analogies?: string[];
}

const TheorySection = ({
  title,
  content,
  codeExamples = [],
  diagrams = [],
  analogies = [],
}: Props) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    codeExamples[0]?.language || "javascript"
  );

  // Split content into paragraphs (2-3 paragraphs)
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text className="text-black text-2xl font-bold mb-4">{title}</Text>

        {paragraphs.map((paragraph, index) => (
          <Text key={index} className="text-gray-300 text-base leading-6 mb-4">
            {paragraph}
          </Text>
        ))}

        {analogies.length > 0 && (
          <View className="mb-6">
            {analogies.map((analogy, index) => (
              <View
                key={index}
                className="bg-gray-300 border border-purple-500/30 rounded-lg p-4 mb-3"
              >
                <Text className="text-purple-400 text-xs font-semibold mb-2">
                  💡 REAL-WORLD ANALOGY
                </Text>
                <Text className="text-gray-300 text-sm leading-5">
                  {analogy}
                </Text>
              </View>
            ))}
          </View>
        )}

        {codeExamples.length > 0 && (
          <View className="mb-6">
            <Text className="text-cyan-400 text-sm font-semibold mb-3">
              📝 CODE EXAMPLES
            </Text>

            {codeExamples.length > 1 && (
              <View className="flex-row mb-3">
                {codeExamples.map((example) => (
                  <TouchableOpacity
                    key={example.language}
                    onPress={() => setSelectedLanguage(example.language)}
                    className={cn(
                      "px-4 py-2 rounded-lg mr-2 border",
                      selectedLanguage === example.language
                        ? "bg-cyan-500 border-cyan-400"
                        : "bg-white border-gray-700"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-xs font-semibold",
                        selectedLanguage === example.language
                          ? "text-black"
                          : "text-gray-400"
                      )}
                    >
                      {example.language.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {codeExamples
              .filter((example) => example.language === selectedLanguage)
              .map((example, index) => (
                <View key={index} className="mb-4">
                  <View className="bg-white border border-gray-700 rounded-lg p-4 mb-2">
                    <Text className="text-gray-300 font-mono text-sm leading-5">
                      {example.code}
                    </Text>
                  </View>
                  {example.explanation && (
                    <Text className="text-gray-400 text-sm leading-5">
                      {example.explanation}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {diagrams.length > 0 && (
          <View className="mb-6">
            <Text className="text-blue-400 text-sm font-semibold mb-3">
              📊 VISUAL DIAGRAMS
            </Text>
            {diagrams.map((diagram, index) => (
              <View
                key={index}
                className="bg-white border border-gray-700 rounded-lg p-4 mb-3 items-center"
              >
                <Text className="text-gray-500 text-sm">
                  [Diagram: {diagram}]
                </Text>
                <Text className="text-gray-600 text-xs mt-2">
                  Diagram visualization coming soon
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TheorySection;
