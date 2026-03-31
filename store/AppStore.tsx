import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

import { demoAddresses, demoOrders, demoProfile, getMenuItemById, getRestaurantById } from "@/data/demoData";
import type { Address, AppState, CartItem, CartSummary, Order, PaymentMethod, UserProfile } from "@/data/types";

const STORAGE_KEY = "customer_app_state_v1";
const SERVICE_FEE = 1.99;

const initialState: AppState = {
  cart: [],
  orders: demoOrders,
  addresses: demoAddresses,
  profile: demoProfile,
  recentSearches: ["burger", "vegan bowl", "pizza"],
};

type PersistedState = Pick<AppState, "cart" | "orders" | "addresses" | "profile" | "recentSearches">;

type AppAction =
  | { type: "HYDRATE"; payload: Partial<PersistedState> }
  | { type: "ADD_TO_CART"; payload: { itemId: string; restaurantId: string; quantity: number; notes?: string } }
  | { type: "REMOVE_FROM_CART"; payload: { itemId: string } }
  | { type: "UPDATE_CART_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "PLACE_ORDER"; payload: { order: Order } }
  | { type: "SAVE_ADDRESS"; payload: { address: Address } }
  | { type: "REMOVE_ADDRESS"; payload: { id: string } }
  | { type: "SET_DEFAULT_ADDRESS"; payload: { id: string } }
  | { type: "UPDATE_PROFILE"; payload: { profile: Partial<UserProfile> } }
  | { type: "ADD_RECENT_SEARCH"; payload: { query: string } }
  | { type: "CLEAR_RECENT_SEARCHES" };

type PlaceOrderInput = {
  addressId: string;
  paymentMethod: PaymentMethod;
};

type AppActions = {
  addToCart: (itemId: string, quantity?: number, notes?: string) => { replacedExisting: boolean };
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (input: PlaceOrderInput) => string | null;
  saveAddress: (address: Omit<Address, "id" | "isDefault"> & { id?: string; isDefault?: boolean }) => string;
  removeAddress: (id: string) => boolean;
  setDefaultAddress: (id: string) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

type AppSelectors = {
  cartCount: number;
  cartSummary: CartSummary;
  defaultAddress: Address | null;
  activeCartRestaurantId: string | null;
};

type AppStoreValue = {
  state: AppState;
  actions: AppActions;
  selectors: AppSelectors;
  hydrated: boolean;
};

const AppStoreContext = createContext<AppStoreValue | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "HYDRATE": {
      return {
        ...state,
        ...action.payload,
        cart: action.payload.cart ?? state.cart,
        orders: action.payload.orders ?? state.orders,
        addresses: action.payload.addresses ?? state.addresses,
        profile: action.payload.profile ?? state.profile,
        recentSearches: action.payload.recentSearches ?? state.recentSearches,
      };
    }
    case "ADD_TO_CART": {
      const incoming = action.payload;
      const hasOtherRestaurant = state.cart.some((line) => line.restaurantId !== incoming.restaurantId);
      const baseCart = hasOtherRestaurant ? [] : state.cart;
      const existingLine = baseCart.find((line) => line.itemId === incoming.itemId);

      if (existingLine) {
        const merged = baseCart.map((line) =>
          line.itemId === incoming.itemId
            ? {
                ...line,
                quantity: line.quantity + Math.max(1, incoming.quantity),
                notes: incoming.notes?.trim() || line.notes,
              }
            : line
        );
        return { ...state, cart: merged };
      }

      const nextLine: CartItem = {
        itemId: incoming.itemId,
        restaurantId: incoming.restaurantId,
        quantity: Math.max(1, incoming.quantity),
        notes: incoming.notes?.trim() || undefined,
      };

      return {
        ...state,
        cart: [...baseCart, nextLine],
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((line) => line.itemId !== action.payload.itemId) };
    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((line) =>
            line.itemId === action.payload.itemId ? { ...line, quantity: action.payload.quantity } : line
          )
          .filter((line) => line.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "PLACE_ORDER":
      return { ...state, orders: [action.payload.order, ...state.orders], cart: [] };
    case "SAVE_ADDRESS": {
      const existing = state.addresses.find((address) => address.id === action.payload.address.id);
      const nextAddresses = existing
        ? state.addresses.map((address) =>
            address.id === action.payload.address.id ? action.payload.address : address
          )
        : [action.payload.address, ...state.addresses];
      return { ...state, addresses: nextAddresses };
    }
    case "REMOVE_ADDRESS": {
      const remaining = state.addresses.filter((address) => address.id !== action.payload.id);
      if (remaining.length === 0) {
        return state;
      }
      if (!remaining.some((address) => address.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return { ...state, addresses: remaining };
    }
    case "SET_DEFAULT_ADDRESS":
      return {
        ...state,
        addresses: state.addresses.map((address) => ({
          ...address,
          isDefault: address.id === action.payload.id,
        })),
      };
    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload.profile } };
    case "ADD_RECENT_SEARCH": {
      const query = action.payload.query.trim().toLowerCase();
      if (!query) {
        return state;
      }
      const deduped = [query, ...state.recentSearches.filter((item) => item !== query)].slice(0, 6);
      return { ...state, recentSearches: deduped };
    }
    case "CLEAR_RECENT_SEARCHES":
      return { ...state, recentSearches: [] };
    default:
      return state;
  }
}

function computeCartSummary(cart: CartItem[]): CartSummary {
  const subtotal = cart.reduce((total, cartLine) => {
    const menuItem = getMenuItemById(cartLine.itemId);
    return menuItem ? total + menuItem.price * cartLine.quantity : total;
  }, 0);

  const restaurantIds = Array.from(new Set(cart.map((cartLine) => cartLine.restaurantId)));
  const deliveryFee = restaurantIds.reduce((total, restaurantId) => {
    const restaurant = getRestaurantById(restaurantId);
    return total + (restaurant?.deliveryFee ?? 0);
  }, 0);

  const serviceFee = cart.length > 0 ? SERVICE_FEE : 0;
  const total = subtotal + deliveryFee + serviceFee;

  return {
    subtotal,
    deliveryFee,
    serviceFee,
    total,
  };
}

function toSafeArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function toSafeProfile(value: unknown): UserProfile | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const profile = value as Partial<UserProfile>;
  if (!profile.fullName || !profile.email || !profile.phone || !profile.memberSince) {
    return undefined;
  }
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    memberSince: profile.memberSince,
  };
}

