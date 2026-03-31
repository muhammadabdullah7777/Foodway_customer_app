import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { runSelectionHaptic } from "@/lib/haptics";
import { Colors, ThemeTokens } from "@/theme";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
};

export function QuantityStepper({ quantity, onIncrement, onDecrement, min = 1 }: QuantityStepperProps) {
  const onDecreasePress = async () => {
    await runSelectionHaptic();
    onDecrement();
  };

  const onIncreasePress = async () => {
    await runSelectionHaptic();
    onIncrement();
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        style={({ pressed }) => [
          styles.control,
          quantity <= min ? styles.disabledControl : undefined,
          pressed && quantity > min ? styles.pressedControl : undefined,
        ]}
        disabled={quantity <= min}
        onPress={() => {
          void onDecreasePress();
        }}
      >
        <Ionicons color={Colors.grey700} name="remove" size={16} />
      </Pressable>
      <Text style={styles.value}>{quantity}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={({ pressed }) => [styles.control, pressed ? styles.pressedControl : undefined]}
        onPress={() => {
          void onIncreasePress();
        }}
      >
        <Ionicons color={Colors.grey700} name="add" size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  control: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.grey100,
    borderWidth: 1,
    borderColor: ThemeTokens.colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledControl: {
    opacity: 0.5,
  },
  pressedControl: {
    opacity: 0.8,
  },
  value: {
    minWidth: 22,
    textAlign: "center",
    color: Colors.black,
    fontWeight: "700",
  },
});
