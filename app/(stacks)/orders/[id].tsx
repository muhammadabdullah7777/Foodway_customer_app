import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import {
  AnimatedReveal,
  AppCard,
  EmptyState,
  PriceRow,
  PrimaryButton,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import { getMenuItemById, getRestaurantById, orderStatusLabels, paymentMethodLabels } from "@/data/demoData";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const orderId = normalizeParam(params.id);
  const { state } = useAppStore();
  const order = orderId ? state.orders.find((entry) => entry.id === orderId) : undefined;

  if (!orderId || !order) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Order details" }} />
        <EmptyState
          title="Order not found"
          description="The requested order ID is invalid or has not been created yet."
          icon="warning-outline"
          actionLabel="Back to Orders"
          onActionPress={() => router.replace("/orders")}
        />
      </ScreenContainer>
    );
  }

  const restaurant = getRestaurantById(order.restaurantId);
  const address = state.addresses.find((entry) => entry.id === order.addressId);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: `Order ${order.id.slice(-5)}` }} />

      <AnimatedReveal>
        <AppCard>
          <SectionHeader title={restaurant?.name ?? "Unknown Restaurant"} />
          <Text style={styles.metaText}>{formatDateTime(order.createdAtIso)}</Text>
          <Text style={styles.metaText}>
            Status: {orderStatusLabels[order.status]} | Payment: {paymentMethodLabels[order.paymentMethod]}
          </Text>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={50}>
        <AppCard>
          <SectionHeader title="Items" />
          <View style={styles.listWrap}>
            {order.items.map((line) => {
              const menuItem = getMenuItemById(line.itemId);
              return (
                <View key={`${line.itemId}-${line.notes ?? "none"}`} style={styles.lineItem}>
                  <View style={styles.rowBetween}>
                    <Text numberOfLines={1} style={styles.itemName}>
                      {menuItem?.name ?? line.itemId}
                    </Text>
                    <Text style={styles.itemPrice}>{formatCurrency(line.priceAtPurchase * line.quantity)}</Text>
                  </View>
                  <Text style={styles.itemMeta}>
                    Qty {line.quantity} | {formatCurrency(line.priceAtPurchase)} each
                  </Text>
                  {line.notes ? (
                    <Text numberOfLines={2} style={styles.itemMeta}>
                      Note: {line.notes}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={80}>
        <AppCard>
          <SectionHeader title="Charges" />
          <PriceRow label="Subtotal" value={formatCurrency(order.subtotal)} />
          <PriceRow label="Delivery Fee" value={formatCurrency(order.deliveryFee)} />
          <PriceRow label="Service Fee" value={formatCurrency(order.serviceFee)} />
          <View style={styles.divider} />
          <PriceRow label="Total Paid" value={formatCurrency(order.total)} emphasize />
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={110}>
        <AppCard>
          <SectionHeader title="Delivery Address" />
          <Text style={styles.addressText}>{address?.label ?? "Unknown"}</Text>
          <Text style={styles.addressText}>{address?.line1 ?? "Address unavailable"}</Text>
          <Text style={styles.addressText}>{address?.city ?? "City unavailable"}</Text>
        </AppCard>
      </AnimatedReveal>

      <View style={styles.actions}>
        {order.status !== "delivered" ? (
          <PrimaryButton
            fullWidth
            label="Track Order"
            onPress={() => router.push({ pathname: "/tracking/[id]", params: { id: order.id } })}
          />
        ) : null}
        <PrimaryButton fullWidth label="Back to Orders" variant="secondary" onPress={() => router.replace("/orders")} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  metaText: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  listWrap: {
    gap: ThemeTokens.spacing.sm,
  },
  lineItem: {
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: ThemeTokens.radius.md,
    padding: ThemeTokens.spacing.sm,
    gap: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  itemName: {
    color: Colors.black,
    fontWeight: "700",
    flex: 1,
  },
  itemPrice: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  itemMeta: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey200,
    marginVertical: ThemeTokens.spacing.xs,
  },
  addressText: {
    color: Colors.grey700,
  },
  actions: {
    gap: ThemeTokens.spacing.sm,
  },
});
