import useAuthStore from "@/store/auth.store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import "./globals.css";

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return <Stack screenOptions={{ headerShown: false }} />;
}
