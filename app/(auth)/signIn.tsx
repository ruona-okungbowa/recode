import { signIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import CustomButton from "../componets/CustomButton";
import CustomInput from "../componets/CustomInput";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setform] = useState({ email: "", password: "" });

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
      await signIn({ email, password });
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 mt-20 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        onChangeText={(text) => {
          setform((prev) => ({ ...prev, email: text }));
        }}
        label="Email"
        value={form.email}
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        onChangeText={(text) => {
          setform((prev) => ({ ...prev, password: text }));
        }}
        label="Password"
        secureTextEntry={true}
        keyboardType="default"
      />
      <CustomButton
        title="Sign In"
        isLoading={isSubmitting}
        onPress={handleSubmit}
      />
      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-500">
          Don't have an account?
        </Text>
        <Link href="/signUp" className="base-bold">
          Sign Up
        </Link>
      </View>
    </View>
  );
};
export default SignIn;
