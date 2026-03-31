import { LoadingState } from "@/components/ui";
import { AppStoreProvider, useAppStore } from "@/store/AppStore";
import { navTheme } from "@/theme";
import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

function RootNavigator() {
  const { hydrated } = useAppStore();

  if (!hydrated) {
    return <LoadingState />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AppStoreProvider>
      <ThemeProvider value={navTheme}>
        <RootNavigator />
      </ThemeProvider>
    </AppStoreProvider>
  );
}
