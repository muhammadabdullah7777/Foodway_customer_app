import { Colors } from "@/theme";
import { useAppStore } from "@/store/AppStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function TabsLayout() {
  const { selectors } = useAppStore();

  return (
    <>
      <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: false,
          headerTitleStyle: { color: Colors.black, fontWeight: "700" },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.grey600,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopColor: Colors.grey300,
            height: 68,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarBadgeStyle: { backgroundColor: Colors.primary, color: Colors.white },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "search" : "search-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarBadge: selectors.cartCount > 0 ? selectors.cartCount : undefined,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "cart" : "cart-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "receipt" : "receipt-outline"} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
