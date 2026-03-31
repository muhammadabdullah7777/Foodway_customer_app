import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { AnimatedReveal, AppCard, PrimaryButton, ScreenContainer, SectionHeader } from "@/components/ui";
import { runSoftSuccessHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

export default function AddressScreen() {
  const router = useRouter();
  const { actions, state } = useAppStore();
  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [instructions, setInstructions] = useState("");

  const onAddAddress = async () => {
    if (!label.trim() || !line1.trim() || !city.trim()) {
      Alert.alert("Missing details", "Please provide label, street line, and city.");
      return;
    }

    actions.saveAddress({
      label: label.trim(),
      line1: line1.trim(),
      city: city.trim(),
      instructions: instructions.trim(),
    });

    await runSoftSuccessHaptic();
    setLabel("");
    setLine1("");
    setCity("");
    setInstructions("");
  };

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: "Addresses" }} />

      <SectionHeader title="Saved Addresses" subtitle={`${state.addresses.length} total`} />
      <View style={styles.listWrap}>
        {state.addresses.map((address, index) => (
          <AnimatedReveal key={address.id} delay={50 + index * 35}>
            <AppCard>
              <Text style={styles.addressLabel}>
                {address.label} {address.isDefault ? "(Default)" : ""}
              </Text>
              <Text style={styles.addressText}>{address.line1}</Text>
              <Text style={styles.addressText}>{address.city}</Text>
              {address.instructions ? <Text style={styles.addressText}>{address.instructions}</Text> : null}
              <View style={styles.addressActions}>
                {!address.isDefault ? (
                  <PrimaryButton
                    label="Set Default"
                    variant="secondary"
                    size="sm"
                    style={styles.actionButton}
                    onPress={() => actions.setDefaultAddress(address.id)}
                  />
                ) : null}
                <PrimaryButton
                  label="Delete"
                  variant="ghost"
                  size="sm"
                  style={styles.actionButton}
                  onPress={() => {
                    const removed = actions.removeAddress(address.id);
                    if (!removed) {
                      Alert.alert("Cannot delete", "At least one address must remain in this demo.");
                    }
                  }}
                />
              </View>
            </AppCard>
          </AnimatedReveal>
        ))}
      </View>

      <AnimatedReveal delay={90}>
        <AppCard>
          <SectionHeader title="Add New Address" />

          <Text style={styles.fieldLabel}>Label</Text>
          <TextInput
            accessibilityLabel="Address label"
            onChangeText={setLabel}
            placeholder="Home, Office, Studio"
            placeholderTextColor={Colors.grey600}
            style={styles.input}
            value={label}
          />

          <Text style={styles.fieldLabel}>Street Address</Text>
          <TextInput
            accessibilityLabel="Street address"
            onChangeText={setLine1}
            placeholder="123 Demo Street"
            placeholderTextColor={Colors.grey600}
            style={styles.input}
            value={line1}
          />

          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            accessibilityLabel="City"
            onChangeText={setCity}
            placeholder="Demo City"
            placeholderTextColor={Colors.grey600}
            style={styles.input}
            value={city}
          />

          <Text style={styles.fieldLabel}>Instructions (optional)</Text>
          <TextInput
            accessibilityLabel="Delivery instructions"
            onChangeText={setInstructions}
            placeholder="Leave at lobby desk"
            placeholderTextColor={Colors.grey600}
            style={styles.input}
            value={instructions}
          />

          <PrimaryButton fullWidth label="Save Address" onPress={() => void onAddAddress()} />
        </AppCard>
      </AnimatedReveal>

      <PrimaryButton fullWidth label="Back to Profile" variant="secondary" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listWrap: {
    gap: ThemeTokens.spacing.md,
  },
  addressLabel: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: ThemeTokens.typography.subtitle,
  },
  addressText: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  addressActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
    marginTop: ThemeTokens.spacing.xs,
  },
  actionButton: {
    minWidth: 120,
    flexGrow: 1,
  },
  fieldLabel: {
    color: Colors.grey700,
    fontWeight: "600",
    fontSize: ThemeTokens.typography.small,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey300,
    borderRadius: ThemeTokens.radius.lg,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 48,
    color: Colors.black,
    marginBottom: ThemeTokens.spacing.sm,
  },
});
