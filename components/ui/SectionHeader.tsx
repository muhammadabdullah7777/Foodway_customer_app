import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onActionPress}
          style={({ pressed }) => [styles.actionWrap, pressed ? styles.actionPressed : undefined]}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: ThemeTokens.spacing.md,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.black,
  },
  subtitle: {
    fontSize: ThemeTokens.typography.small,
    color: Colors.grey700,
  },
  actionWrap: {
    minHeight: 36,
    justifyContent: "center",
  },
  actionPressed: {
    opacity: 0.75,
  },
  action: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.small,
  },
});
