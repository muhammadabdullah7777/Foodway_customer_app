import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";

import { AnimatedReveal, AppCard, EmptyState, PrimaryButton, ScreenContainer, SectionHeader } from "@/components/ui";
import { getMenuForRestaurant, getRestaurantById } from "@/data/demoData";
import { formatCurrency, formatEta } from "@/lib/format";
import { runSelectionHaptic, runSoftSuccessHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function RestaurantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const restaurantId = normalizeParam(params.id);
  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const menu = restaurantId ? getMenuForRestaurant(restaurantId) : [];
  const { actions, selectors } = useAppStore();

  if (!restaurantId || !restaurant) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Restaurant" }} />
        <EmptyState
          title="Restaurant not found"
          description="The requested restaurant ID is invalid or no longer available in demo data."
          icon="warning-outline"
          actionLabel="Back to Home"
          onActionPress={() => router.replace("/home")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: restaurant.name }} />

      <AnimatedReveal>
        <AppCard style={[styles.heroCard, { backgroundColor: restaurant.heroTint }]}>
          <Text style={styles.heroTitle}>{restaurant.name}</Text>
          <Text style={styles.heroDescription}>{restaurant.shortDescription}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaPill}>{restaurant.rating.toFixed(1)} rating</Text>
            <Text style={styles.metaPill}>{formatEta(restaurant.etaMinutes)}</Text>
            <Text style={styles.metaPill}>{formatCurrency(restaurant.deliveryFee)} fee</Text>
          </View>
        </AppCard>
      </AnimatedReveal>

      <SectionHeader title="Menu" subtitle={`${menu.length} item(s)`} />
      <View style={styles.listWrap}>
        {menu.map((item, index) => (
          <AnimatedReveal key={item.id} delay={60 + index * 30}>
            <AppCard
              accessibilityLabel={`Open ${item.name}`}
              onPress={() => router.push({ pathname: "/item/[id]", params: { id: item.id } })}
            >
              <View style={styles.rowBetween}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.name}
                </Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              </View>
              <Text numberOfLines={2} style={styles.itemDescription}>
                {item.description}
              </Text>
              <View style={styles.actionRow}>
                <PrimaryButton
                  label="View Item"
                  variant="secondary"
                  size="sm"
                  style={styles.actionButton}
                  onPress={() => router.push({ pathname: "/item/[id]", params: { id: item.id } })}
                />
                <PrimaryButton
                  label="Add"
                  size="sm"
                  style={styles.actionButton}
                  onPress={async () => {
                    const result = actions.addToCart(item.id, 1);
                    await runSoftSuccessHaptic();
                    if (result.replacedExisting) {
                      Alert.alert("Cart switched", "Your cart was updated for this restaurant.");
                    }
                  }}
                />
              </View>
            </AppCard>
          </AnimatedReveal>
        ))}
      </View>

      {selectors.cartCount > 0 ? (
        <PrimaryButton
          label={`View Cart (${selectors.cartCount})`}
          onPress={async () => {
            await runSelectionHaptic();
            router.push("/cart");
          }}
        />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderWidth: 0,
  },
  heroTitle: {
    fontSize: ThemeTokens.typography.title,
    fontWeight: "700",
    color: Colors.black,
  },
  heroDescription: {
    color: Colors.grey700,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  metaPill: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: ThemeTokens.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: Colors.grey900,
    fontWeight: "600",
    fontSize: 12,
  },
  listWrap: {
    gap: ThemeTokens.spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ThemeTokens.spacing.sm,
  },
  itemName: {
    fontSize: ThemeTokens.typography.subtitle,
    fontWeight: "700",
    color: Colors.black,
    flex: 1,
  },
  itemDescription: {
    color: Colors.grey700,
    lineHeight: 20,
  },
  price: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
    minWidth: 110,
  },
});
