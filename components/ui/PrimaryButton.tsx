import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "sm";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  style,
  labelStyle,
  fullWidth = false,
}: PrimaryButtonProps) {
  const buttonDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={buttonDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.baseSmall : undefined,
        fullWidth ? styles.fullWidth : undefined,
        variant === "primary" ? styles.primary : undefined,
        variant === "secondary" ? styles.secondary : undefined,
        variant === "ghost" ? styles.ghost : undefined,
        pressed && !buttonDisabled ? styles.pressed : undefined,
        buttonDisabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={variant === "primary" ? Colors.white : Colors.primary} size="small" />
        ) : null}
        <Text
          style={[
            styles.label,
            size === "sm" ? styles.labelSmall : undefined,
            variant === "primary" ? styles.labelPrimary : undefined,
            variant !== "primary" ? styles.labelSecondary : undefined,
            labelStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: ThemeTokens.radius.md,
    justifyContent: "center",
    paddingHorizontal: ThemeTokens.spacing.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  baseSmall: {
    minHeight: 42,
    paddingHorizontal: ThemeTokens.spacing.md,
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  secondary: {
    backgroundColor: Colors.primarySoft,
    borderWidth: 1,
    borderColor: "#F4B7B7",
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: ThemeTokens.colors.border,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ translateY: 0.5 }],
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  label: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontSize: 13,
  },
  labelPrimary: {
    color: Colors.white,
  },
  labelSecondary: {
    color: Colors.primaryDark,
  },
});
