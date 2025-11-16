import useAuthStore from "@/store/auth.store";
import { Redirect, Tabs } from "expo-router";
import { Home, LibraryBig, User } from "lucide-react-native";

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/signIn" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#667eea",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderTopWidth: 0,
          height: 50,
          paddingBottom: 6,
          paddingTop: 6,
          marginBottom: 20,
          marginHorizontal: 30,
          borderRadius: 16,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
          backdropFilter: "blur(10px)",
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarIcon: ({ color, size }) => (
            <LibraryBig color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="[domainId]"
        options={{
          href: null, // Hide domain topics route from tab bar
        }}
      />
    </Tabs>
  );
}
