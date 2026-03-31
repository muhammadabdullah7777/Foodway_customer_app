import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { Colors, ThemeTokens } from "@/theme";

type AnimatedProgressBarProps = {
  progress: number;
};

export function AnimatedProgressBar({ progress }: AnimatedProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, progress));
  const widthPercent = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthPercent, {
      toValue: Math.max(normalized, 8),
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [normalized, widthPercent]);

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthPercent.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
      }) }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: ThemeTokens.radius.pill,
    backgroundColor: Colors.grey200,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});
