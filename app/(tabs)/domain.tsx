import { isDomainUnlocked } from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import useProgressStore from "@/store/content.store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Domains = () => {
  const { user } = useAuthStore();
  const { domains, isLoading, error, fetchDomains } = useProgressStore();
  const router = useRouter();

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDomainPress = (domainId: string) => {
    // Navigate to topics list screen for this domain
    router.push(`/${domainId}/topics` as any);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-4"> Loading domains...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg font-bold mb-2">⚠️ Error</Text>
          <Text className="text-gray-600 text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => fetchDomains()}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-1 bg-white">
      <View className="flex-1 p-5">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Domains</Text>
          <Text className="text-sm text-gray-600 mt-1">
            Your level: {user?.level || 1} • Rank: {user?.rank || "E-Rank"}
          </Text>
        </View>

        <FlatList
          data={domains}
          keyExtractor={(item) => item.id || item.$id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const unlocked = isDomainUnlocked(item.rank, user?.level || 1);

            return (
              <TouchableOpacity
                className={`p-4 mb-4 rounded-xl border-2 ${
                  unlocked
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-100 border-gray-300"
                }`}
                disabled={!unlocked}
                onPress={() => handleDomainPress(item.$id)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    {/* Icon and Title */}
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-3">{item.icon || "📚"}</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">
                          {item.name}
                        </Text>
                        <Text className="text-xs font-semibold text-blue-600">
                          {item.rank}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    <Text className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </Text>

                    {/* Action Hint */}
                    {unlocked && (
                      <Text className="text-xs text-blue-500 font-medium">
                        Tap to explore topics →
                      </Text>
                    )}
                  </View>

                  {/* Lock/Arrow Indicator */}
                  <View className="ml-3">
                    {!unlocked ? (
                      <View className="bg-gray-300 rounded-full px-3 py-1">
                        <Text className="text-xs font-semibold text-gray-600">
                          🔒 Lv {item.unlockLevel}
                        </Text>
                      </View>
                    ) : (
                      <View className="bg-blue-500 rounded-full w-8 h-8 justify-center items-center">
                        <Text className="text-white text-lg">▶</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Domains;
