import { DefaultTheme, type Theme } from "@react-navigation/native";

export const Colors = {
  primary: "#D32F2F", // red 700
  primaryDark: "#B71C1C",
  primaryLight: "#EF5350",
  primarySoft: "#FDECEC",

  white: "#FFFFFF",
  black: "#111111",

  grey50: "#FAFAFA",
  grey100: "#F5F5F5",
  grey200: "#EEEEEE",
  grey300: "#E0E0E0",
  grey400: "#BDBDBD",
  grey500: "#9E9E9E",
  grey600: "#757575",
  grey700: "#616161",
  grey900: "#212121",

  success: "#2E7D32",
  warning: "#ED6C02",
  error: "#D32F2F",
};

export const ThemeTokens = {
  colors: {
    background: Colors.white,
    surface: Colors.grey50,
    card: Colors.white,
    cardElevated: Colors.white,
    text: Colors.black,
    mutedText: Colors.grey700,
    border: Colors.grey300,
    borderStrong: Colors.grey400,
    primary: Colors.primary,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 999,
  },
  typography: {
    display: 30,
    title: 24,
    subtitle: 18,
    body: 16,
    small: 14,
    caption: 12,
  },
} as const;

// React Navigation theme object
export const navTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: ThemeTokens.colors.primary,
    background: ThemeTokens.colors.background,
    card: ThemeTokens.colors.card,
    text: ThemeTokens.colors.text,
    border: ThemeTokens.colors.border,
    notification: ThemeTokens.colors.primary,
  },
};
