import CustomButton from "@/componets/CustomButton";
import CustomInput from "@/componets/CustomInput";
import useAuthStore from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { BookOpen, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setform] = useState({ email: "", password: "" });
  const { signInUser } = useAuthStore();

  const handleSubmit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      return Alert.alert(
        "Error",
        "Please enter a valid email address and password"
      );
    }

    setIsSubmitting(true);

    try {
      await signInUser(email, password);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-6">
              <BookOpen color="white" size={32} />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              Welcome Back
            </Text>
            <Text className="text-white/80 text-base text-center">
              Sign in to continue your learning journey
            </Text>
          </View>

          {/* Sign In Form */}
          <View className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <Text className="text-gray-800 text-2xl font-bold mb-8 text-center">
              Sign In
            </Text>

            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Mail color="#667eea" size={20} />
                <Text className="text-gray-700 text-sm font-semibold ml-2">
                  Email Address
                </Text>
              </View>
              <CustomInput
                placeholder="Enter your email"
                onChangeText={(text) => {
                  setform((prev) => ({ ...prev, email: text }));
                }}
                value={form.email}
                keyboardType="email-address"
              />
            </View>

            <View className="mb-8">
              <View className="flex-row items-center mb-3">
                <Lock color="#667eea" size={20} />
                <Text className="text-gray-700 text-sm font-semibold ml-2">
                  Password
                </Text>
              </View>
              <CustomInput
                placeholder="Enter your password"
                onChangeText={(text) => {
                  setform((prev) => ({ ...prev, password: text }));
                }}
                secureTextEntry={true}
                keyboardType="default"
              />
            </View>

            <CustomButton
              title="Sign In"
              isLoading={isSubmitting}
              onPress={handleSubmit}
              variant="primary"
              style="w-full"
            />

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-sm">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/signUp">
                <Text className="text-blue-600 text-sm font-bold">Sign Up</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default SignIn;
