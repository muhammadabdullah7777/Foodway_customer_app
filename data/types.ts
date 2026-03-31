export type FoodCategory = "Burgers" | "Pizza" | "Bowls" | "Desserts" | "Coffee" | "Vegan";

export type PaymentMethod = "card" | "cash" | "wallet";

export type OrderStatus = "placed" | "preparing" | "on_the_way" | "delivered";

export interface Restaurant {
  id: string;
  name: string;
  category: FoodCategory;
  rating: number;
  etaMinutes: number;
  deliveryFee: number;
  shortDescription: string;
  address: string;
  tags: string[];
  heroTint: string;
  featured: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  isPopular?: boolean;
  dietaryTag?: "Spicy" | "Vegetarian" | "Vegan" | "Chef Pick";
}

export interface CartItem {
  itemId: string;
  restaurantId: string;
  quantity: number;
  notes?: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  instructions?: string;
  isDefault: boolean;
}

export interface TrackingEvent {
  id: string;
  title: string;
  description: string;
  timestampIso: string;
  done: boolean;
}

export interface OrderLineItem {
  itemId: string;
  restaurantId: string;
  quantity: number;
  priceAtPurchase: number;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  createdAtIso: string;
  status: OrderStatus;
  estimatedDeliveryMinutes: number;
  addressId: string;
  paymentMethod: PaymentMethod;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  trackingEvents: TrackingEvent[];
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  memberSince: string;
}

export interface AppState {
  cart: CartItem[];
  orders: Order[];
  addresses: Address[];
  profile: UserProfile;
  recentSearches: string[];
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}
