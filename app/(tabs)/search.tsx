import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AnimatedReveal, AppCard, AppChip, EmptyState, ScreenContainer, SectionHeader } from "@/components/ui";
import { getRestaurantById, menuItems, restaurants } from "@/data/demoData";
import { formatCurrency, formatEta } from "@/lib/format";
import { runSelectionHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const initialQuery = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "";
  const [query, setQuery] = useState(initialQuery);
  const { actions, state } = useAppStore();

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredRestaurants = useMemo(() => {
    if (!normalizedQuery) {
      return restaurants;
    }
    return restaurants.filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.category} ${restaurant.tags.join(" ")}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }
    return menuItems.filter((menuItem) => {
      const restaurant = getRestaurantById(menuItem.restaurantId);
      const haystack =
        `${menuItem.name} ${menuItem.description} ${menuItem.dietaryTag ?? ""} ${restaurant?.name ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  const submitSearch = async (incoming?: string) => {
    const value = (incoming ?? query).trim();
    if (!value) {
      return;
    }
    actions.addRecentSearch(value);
    await runSelectionHaptic();
  };

  const hasNoResults = normalizedQuery.length > 0 && filteredRestaurants.length === 0 && filteredItems.length === 0;

  return (
    <ScreenContainer>
      <SectionHeader title="Search" subtitle="Find restaurants, dishes, and favorites." />

      <AnimatedReveal>
        <View style={styles.searchWrap}>
          <Text style={styles.searchHint}>Tip: category names also work (for example: Pizza or Vegan)</Text>
          <TextInput
            accessibilityLabel="Search restaurants and dishes"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setQuery}
            onEndEditing={() => {
              void submitSearch();
            }}
            onSubmitEditing={() => {
              void submitSearch();
            }}
            placeholder="Try: vegan bowl, pizza, burger..."
            placeholderTextColor={Colors.grey600}
            style={styles.searchInput}
            value={query}
          />
        </View>
      </AnimatedReveal>

      {state.recentSearches.length > 0 ? (
        <AnimatedReveal delay={40}>
          <View style={styles.recentSection}>
            <SectionHeader title="Recent" actionLabel="Clear" onActionPress={actions.clearRecentSearches} />
            <View style={styles.recentWrap}>
              {state.recentSearches.map((recent) => (
                <AppChip
                  key={recent}
                  label={recent}
                  onPress={() => {
                    setQuery(recent);
                    void submitSearch(recent);
                  }}
                  selected={recent === normalizedQuery}
                />
              ))}
            </View>
          </View>
        </AnimatedReveal>
      ) : null}

      {hasNoResults ? (
        <EmptyState
          title="No results found"
          description="Try another keyword or browse featured restaurants from Home."
          icon="search-outline"
          actionLabel="Back to Home"
          onActionPress={() => router.push("/home")}
        />
      ) : (
        <>
          <AnimatedReveal delay={70}>
            <SectionHeader title="Restaurants" subtitle={`${filteredRestaurants.length} match(es)`} />
          </AnimatedReveal>
          <View style={styles.resultsWrap}>
            {filteredRestaurants.map((restaurant, index) => (
              <AnimatedReveal key={restaurant.id} delay={100 + index * 35}>
                <AppCard
                  accessibilityLabel={`Open ${restaurant.name}`}
                  onPress={() => router.push({ pathname: "/restaurant/[id]", params: { id: restaurant.id } })}
                >
                  <Text numberOfLines={1} style={styles.resultTitle}>
                    {restaurant.name}
                  </Text>
                  <Text style={styles.resultMeta}>
                    {restaurant.category} | {formatEta(restaurant.etaMinutes)} |{" "}
                    {formatCurrency(restaurant.deliveryFee)}
                  </Text>
                  <Text numberOfLines={2} style={styles.resultDescription}>
                    {restaurant.shortDescription}
                  </Text>
                </AppCard>
              </AnimatedReveal>
            ))}
          </View>

          {filteredItems.length > 0 ? (
            <>
              <AnimatedReveal delay={120}>
                <SectionHeader title="Dishes" subtitle={`${filteredItems.length} match(es)`} />
              </AnimatedReveal>
              <View style={styles.resultsWrap}>
                {filteredItems.map((item, index) => {
                  const restaurant = getRestaurantById(item.restaurantId);
                  return (
                    <AnimatedReveal key={item.id} delay={140 + index * 25}>
                      <AppCard
                        accessibilityLabel={`Open item ${item.name}`}
                        onPress={() => router.push({ pathname: "/item/[id]", params: { id: item.id } })}
                      >
                        <View style={styles.rowBetween}>
                          <Text numberOfLines={1} style={styles.resultTitle}>
                            {item.name}
                          </Text>
                          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                        </View>
                        <Text numberOfLines={1} style={styles.resultMeta}>
                          {restaurant?.name ?? "Unknown Restaurant"}
                        </Text>
                        <Text numberOfLines={2} style={styles.resultDescription}>
                          {item.description}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() =>
                            router.push({
                              pathname: "/restaurant/[id]",
                              params: { id: item.restaurantId },
                            })
                          }
                        >
                          <Text style={styles.linkText}>View restaurant</Text>
                        </Pressable>
                      </AppCard>
                    </AnimatedReveal>
                  );
                })}
              </View>
            </>
          ) : null}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    gap: ThemeTokens.spacing.sm,
  },
  searchHint: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: Colors.white,
    borderRadius: ThemeTokens.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 50,
    color: Colors.black,
    fontSize: ThemeTokens.typography.body,
  },
  recentSection: {
    gap: ThemeTokens.spacing.sm,
  },
  recentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  resultsWrap: {
    gap: ThemeTokens.spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  resultTitle: {
    fontSize: ThemeTokens.typography.subtitle,
    color: Colors.black,
    fontWeight: "700",
    flex: 1,
  },
  resultMeta: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  resultDescription: {
    color: Colors.grey700,
    lineHeight: 20,
  },
  price: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.small,
  },
});
