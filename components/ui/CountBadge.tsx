import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme";

type CountBadgeProps = {
  count: number;
};

export function CountBadge({ count }: CountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? "99+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
});
