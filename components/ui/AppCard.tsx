import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type AppCardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function AppCard({ children, onPress, style, compact = false, accessibilityLabel }: AppCardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          compact ? styles.compact : undefined,
          pressed ? styles.pressed : undefined,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, compact ? styles.compact : undefined, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeTokens.colors.cardElevated,
    borderRadius: ThemeTokens.radius.xl,
    borderWidth: 1,
    borderColor: ThemeTokens.colors.border,
    padding: ThemeTokens.spacing.lg,
    gap: ThemeTokens.spacing.sm,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  compact: {
    padding: ThemeTokens.spacing.md,
    borderRadius: ThemeTokens.radius.lg,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
    opacity: 0.92,
  },
});
