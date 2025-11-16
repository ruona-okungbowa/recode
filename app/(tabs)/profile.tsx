import GlassCard from "@/componets/GlassCard";
import { calculateRank } from "@/lib/progression";
import useAuthStore from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Award,
  LogOut,
  Mail,
  Settings,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Avatar mapping function
const getAvatarSource = (avatarName: string) => {
  const avatarMap: { [key: string]: any } = {
    "avatar1.png": require("../../assets/images/avatar1.png"),
    "avatar2.png": require("../../assets/images/avatar2.png"),
    "avatar3.png": require("../../assets/images/avatar3.png"),
    "avatar4.png": require("../../assets/images/avatar4.png"),
    "avatar5.png": require("../../assets/images/avatar5.png"),
    "avatar6.png": require("../../assets/images/avatar6.png"),
    "avatar7.png": require("../../assets/images/avatar7.png"),
    "avatar8.png": require("../../assets/images/avatar8.png"),
    "avatar9.png": require("../../assets/images/avatar9.png"),
    "avatar10.png": require("../../assets/images/avatar10.png"),
  };

  return avatarMap[avatarName] || avatarMap["avatar6.png"];
};

const Profile = () => {
  const { user, signOutUser } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const currentRank = calculateRank(user.level || 1);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOutUser();
            router.replace("/signIn");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  // Skill data with gradient colors
  const skills: {
    name: string;
    score: number;
    colors: [string, string];
    icon: string;
  }[] = [
    {
      name: "Data Structures",
      score: user.dataStructuresScore || 0,
      colors: ["#667eea", "#764ba2"],
      icon: "🏗️",
    },
    {
      name: "Algorithms",
      score: user.algorithmsScore || 0,
      colors: ["#f093fb", "#f5576c"],
      icon: "⚡",
    },
    {
      name: "Problem Solving",
      score: user.problemSolvingScore || 0,
      colors: ["#4facfe", "#00f2fe"],
      icon: "🧩",
    },
    {
      name: "System Design",
      score: user.systemDesignScore || 0,
      colors: ["#a8edea", "#fed6e3"],
      icon: "🏛️",
    },
    {
      name: "Behavioral",
      score: user.behavioralScore || 0,
      colors: ["#ffecd2", "#fcb69f"],
      icon: "🤝",
    },
  ];

  return (
    <View className="flex-1 bg-pink-500">
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
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-white text-2xl font-bold">Profile</Text>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center">
              <Settings color="white" size={20} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <GlassCard className="items-center mb-6 p-6">
            <View className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white/30 shadow-lg relative z-10">
              <Image
                source={getAvatarSource(user.avatar)}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <Text className="text-gray-800 text-2xl font-bold mb-2">
              {user.name}
            </Text>

            <View className="flex-row items-center mb-6">
              <Mail size={14} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">{user.email}</Text>
            </View>

            <View className="flex-row" style={{ gap: 24 }}>
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center mb-2">
                  <Award color="#667eea" size={20} />
                </View>
                <Text className="text-gray-800 text-lg font-bold">
                  {currentRank}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Rank</Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-green-500/20 items-center justify-center mb-2">
                  <TrendingUp color="#10b981" size={20} />
                </View>
                <Text className="text-gray-800 text-lg font-bold">
                  {user.level || 1}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Level</Text>
              </View>

              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-yellow-500/20 items-center justify-center mb-2">
                  <Zap color="#f59e0b" size={20} />
                </View>
                <Text className="text-gray-800 text-lg font-bold">
                  {user.xp || 0}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">XP</Text>
              </View>
            </View>
          </GlassCard>

          {/* Stats Grid */}
          <View className="flex-row mb-6" style={{ gap: 12 }}>
            <View className="flex-1">
              <GlassCard className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Trophy color="#f59e0b" size={20} />
                  <Text className="text-gray-600 text-xs font-semibold">
                    COMPLETED
                  </Text>
                </View>
                <Text className="text-gray-800 text-2xl font-bold">
                  {user.completedChallenges?.length || 0}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Challenges</Text>
              </GlassCard>
            </View>

            <View className="flex-1">
              <GlassCard className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Star color="#667eea" size={20} />
                  <Text className="text-gray-600 text-xs font-semibold">
                    STREAK
                  </Text>
                </View>
                <Text className="text-gray-800 text-2xl font-bold">
                  {user.streak || 0}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Days</Text>
              </GlassCard>
            </View>
          </View>

          {/* Skills Section */}
          <GlassCard className="mb-6 p-5">
            <Text className="text-gray-800 text-xl font-bold mb-5">
              Skill Breakdown
            </Text>

            {skills.map((skill, index) => (
              <View
                key={index}
                className={`${index < skills.length - 1 ? "mb-5" : ""}`}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-lg mr-3">{skill.icon}</Text>
                    <Text className="text-gray-800 text-sm font-semibold">
                      {skill.name}
                    </Text>
                  </View>
                  <Text className="text-gray-800 text-sm font-bold">
                    {skill.score}%
                  </Text>
                </View>

                <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <LinearGradient
                    colors={skill.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-full rounded-full"
                    style={{ width: `${skill.score}%` }}
                  />
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Progress Overview */}
          <GlassCard className="mb-6 p-5">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Progress Overview
            </Text>

            <View>
              <View className="flex-row justify-between items-center py-3 border-b border-gray-200/50">
                <Text className="text-gray-600 text-sm">
                  Completed Challenges
                </Text>
                <Text className="text-gray-800 text-sm font-bold">
                  {user.completedChallenges?.length || 0}
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-3 border-b border-gray-200/50">
                <Text className="text-gray-600 text-sm">Unlocked Domains</Text>
                <Text className="text-gray-800 text-sm font-bold">
                  {user.unlockedDomains?.length || 1}/5
                </Text>
              </View>

              <View className="flex-row justify-between items-center py-3">
                <Text className="text-gray-600 text-sm">Current Streak</Text>
                <Text className="text-gray-800 text-sm font-bold">
                  {user.streak || 0} days
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Sign Out Button */}
          <Pressable
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleSignOut}
            style={({ pressed }: { pressed: boolean }) => [
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <LogOut size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Sign Out
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
export default Profile;
