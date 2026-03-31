import type {
  Address,
  FoodCategory,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
  Restaurant,
  TrackingEvent,
  UserProfile,
} from "@/data/types";

export const restaurants: Restaurant[] = [
  {
    id: "rest-maple-grill",
    name: "Maple Street Grill",
    category: "Burgers",
    rating: 4.7,
    etaMinutes: 28,
    deliveryFee: 2.99,
    shortDescription: "Smash burgers and hand-cut fries.",
    address: "Fictional Ave 11, Demo City",
    tags: ["Fast delivery", "Top Rated"],
    heroTint: "#FFE4DD",
    featured: true,
  },
  {
    id: "rest-skyline-pizza",
    name: "Skyline Pizza Lab",
    category: "Pizza",
    rating: 4.6,
    etaMinutes: 32,
    deliveryFee: 3.49,
    shortDescription: "Stone-baked slices with bold sauces.",
    address: "Pilot Road 8, Demo City",
    tags: ["Family favorite", "Oven fresh"],
    heroTint: "#FFEED6",
    featured: true,
  },
  {
    id: "rest-green-bowl",
    name: "Green Bowl Studio",
    category: "Vegan",
    rating: 4.8,
    etaMinutes: 24,
    deliveryFee: 1.99,
    shortDescription: "Balanced bowls and plant-powered meals.",
    address: "Cedar Lane 4, Demo City",
    tags: ["Healthy", "Chef picks"],
    heroTint: "#E2F5E7",
    featured: true,
  },
  {
    id: "rest-sugar-cloud",
    name: "Sugar Cloud Desserts",
    category: "Desserts",
    rating: 4.5,
    etaMinutes: 22,
    deliveryFee: 2.49,
    shortDescription: "Cakes, shakes, and soft-serve treats.",
    address: "Studio Street 19, Demo City",
    tags: ["Late night", "Sweet spot"],
    heroTint: "#FCE7F5",
    featured: false,
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "item-maple-classic",
    restaurantId: "rest-maple-grill",
    name: "Classic Smash",
    description: "Double smash patty, cheddar, caramelized onions, house sauce.",
    price: 11.5,
    calories: 760,
    isPopular: true,
    dietaryTag: "Chef Pick",
  },
  {
    id: "item-maple-fire",
    restaurantId: "rest-maple-grill",
    name: "Firecracker Burger",
    description: "Beef patty, pepper jack, jalapeno jam, crispy onions.",
    price: 12.75,
    calories: 810,
    dietaryTag: "Spicy",
  },
  {
    id: "item-maple-fries",
    restaurantId: "rest-maple-grill",
    name: "Rosemary Fries",
    description: "Crisp fries with rosemary sea salt and garlic aioli.",
    price: 4.5,
    calories: 410,
  },
  {
    id: "item-skyline-margherita",
    restaurantId: "rest-skyline-pizza",
    name: "Margherita 12in",
    description: "Fresh mozzarella, basil oil, San Marzano tomato sauce.",
    price: 13.99,
    calories: 980,
    isPopular: true,
    dietaryTag: "Vegetarian",
  },
  {
    id: "item-skyline-pepperoni",
    restaurantId: "rest-skyline-pizza",
    name: "Pepperoni Heat 12in",
    description: "Beef pepperoni, roasted chili, red sauce, mozzarella.",
    price: 15.49,
    calories: 1120,
    dietaryTag: "Spicy",
  },
  {
    id: "item-skyline-garlic-knots",
    restaurantId: "rest-skyline-pizza",
    name: "Garlic Knots",
    description: "Six soft knots with parmesan and herb butter dip.",
    price: 5.25,
    calories: 520,
  },
  {
    id: "item-green-power",
    restaurantId: "rest-green-bowl",
    name: "Power Protein Bowl",
    description: "Quinoa, tofu, edamame, roasted veggies, tahini drizzle.",
    price: 12.25,
    calories: 640,
    isPopular: true,
    dietaryTag: "Vegan",
  },
  {
    id: "item-green-avocado",
    restaurantId: "rest-green-bowl",
    name: "Avocado Crunch Bowl",
    description: "Brown rice, avocado, chickpeas, cucumber, sesame dressing.",
    price: 11.75,
    calories: 590,
    dietaryTag: "Vegan",
  },
  {
    id: "item-green-coldbrew",
    restaurantId: "rest-green-bowl",
    name: "Oat Cold Brew",
    description: "Slow brew coffee, oat milk, cinnamon foam.",
    price: 4.25,
    calories: 150,
    dietaryTag: "Vegetarian",
  },
  {
    id: "item-sugar-truffle",
    restaurantId: "rest-sugar-cloud",
    name: "Chocolate Truffle Jar",
    description: "Layered dark chocolate mousse with biscuit crumble.",
    price: 6.5,
    calories: 470,
    isPopular: true,
  },
  {
    id: "item-sugar-strawberry",
    restaurantId: "rest-sugar-cloud",
    name: "Strawberry Milkshake",
    description: "Fresh berries, vanilla cream, whipped topping.",
    price: 5.75,
    calories: 520,
  },
  {
    id: "item-sugar-cookie",
    restaurantId: "rest-sugar-cloud",
    name: "Warm Cookie Duo",
    description: "Two oversized cookies with sea salt caramel dip.",
    price: 4.95,
    calories: 430,
  },
];

