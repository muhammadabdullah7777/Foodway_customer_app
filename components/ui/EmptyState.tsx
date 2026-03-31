import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

import { PrimaryButton } from "./PrimaryButton";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  title,
  description,
  icon = "alert-circle-outline",
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons color={Colors.primary} name={icon} size={26} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onActionPress ? (
        <View style={styles.actionWrap}>
          <PrimaryButton label={actionLabel} onPress={onActionPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ThemeTokens.radius.lg,
    borderWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: ThemeTokens.spacing.xl,
    paddingVertical: ThemeTokens.spacing.xl,
    gap: ThemeTokens.spacing.sm,
    minHeight: 220,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECEC",
  },
  title: {
    fontSize: ThemeTokens.typography.subtitle,
    fontWeight: "700",
    color: Colors.black,
    textAlign: "center",
  },
  description: {
    color: Colors.grey700,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
  },
  actionWrap: {
    marginTop: ThemeTokens.spacing.sm,
    width: "100%",
  },
});
