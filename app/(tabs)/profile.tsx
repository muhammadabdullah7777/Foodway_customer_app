import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import { AnimatedReveal, AppCard, AppChip, PrimaryButton, ScreenContainer, SectionHeader } from "@/components/ui";
import { runSoftSuccessHaptic } from "@/lib/haptics";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const { actions, state } = useAppStore();
  const [fullName, setFullName] = useState(state.profile.fullName);
  const [email, setEmail] = useState(state.profile.email);
  const [phone, setPhone] = useState(state.profile.phone);

  useEffect(() => {
    setFullName(state.profile.fullName);
    setEmail(state.profile.email);
    setPhone(state.profile.phone);
  }, [state.profile]);

  const onSave = async () => {
    actions.updateProfile({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
    await runSoftSuccessHaptic();
    Alert.alert("Saved", "Profile details were updated locally.");
  };

  return (
    <ScreenContainer>
      <SectionHeader title="Profile" subtitle={`Member since ${state.profile.memberSince}`} />

      <AnimatedReveal>
        <AppCard>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            accessibilityLabel="Full name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor={Colors.grey600}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor={Colors.grey600}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            accessibilityLabel="Phone number"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 000 0000"
            placeholderTextColor={Colors.grey600}
          />

          <PrimaryButton fullWidth label="Save Profile" onPress={() => void onSave()} />
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={50}>
        <AppCard>
          <SectionHeader title="Quick Stats" />
          <View style={styles.statsRow}>
            <AppChip label={`${state.orders.length} orders`} />
            <AppChip label={`${state.addresses.length} addresses`} />
            <AppChip label={`${state.recentSearches.length} searches`} />
          </View>
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={90}>
        <View style={styles.actionsWrap}>
          <PrimaryButton
            label="Manage Addresses"
            variant="secondary"
            style={styles.actionButton}
            onPress={() => router.push("/address")}
          />
          <PrimaryButton
            label="Clear Recent Searches"
            variant="ghost"
            style={styles.actionButton}
            onPress={actions.clearRecentSearches}
          />
        </View>
      </AnimatedReveal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: Colors.white,
    borderRadius: ThemeTokens.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minHeight: 50,
    color: Colors.black,
    marginBottom: ThemeTokens.spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  actionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ThemeTokens.spacing.sm,
  },
  actionButton: {
    minWidth: 150,
    flexGrow: 1,
  },
});
