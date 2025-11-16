import CustomButton from "@/componets/CustomButton";
import CustomInput from "@/componets/CustomInput";
import useAuthStore from "@/store/auth.store";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { BookOpen, Lock, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setform] = useState({ name: "", email: "", password: "" });
  const { signUpUser } = useAuthStore();

  const handleSubmit = async () => {
    const { email, name, password } = form;
    if (!name || !email || !password) {
      return Alert.alert("Error", "Please a valid email address and password");
    }
    setIsSubmitting(true);
    try {
      await signUpUser(name, email, password);
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
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-6">
              <BookOpen color="white" size={32} />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">
              Join ReCode
            </Text>
            <Text className="text-white/80 text-base text-center">
              Create your account and start your coding journey
            </Text>
          </View>
          <View className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
            <Text className="text-gray-800 text-2xl font-bold mb-8 text-center">
              Create Account
            </Text>

            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <User color="#f5576c" size={20} />
                <Text className="text-gray-700 text-sm font-semibold ml-2">
                  Full Name
                </Text>
              </View>
              <CustomInput
                placeholder="Enter your full name"
                onChangeText={(text) => {
                  setform((prev) => ({ ...prev, name: text }));
                }}
                value={form.name}
              />
            </View>

            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Mail color="#f5576c" size={20} />
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
                <Lock color="#f5576c" size={20} />
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
              title="Create Account"
              isLoading={isSubmitting}
              onPress={handleSubmit}
              variant="primary"
              style="w-full"
            />

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-sm">
                Already have an account?{" "}
              </Text>
              <Link href="/signIn">
                <Text className="text-blue-600 text-sm font-bold">Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default SignUp;
