import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading your demo experience..." }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeTokens.colors.background,
    gap: ThemeTokens.spacing.md,
    paddingHorizontal: ThemeTokens.spacing.lg,
  },
  label: {
    color: Colors.grey700,
    textAlign: "center",
  },
});
