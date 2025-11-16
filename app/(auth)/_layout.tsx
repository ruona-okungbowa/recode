import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="h-full w-full bg-[#7a50a5]"
        keyboardShouldPersistTaps="handled"
      >
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
