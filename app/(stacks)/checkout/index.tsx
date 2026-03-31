import { Stack, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import {
  AnimatedReveal,
  AppCard,
  AppChip,
  EmptyState,
  PriceRow,
  PrimaryButton,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import { paymentMethodLabels } from "@/data/demoData";
import type { PaymentMethod } from "@/data/types";
import { formatCurrency } from "@/lib/format";
import { runSoftSuccessHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

const paymentOptions: PaymentMethod[] = ["card", "cash", "wallet"];

export default function CheckoutScreen() {
  const router = useRouter();
  const { actions, selectors, state } = useAppStore();
  const [selectedAddressId, setSelectedAddressId] = useState(selectors.defaultAddress?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedAddressId && selectors.defaultAddress?.id) {
      setSelectedAddressId(selectors.defaultAddress.id);
    }
  }, [selectedAddressId, selectors.defaultAddress?.id]);

  const activeAddress = useMemo(
    () => state.addresses.find((address) => address.id === selectedAddressId),
    [selectedAddressId, state.addresses]
  );

  if (state.cart.length === 0) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Checkout" }} />
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          icon="cart-outline"
          actionLabel="Go to Cart"
          onActionPress={() => router.replace("/cart")}
        />
      </ScreenContainer>
    );
  }

  const checkoutFooter = (
    <PrimaryButton
      fullWidth
      label="Place Order"
      loading={submitting}
      onPress={async () => {
        if (!activeAddress) {
          Alert.alert("Address required", "Please select or add an address before placing an order.");
          return;
        }

        setSubmitting(true);
        const orderId = actions.placeOrder({
          addressId: activeAddress.id,
          paymentMethod,
        });
        setSubmitting(false);

        if (!orderId) {
          Alert.alert("Unable to place order", "Please review your cart and try again.");
          return;
        }

        await runSoftSuccessHaptic();
        router.replace({ pathname: "/orders/[id]", params: { id: orderId } });
      }}
    />
  );

  return (
    <ScreenContainer footer={checkoutFooter}>
      <Stack.Screen options={{ title: "Checkout" }} />

      <AnimatedReveal>
        <AppCard>
          <SectionHeader title="Delivery Address" actionLabel="Manage" onActionPress={() => router.push("/address")} />
          <View style={styles.addressList}>
            {state.addresses.map((address) => {
              const selected = address.id === selectedAddressId;
              return (
                <Pressable
                  key={address.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${address.label} address`}
                  onPress={() => setSelectedAddressId(address.id)}
                  style={({ pressed }) => [
                    styles.addressItem,
                    selected ? styles.addressSelected : undefined,
                    pressed ? styles.addressPressed : undefined,
                  ]}
                >
                  <Text style={styles.addressLabel}>
                    {address.label} {address.isDefault ? "(Default)" : ""}
                  </Text>
                  <Text style={styles.addressText}>{address.line1}</Text>
                  <Text style={styles.addressText}>{address.city}</Text>
                </Pressable>
              );
            })}
          </View>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={45}>
        <AppCard>
          <SectionHeader title="Payment" />
          <View style={styles.paymentWrap}>
            {paymentOptions.map((option) => (
              <AppChip
                key={option}
                label={paymentMethodLabels[option]}
                selected={paymentMethod === option}
                onPress={() => setPaymentMethod(option)}
              />
            ))}
          </View>
        </AppCard>
      </AnimatedReveal>

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
  addressList: {
    gap: ThemeTokens.spacing.sm,
  },
  addressItem: {
    borderWidth: 1,
    borderColor: Colors.grey300,
    borderRadius: ThemeTokens.radius.md,
    padding: ThemeTokens.spacing.md,
    backgroundColor: Colors.white,
    gap: 2,
  },
  addressSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#FFF3F3",
  },
  addressPressed: {
    opacity: 0.86,
  },
  addressLabel: {
    color: Colors.black,
    fontWeight: "700",
  },
  addressText: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  paymentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey200,
    marginVertical: ThemeTokens.spacing.xs,
  },
});
