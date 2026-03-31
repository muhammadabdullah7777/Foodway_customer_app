import type { ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeTokens } from "@/theme";

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
  scrollProps?: Omit<ScrollViewProps, "contentContainerStyle" | "children">;
};

export function ScreenContainer({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  footer,
  scrollProps,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView edges={["left", "right", "bottom"]} style={[styles.safeArea, style]}>
        <View style={styles.scrollLayout}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            {...scrollProps}
          >
            {children}
          </ScrollView>
          {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={[styles.safeArea, style]}>
      <View style={styles.scrollLayout}>
        <View style={[styles.plainContent, contentContainerStyle]}>{children}</View>
        {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ThemeTokens.colors.background,
  },
  scrollLayout: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ThemeTokens.spacing.lg,
    paddingTop: ThemeTokens.spacing.lg,
    paddingBottom: ThemeTokens.spacing.xl,
    gap: ThemeTokens.spacing.lg,
  },
  plainContent: {
    flex: 1,
    paddingHorizontal: ThemeTokens.spacing.lg,
    paddingTop: ThemeTokens.spacing.lg,
    paddingBottom: ThemeTokens.spacing.xl,
    gap: ThemeTokens.spacing.lg,
  },
  footerWrap: {
    paddingHorizontal: ThemeTokens.spacing.lg,
    paddingTop: ThemeTokens.spacing.sm,
    paddingBottom: ThemeTokens.spacing.sm,
    backgroundColor: ThemeTokens.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: ThemeTokens.colors.border,
  },
});
