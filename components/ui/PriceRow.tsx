import { StyleSheet, Text, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type PriceRowProps = {
  label: string;
  value: string;
  emphasize?: boolean;
};

export function PriceRow({ label, value, emphasize = false }: PriceRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, emphasize ? styles.emphasize : undefined]}>{label}</Text>
      <Text style={[styles.value, emphasize ? styles.emphasize : undefined]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  label: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  value: {
    color: Colors.grey900,
    fontWeight: "600",
  },
  emphasize: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.body,
  },
});