function buildTrackingEvents(createdAtIso: string) {
  const createdAt = new Date(createdAtIso).getTime();
  const addMinutes = (minutes: number) => new Date(createdAt + minutes * 60_000).toISOString();

  return [
    {
      id: `${createdAtIso}-placed`,
      title: "Order placed",
      description: "We have received your order.",
      timestampIso: addMinutes(0),
      done: true,
    },
    {
      id: `${createdAtIso}-preparing`,
      title: "Preparing",
      description: "The kitchen has started cooking.",
      timestampIso: addMinutes(8),
      done: false,
    },
    {
      id: `${createdAtIso}-route`,
      title: "On the way",
      description: "Courier will pick up your order soon.",
      timestampIso: addMinutes(22),
      done: false,
    },
    {
      id: `${createdAtIso}-delivered`,
      title: "Delivered",
      description: "Final handoff at your selected address.",
      timestampIso: addMinutes(38),
      done: false,
    },
  ];
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function hydrateState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (!mounted) {
          return;
        }

        dispatch({
          type: "HYDRATE",
          payload: {
            cart: toSafeArray<CartItem>(parsed.cart),
            orders: toSafeArray<Order>(parsed.orders),
            addresses: toSafeArray<Address>(parsed.addresses),
            recentSearches: toSafeArray<string>(parsed.recentSearches),
            profile: toSafeProfile(parsed.profile),
          },
        });
      } catch {
        // Keep defaults if persisted state is unavailable.
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    }

    hydrateState();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const payload: PersistedState = {
      cart: state.cart,
      orders: state.orders,
      addresses: state.addresses,
      profile: state.profile,
      recentSearches: state.recentSearches,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {
      // Ignore persistence errors in demo mode.
    });
  }, [hydrated, state]);

  const actions: AppActions = useMemo(
    () => ({
      addToCart(itemId, quantity = 1, notes) {
        const menuItem = getMenuItemById(itemId);
        if (!menuItem) {
          return { replacedExisting: false };
        }

        const replacedExisting =
          state.cart.length > 0 && state.cart.some((line) => line.restaurantId !== menuItem.restaurantId);

        dispatch({
          type: "ADD_TO_CART",
          payload: {
            itemId,
            restaurantId: menuItem.restaurantId,
            quantity,
            notes,
          },
        });

        return { replacedExisting };
      },
      removeFromCart(itemId) {
        dispatch({ type: "REMOVE_FROM_CART", payload: { itemId } });
      },
      updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
          dispatch({ type: "REMOVE_FROM_CART", payload: { itemId } });
          return;
        }
        dispatch({ type: "UPDATE_CART_QUANTITY", payload: { itemId, quantity } });
      },
      clearCart() {
        dispatch({ type: "CLEAR_CART" });
      },
      placeOrder({ addressId, paymentMethod }) {
        if (state.cart.length === 0) {
          return null;
        }
        const address =
          state.addresses.find((entry) => entry.id === addressId) ??
          state.addresses.find((entry) => entry.isDefault) ??
          state.addresses[0];
        if (!address) {
          return null;
        }

        const createdAtIso = new Date().toISOString();
        const orderId = `ord-${Date.now()}`;
        const summary = computeCartSummary(state.cart);
        const restaurantId = state.cart[0]?.restaurantId ?? "unknown";
        const estimatedDeliveryMinutes = 35;

        const order: Order = {
          id: orderId,
          restaurantId,
          createdAtIso,
          status: "placed",
          estimatedDeliveryMinutes,
          addressId: address.id,
          paymentMethod,
          items: state.cart.map((line) => {
            const menuItem = getMenuItemById(line.itemId);
            return {
              itemId: line.itemId,
              restaurantId: line.restaurantId,
              quantity: line.quantity,
              notes: line.notes,
              priceAtPurchase: menuItem?.price ?? 0,
            };
          }),
          subtotal: summary.subtotal,
          deliveryFee: summary.deliveryFee,
          serviceFee: summary.serviceFee,
          total: summary.total,
          trackingEvents: buildTrackingEvents(createdAtIso),
        };

        dispatch({ type: "PLACE_ORDER", payload: { order } });
        return orderId;
      },
      saveAddress(input) {
        const addressId = input.id ?? `addr-${Date.now()}`;
        const shouldBeDefault = Boolean(input.isDefault) || state.addresses.length === 0;
        const address: Address = {
          id: addressId,
          label: input.label,
          line1: input.line1,
          city: input.city,
          instructions: input.instructions,
          isDefault: shouldBeDefault,
        };

        dispatch({ type: "SAVE_ADDRESS", payload: { address } });
        if (shouldBeDefault) {
          dispatch({ type: "SET_DEFAULT_ADDRESS", payload: { id: addressId } });
        }
        return addressId;
      },
      removeAddress(id) {
        if (state.addresses.length <= 1) {
          return false;
        }
        dispatch({ type: "REMOVE_ADDRESS", payload: { id } });
        return true;
      },
      setDefaultAddress(id) {
        dispatch({ type: "SET_DEFAULT_ADDRESS", payload: { id } });
      },
      updateProfile(patch) {
        dispatch({ type: "UPDATE_PROFILE", payload: { profile: patch } });
      },
      addRecentSearch(query) {
        dispatch({ type: "ADD_RECENT_SEARCH", payload: { query } });
      },
      clearRecentSearches() {
        dispatch({ type: "CLEAR_RECENT_SEARCHES" });
      },
    }),
    [state]
  );

  const selectors: AppSelectors = useMemo(() => {
    const cartCount = state.cart.reduce((count, line) => count + line.quantity, 0);
    const cartSummary = computeCartSummary(state.cart);
    const defaultAddress = state.addresses.find((entry) => entry.isDefault) ?? state.addresses[0] ?? null;
    const activeCartRestaurantId = state.cart[0]?.restaurantId ?? null;

    return {
      cartCount,
      cartSummary,
      defaultAddress,
      activeCartRestaurantId,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      actions,
      selectors,
      hydrated,
    }),
    [actions, hydrated, selectors, state]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return context;
}
