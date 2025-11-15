import useAuthStore from "@/store/auth.store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);
  if (isLoading) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
