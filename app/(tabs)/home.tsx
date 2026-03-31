import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AnimatedReveal, AppCard, AppChip, PrimaryButton, ScreenContainer, SectionHeader } from "@/components/ui";
import { categories, promoBanners, restaurants } from "@/data/demoData";
import { formatCurrency, formatEta } from "@/lib/format";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

const featuredRestaurants = restaurants.filter((restaurant) => restaurant.featured);

export default function HomeScreen() {
  const { selectors, state } = useAppStore();
  const firstName = state.profile.fullName.split(" ")[0] || "Guest";

  return (
    <ScreenContainer>
      <SectionHeader title={`Hi ${firstName}`} subtitle="What are you craving today?" />

      <AnimatedReveal>
        <AppCard style={styles.promoCard}>
          <Text style={styles.promoEyebrow}>{promoBanners[0]?.title ?? "Featured Deal"}</Text>
          <Text style={styles.promoTitle}>Fast demos, real UX flow.</Text>
          <Text style={styles.promoDescription}>
            This public-safe demo uses only local data and bundled assets.
          </Text>
          <View style={styles.quickActions}>
            <PrimaryButton
              label="Search"
              onPress={() => router.push("/search")}
              variant="secondary"
              size="sm"
              style={styles.quickActionButton}
            />
            <PrimaryButton
              label="Cart"
              onPress={() => router.push("/cart")}
              variant="secondary"
              size="sm"
              style={styles.quickActionButton}
            />
            <PrimaryButton
              label="Orders"
              onPress={() => router.push("/orders")}
              variant="secondary"
              size="sm"
              style={styles.quickActionButton}
            />
          </View>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={40}>
        <SectionHeader title="Categories" actionLabel="Browse" onActionPress={() => router.push("/search")} />
        <View style={styles.chipsWrap}>
          {categories.map((category) => (
            <AppChip
              key={category}
              label={category}
              onPress={() => router.push({ pathname: "/search", params: { q: category } })}
            />
          ))}
        </View>
      </AnimatedReveal>

      <AnimatedReveal delay={80}>
        <SectionHeader
          title="Featured Restaurants"
          subtitle={`${selectors.cartCount} item(s) in cart`}
          actionLabel="Open Cart"
          onActionPress={() => router.push("/cart")}
        />

        <View style={styles.restaurantList}>
          {featuredRestaurants.map((restaurant, index) => (
            <AnimatedReveal key={restaurant.id} delay={100 + index * 40}>
              <AppCard
                accessibilityLabel={`Open ${restaurant.name}`}
                onPress={() => router.push({ pathname: "/restaurant/[id]", params: { id: restaurant.id } })}
                style={[styles.restaurantCard, { backgroundColor: restaurant.heroTint }]}
              >
                <Text numberOfLines={1} style={styles.restaurantName}>
                  {restaurant.name}
                </Text>
                <Text numberOfLines={2} style={styles.restaurantMeta}>
                  {restaurant.shortDescription}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaPill}>{restaurant.rating.toFixed(1)} rating</Text>
                  <Text style={styles.metaPill}>{formatEta(restaurant.etaMinutes)}</Text>
                  <Text style={styles.metaPill}>{formatCurrency(restaurant.deliveryFee)} fee</Text>
                </View>
              </AppCard>
            </AnimatedReveal>
          ))}
        </View>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  promoCard: {
    backgroundColor: "#FCECEA",
    borderColor: "#F7D4D0",
    gap: ThemeTokens.spacing.md,
  },
  promoEyebrow: {
    color: Colors.primaryDark,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  promoTitle: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.display,
    lineHeight: 30,
  },
  promoDescription: {
    color: Colors.grey700,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  quickActionButton: {
    flexGrow: 1,
    minWidth: 92,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  restaurantList: {
    gap: ThemeTokens.spacing.md,
  },
  restaurantCard: {
    borderWidth: 0,
    padding: ThemeTokens.spacing.lg,
    minHeight: 124,
  },
  restaurantName: {
    color: Colors.black,
    fontSize: ThemeTokens.typography.subtitle,
    fontWeight: "700",
  },
  restaurantMeta: {
    color: Colors.grey700,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
    marginTop: ThemeTokens.spacing.xs,
  },
  metaPill: {
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: ThemeTokens.radius.lg,
    color: Colors.grey900,
    fontWeight: "600",
    fontSize: 12,
  },
});
