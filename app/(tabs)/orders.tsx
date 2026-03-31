import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AnimatedReveal, AppCard, EmptyState, PrimaryButton, ScreenContainer, SectionHeader } from "@/components/ui";
import { getRestaurantById, orderStatusLabels, paymentMethodLabels } from "@/data/demoData";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

const statusColor: Record<string, { text: string; bg: string }> = {
  placed: { text: "#8A4B00", bg: "#FFF4E6" },
  preparing: { text: "#8A4B00", bg: "#FFF4E6" },
  on_the_way: { text: "#1E4FA8", bg: "#E9F1FF" },
  delivered: { text: "#0F6637", bg: "#EAF8EE" },
};

export default function OrdersScreen() {
  const router = useRouter();
  const { state } = useAppStore();

  if (state.orders.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          title="No orders yet"
          description="Place your first demo order from Home to see order history and tracking."
          icon="receipt-outline"
          actionLabel="Start Ordering"
          onActionPress={() => router.push("/home")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader title="Orders" subtitle={`${state.orders.length} order(s)`} />

      <View style={styles.listWrap}>
        {state.orders.map((order, index) => {
          const restaurant = getRestaurantById(order.restaurantId);
          const statusStyle = statusColor[order.status] ?? { text: Colors.grey700, bg: Colors.grey100 };

          return (
            <AnimatedReveal key={order.id} delay={60 + index * 40}>
              <AppCard>
                <View style={styles.rowBetween}>
                  <Text numberOfLines={1} style={styles.restaurantName}>
                    {restaurant?.name ?? "Unknown Restaurant"}
                  </Text>
                  <Text style={[styles.status, { color: statusStyle.text, backgroundColor: statusStyle.bg }]}>
                    {orderStatusLabels[order.status]}
                  </Text>
                </View>
                <Text style={styles.metaText}>
                  {formatDateTime(order.createdAtIso)} | {paymentMethodLabels[order.paymentMethod]}
                </Text>
                <Text style={styles.metaText}>
                  {order.items.length} item(s) | Total {formatCurrency(order.total)}
                </Text>
                <View style={styles.actionRow}>
                  <PrimaryButton
                    label="Details"
                    variant="secondary"
                    style={styles.actionButton}
                    onPress={() => router.push({ pathname: "/orders/[id]", params: { id: order.id } })}
                  />
                  {order.status !== "delivered" ? (
                    <PrimaryButton
                      label="Track"
                      style={styles.actionButton}
                      onPress={() => router.push({ pathname: "/tracking/[id]", params: { id: order.id } })}
                    />
                  ) : null}
                </View>
              </AppCard>
            </AnimatedReveal>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    gap: ThemeTokens.spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  restaurantName: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.subtitle,
    flex: 1,
  },
  status: {
    fontWeight: "700",
    textTransform: "capitalize",
    fontSize: ThemeTokens.typography.caption,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: ThemeTokens.radius.pill,
  },
  metaText: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
    marginTop: ThemeTokens.spacing.xs,
  },
  actionButton: {
    flexGrow: 1,
    minWidth: 120,
  },
});
