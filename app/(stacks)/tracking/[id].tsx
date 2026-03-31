import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import {
  AnimatedProgressBar,
  AnimatedReveal,
  AppCard,
  EmptyState,
  PrimaryButton,
  ScreenContainer,
  SectionHeader,
} from "@/components/ui";
import { orderStatusLabels } from "@/data/demoData";
import { formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/AppStore";
import { Colors, ThemeTokens } from "@/theme";

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const orderId = normalizeParam(params.id);
  const { state } = useAppStore();
  const order = orderId ? state.orders.find((entry) => entry.id === orderId) : undefined;

  if (!orderId || !order) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: "Tracking" }} />
        <EmptyState
          title="Tracking unavailable"
          description="The requested order could not be found."
          icon="navigate-outline"
          actionLabel="Back to Orders"
          onActionPress={() => router.replace("/orders")}
        />
      </ScreenContainer>
    );
  }

  const completedEvents = order.trackingEvents.filter((event) => event.done).length;
  const progress = Math.round((completedEvents / order.trackingEvents.length) * 100);

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: `Tracking ${order.id.slice(-5)}` }} />

      <AnimatedReveal>
        <AppCard>
          <SectionHeader title={orderStatusLabels[order.status]} subtitle={`Progress: ${progress}%`} />
          <AnimatedProgressBar progress={progress} />
        </AppCard>
      </AnimatedReveal>

      <AnimatedReveal delay={60}>
        <AppCard>
          <SectionHeader title="Timeline" />
          <View style={styles.timelineWrap}>
            {order.trackingEvents.map((event, index) => (
              <AnimatedReveal key={event.id} delay={90 + index * 50}>
                <View style={styles.timelineRow}>
                  <View style={[styles.dot, event.done ? styles.dotDone : styles.dotPending]} />
                  <View style={styles.timelineTextWrap}>
                    <Text style={[styles.timelineTitle, event.done ? styles.timelineTitleDone : undefined]}>
                      {event.title}
                    </Text>
                    <Text style={styles.timelineDescription}>{event.description}</Text>
                    <Text style={styles.timelineTime}>{formatDateTime(event.timestampIso)}</Text>
                  </View>
                </View>
              </AnimatedReveal>
            ))}
          </View>
        </AppCard>
      </AnimatedReveal>

      <PrimaryButton
        fullWidth
        label="Open Order Details"
        variant="secondary"
        onPress={() => router.push({ pathname: "/orders/[id]", params: { id: order.id } })}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  timelineWrap: {
    gap: ThemeTokens.spacing.md,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: ThemeTokens.spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
  },
  dotDone: {
    backgroundColor: Colors.primary,
  },
  dotPending: {
    backgroundColor: Colors.grey300,
  },
  timelineTextWrap: {
    flex: 1,
    gap: 1,
  },
  timelineTitle: {
    color: Colors.grey700,
    fontWeight: "700",
  },
  timelineTitleDone: {
    color: Colors.black,
  },
  timelineDescription: {
    color: Colors.grey700,
    fontSize: ThemeTokens.typography.small,
  },
  timelineTime: {
    color: Colors.grey600,
    fontSize: 12,
  },
});
