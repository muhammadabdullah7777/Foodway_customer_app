import { Stack } from "expo-router";

import { Colors } from "@/theme";

export default function StacksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.black,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "700" },
      }}
    />
  );
}
