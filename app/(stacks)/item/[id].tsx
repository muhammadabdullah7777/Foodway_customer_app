import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import {
  AnimatedReveal,
  AppCard,
  EmptyState,
  PrimaryButton,
  QuantityStepper,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import { getMenuItemById, getRestaurantById } from "@/data/demoData";
import { formatCurrency } from "@/lib/format";
import { runSoftSuccessHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const itemId = normalizeParam(params.id);
  const item = itemId ? getMenuItemById(itemId) : undefined;
  const restaurant = item ? getRestaurantById(item.restaurantId) : undefined;
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const { actions } = useAppStore();

  const totalPrice = useMemo(() => (item ? item.price * quantity : 0), [item, quantity]);

  if (!itemId || !item || !restaurant) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Item" }} />
        <EmptyState
          title="Item not found"
          description="The requested dish ID is invalid or missing from demo data."
          icon="warning-outline"
          actionLabel="Go to Search"
          onActionPress={() => router.replace("/search")}
        />
      </ScreenContainer>
    );
  }

  const itemFooter = (
    <View style={styles.actionWrap}>
      <PrimaryButton
        fullWidth
        label={`Add to Cart | ${formatCurrency(totalPrice)}`}
        onPress={async () => {
          const result = actions.addToCart(item.id, quantity, notes);
          await runSoftSuccessHaptic();
          if (result.replacedExisting) {
            Alert.alert("Cart switched", "Cart was reset to match this restaurant.");
          }
          router.push("/cart");
        }}
      />
      <PrimaryButton fullWidth label="Back to Restaurant" variant="secondary" onPress={() => router.back()} />
    </View>
  );

  return (
    <ScreenContainer footer={itemFooter}>
      <Stack.Screen options={{ title: item.name }} />

      <AnimatedReveal>
        <AppCard style={styles.heroCard}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.meta}>
            {item.calories} cal {item.dietaryTag ? `| ${item.dietaryTag}` : ""}
          </Text>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={60}>
        <AppCard>
          <SectionHeader title="Customize" />
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Quantity</Text>
            <QuantityStepper
              quantity={quantity}
              onDecrement={() => setQuantity((prev) => Math.max(1, prev - 1))}
              onIncrement={() => setQuantity((prev) => prev + 1)}
            />
          </View>

          <Text style={styles.label}>Kitchen notes (optional)</Text>
          <TextInput
            accessibilityLabel="Kitchen notes"
            multiline
            numberOfLines={3}
            onChangeText={setNotes}
            placeholder="Example: less spicy, no onions"
            placeholderTextColor={Colors.grey600}
            style={styles.notesInput}
            value={notes}
          />
        </AppCard>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FFF2EE",
    borderColor: "#F8D8D0",
  },
  restaurantName: {
    color: Colors.primaryDark,
    fontSize: ThemeTokens.typography.small,
    fontWeight: "700",
  },
  itemName: {
    color: Colors.black,
    fontSize: ThemeTokens.typography.title,
    fontWeight: "700",
    lineHeight: 32,
  },
  description: {
    color: Colors.grey700,
    lineHeight: 20,
  },
  meta: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ThemeTokens.spacing.sm,
  },
  label: {
    color: Colors.grey700,
    fontWeight: "600",
    fontSize: ThemeTokens.typography.small,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: Colors.white,
    borderRadius: ThemeTokens.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.black,
    textAlignVertical: "top",
    minHeight: 84,
  },
  actionWrap: {
    gap: ThemeTokens.spacing.sm,
  },
});
