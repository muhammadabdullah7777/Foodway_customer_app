import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import {
  AnimatedReveal,
  AppCard,
  EmptyState,
  PriceRow,
  PrimaryButton,
  QuantityStepper,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import { getMenuItemById } from "@/data/demoData";
import { formatCurrency } from "@/lib/format";
import { runSelectionHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

export default function CartScreen() {
  const router = useRouter();
  const { actions, selectors, state } = useAppStore();

  const cartEntries = state.cart
    .map((line) => {
      const menuItem = getMenuItemById(line.itemId);
      if (!menuItem) {
        return null;
      }
      return {
        ...line,
        menuItem,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (cartEntries.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Your cart is empty"
          description="Explore restaurants and add a few demo items to continue checkout."
          icon="cart-outline"
          actionLabel="Browse Food"
          onActionPress={() => router.push("/home")}
        />
      </ScreenContainer>
    );
  }

  const stickyFooter = (
    <View style={styles.footerActions}>
      <PrimaryButton label="Clear Cart" variant="secondary" onPress={actions.clearCart} style={styles.footerButton} />
      <PrimaryButton
        label="Continue to Checkout"
        onPress={async () => {
          await runSelectionHaptic();
          router.push("/checkout");
        }}
        style={styles.footerButton}
      />
    </View>
  );

  return (
    <ScreenContainer footer={stickyFooter}>
      <SectionHeader title="Cart" subtitle={`${selectors.cartCount} item(s)`} />

      <View style={styles.itemsWrap}>
        {cartEntries.map((entry, index) => (
          <AnimatedReveal key={entry.itemId} delay={50 + index * 35}>
            <AppCard>
              <View style={styles.rowBetween}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {entry.menuItem.name}
                </Text>
                <Text style={styles.itemPrice}>{formatCurrency(entry.menuItem.price * entry.quantity)}</Text>
              </View>
              <Text style={styles.itemMeta}>{formatCurrency(entry.menuItem.price)} each</Text>
              {entry.notes ? (
                <Text numberOfLines={2} style={styles.notes}>
                  Note: {entry.notes}
                </Text>
              ) : null}
              <View style={styles.rowBetween}>
                <QuantityStepper
                  quantity={entry.quantity}
                  onDecrement={() => actions.updateQuantity(entry.itemId, entry.quantity - 1)}
                  onIncrement={() => actions.updateQuantity(entry.itemId, entry.quantity + 1)}
                />
                <PrimaryButton
                  label="Remove"
                  variant="ghost"
                  size="sm"
                  onPress={() => actions.removeFromCart(entry.itemId)}
                />
              </View>
            </AppCard>
          </AnimatedReveal>
        ))}
      </View>

      <AnimatedReveal delay={80}>
        <AppCard>
          <SectionHeader title="Order Summary" />
          <PriceRow label="Subtotal" value={formatCurrency(selectors.cartSummary.subtotal)} />
          <PriceRow label="Delivery Fee" value={formatCurrency(selectors.cartSummary.deliveryFee)} />
          <PriceRow label="Service Fee" value={formatCurrency(selectors.cartSummary.serviceFee)} />
          <View style={styles.divider} />
          <PriceRow label="Total" value={formatCurrency(selectors.cartSummary.total)} emphasize />
        </AppCard>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  itemsWrap: {
    gap: ThemeTokens.spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ThemeTokens.spacing.sm,
  },
  itemName: {
    flex: 1,
    color: Colors.black,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.subtitle,
  },
  itemMeta: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  itemPrice: {
    color: Colors.primaryDark,
    fontWeight: "700",
  },
  notes: {
    color: Colors.grey700,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey200,
    marginVertical: ThemeTokens.spacing.xs,
  },
  footerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  footerButton: {
    flexGrow: 1,
    minWidth: 140,
  },
});
