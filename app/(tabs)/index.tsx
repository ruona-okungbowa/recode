import useAuthStore from "@/store/auth.store";
import React from "react";
import { Text, View } from "react-native";

const index = () => {
  const { user } = useAuthStore();
  console.log("User", JSON.stringify(user, null, 2));
  return (
    <View className="flex flex-1 justify-center items-center">
      <Text>Home Page</Text>
    </View>
  );
};
export default index;