export const promoBanners = [
  {
    id: "promo-1",
    title: "Midweek Deal",
    description: "Save 20% on featured picks above $20.",
  },
  {
    id: "promo-2",
    title: "Dinner Rush Ready",
    description: "Fastest kitchen lanes highlighted in search.",
  },
];

export const categories: FoodCategory[] = Array.from(
  new Set(restaurants.map((restaurant) => restaurant.category))
);

export const demoProfile: UserProfile = {
  fullName: "Jordan Demo",
  email: "jordan.demo@samplemail.dev",
  phone: "+1 555 0102",
  memberSince: "2025-09-14",
};

export const demoAddresses: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    line1: "42 Demo Heights",
    city: "Demo City",
    instructions: "Ring once and leave at door.",
    isDefault: true,
  },
  {
    id: "addr-office",
    label: "Office",
    line1: "19 Sample Plaza",
    city: "Demo City",
    instructions: "Lobby desk, floor 3.",
    isDefault: false,
  },
];

const deliveredOrderTracking: TrackingEvent[] = [
  {
    id: "trk-100-placed",
    title: "Order placed",
    description: "Your order was confirmed by Skyline Pizza Lab.",
    timestampIso: "2026-03-29T12:05:00.000Z",
    done: true,
  },
  {
    id: "trk-100-preparing",
    title: "Preparing",
    description: "Kitchen started preparing your food.",
    timestampIso: "2026-03-29T12:12:00.000Z",
    done: true,
  },
  {
    id: "trk-100-route",
    title: "On the way",
    description: "Courier picked up and is heading to you.",
    timestampIso: "2026-03-29T12:28:00.000Z",
    done: true,
  },
  {
    id: "trk-100-delivered",
    title: "Delivered",
    description: "Delivered to your address.",
    timestampIso: "2026-03-29T12:45:00.000Z",
    done: true,
  },
];

const activeOrderTracking: TrackingEvent[] = [
  {
    id: "trk-101-placed",
    title: "Order placed",
    description: "Your order was confirmed by Green Bowl Studio.",
    timestampIso: "2026-03-31T08:55:00.000Z",
    done: true,
  },
  {
    id: "trk-101-preparing",
    title: "Preparing",
    description: "Kitchen is preparing your meal.",
    timestampIso: "2026-03-31T09:02:00.000Z",
    done: true,
  },
  {
    id: "trk-101-route",
    title: "On the way",
    description: "Courier is heading to your location.",
    timestampIso: "2026-03-31T09:18:00.000Z",
    done: false,
  },
  {
    id: "trk-101-delivered",
    title: "Delivered",
    description: "Expected final handoff at your address.",
    timestampIso: "2026-03-31T09:33:00.000Z",
    done: false,
  },
];

export const demoOrders: Order[] = [
  {
    id: "ord-10001",
    restaurantId: "rest-green-bowl",
    createdAtIso: "2026-03-31T08:55:00.000Z",
    status: "on_the_way",
    estimatedDeliveryMinutes: 38,
    addressId: "addr-home",
    paymentMethod: "card",
    items: [
      {
        itemId: "item-green-power",
        restaurantId: "rest-green-bowl",
        quantity: 1,
        priceAtPurchase: 12.25,
      },
      {
        itemId: "item-green-coldbrew",
        restaurantId: "rest-green-bowl",
        quantity: 1,
        priceAtPurchase: 4.25,
      },
    ],
    subtotal: 16.5,
    deliveryFee: 1.99,
    serviceFee: 1.99,
    total: 20.48,
    trackingEvents: activeOrderTracking,
  },
  {
    id: "ord-10000",
    restaurantId: "rest-skyline-pizza",
    createdAtIso: "2026-03-29T12:05:00.000Z",
    status: "delivered",
    estimatedDeliveryMinutes: 40,
    addressId: "addr-office",
    paymentMethod: "cash",
    items: [
      {
        itemId: "item-skyline-margherita",
        restaurantId: "rest-skyline-pizza",
        quantity: 1,
        priceAtPurchase: 13.99,
      },
      {
        itemId: "item-skyline-garlic-knots",
        restaurantId: "rest-skyline-pizza",
        quantity: 1,
        priceAtPurchase: 5.25,
      },
    ],
    subtotal: 19.24,
    deliveryFee: 3.49,
    serviceFee: 1.99,
    total: 24.72,
    trackingEvents: deliveredOrderTracking,
  },
];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: "Card",
  cash: "Cash",
  wallet: "Wallet",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  placed: "Placed",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

export const getRestaurantById = (id: string) => restaurants.find((restaurant) => restaurant.id === id);

export const getMenuItemById = (id: string) => menuItems.find((menuItem) => menuItem.id === id);

export const getMenuForRestaurant = (restaurantId: string) =>
  menuItems.filter((menuItem) => menuItem.restaurantId === restaurantId);
