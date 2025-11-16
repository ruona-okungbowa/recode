import GlassCard from "@/componets/GlassCard";
import { isDomainUnlocked } from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import useContentStore from "@/store/content.store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Code,
  Cpu,
  Database,
  Star,
  Trophy,
  Users,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Learn = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { domains, isLoading, error, fetchDomains } = useContentStore();

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Icon mapping for domains
  const getIconForDomain = (domainName: string) => {
    const name = domainName.toLowerCase();
    if (name.includes("data") || name.includes("structure")) {
      return <Database color="white" size={24} />;
    } else if (name.includes("algorithms")) {
      return <Cpu color="white" size={24} />;
    } else if (name.includes("system") || name.includes("design")) {
      return <Code color="white" size={24} />;
    } else if (name.includes("behavioral")) {
      return <Users color="white" size={24} />;
    } else {
      return <BookOpen color="white" size={24} />;
    }
  };

  // Color mapping for domains
  const getColorsForDomain = (index: number): [string, string] => {
    const colorSets: [string, string][] = [
      ["#667eea", "#764ba2"],
      ["#f093fb", "#f5576c"],
      ["#4facfe", "#00f2fe"],
      ["#a8edea", "#fed6e3"],
      ["#ffecd2", "#fcb69f"],
    ];
    return colorSets[index % colorSets.length];
  };

  const handleDomainPress = (domainId: string) => {
    router.push(`/${domainId}/topics`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white mt-4 text-lg font-medium">
            Loading topics...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-blue-400">
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <GlassCard className="p-6 items-center">
            <Text className="text-red-500 text-lg font-bold mb-2">
              ⚠️ Error
            </Text>
            <Text className="text-gray-600 text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={fetchDomains}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-400">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text className="text-white text-2xl font-bold mb-2">
              Explore Topics
            </Text>
            <Text className="text-white/80 text-base">
              Choose your learning path and master coding challenges
            </Text>
          </View>

          <View className="flex-row mb-6" style={{ gap: 12 }}>
            <View className="flex-1">
              <GlassCard className="items-center p-4">
                <Trophy color="#f59e0b" size={24} />
                <Text className="text-gray-800 text-xl font-bold mt-2">
                  {user?.completedChallenges?.length || 0}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Completed</Text>
              </GlassCard>
            </View>

            <View className="flex-1">
              <GlassCard className="items-center p-4">
                <Star color="#667eea" size={24} />
                <Text className="text-gray-800 text-xl font-bold mt-2">
                  {user?.level || 1}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Level</Text>
              </GlassCard>
            </View>
          </View>

          <View style={{ gap: 16 }} className="mb-8">
            {domains.map((domain, index) => {
              const unlocked = isDomainUnlocked(domain.rank, user?.level || 1);
              const colors = getColorsForDomain(index);

              return (
                <TouchableOpacity
                  key={domain.$id || domain.id}
                  onPress={() => unlocked && handleDomainPress(domain.$id)}
                  className="overflow-hidden rounded-2xl"
                  activeOpacity={unlocked ? 0.8 : 0.5}
                  disabled={!unlocked}
                >
                  <LinearGradient
                    colors={unlocked ? colors : ["#9CA3AF", "#6B7280"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-5 py-6"
                  >
                    <View className="flex-row items-center justify-between mb-2 p-2 m-2">
                      <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                          {domain.icon ? (
                            <Text className="text-2xl">{domain.icon}</Text>
                          ) : (
                            getIconForDomain(domain.name)
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-white text-lg font-bold">
                            {domain.name}
                          </Text>
                          <Text className="text-white/80 text-sm mt-1">
                            {domain.description}
                          </Text>
                          <Text className="text-white/70 text-xs mt-1 font-semibold">
                            {domain.rank}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end ml-4">
                        {!unlocked ? (
                          <View className="bg-white/20 rounded-full px-3 py-1">
                            <Text className="text-white text-xs font-semibold">
                              🔒 Lv {domain.unlockLevel}
                            </Text>
                          </View>
                        ) : (
                          <View className="bg-white/20 rounded-full w-10 h-10 items-center justify-center">
                            <Text className="text-white text-lg">▶</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Learn;
