import { Stack } from "expo-router";

export default function LearningLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="quest/[id]" />
      <Stack.Screen name="challenge/[id]" />
      <Stack.Screen name="domain" />
      <Stack.Screen name="[domainId]/topics" />
      <Stack.Screen name="[topicId]/index" />
    </Stack>
  );
}
