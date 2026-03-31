import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type AppChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function AppChip({ label, selected = false, onPress, style }: AppChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : undefined,
        pressed ? styles.chipPressed : undefined,
        style,
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: ThemeTokens.radius.pill,
    borderWidth: 1,
    borderColor: ThemeTokens.colors.border,
    backgroundColor: Colors.grey50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: "center",
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  chipPressed: {
    opacity: 0.82,
  },
  text: {
    color: Colors.grey700,
    fontWeight: "600",
    fontSize: 13,
  },
  textSelected: {
    color: Colors.primaryDark,
  },
});
