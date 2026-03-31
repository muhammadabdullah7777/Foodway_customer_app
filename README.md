# Customer App Demo (Expo + React Native)

Public-safe food delivery demo app with:

- Typed local demo data (restaurants, menu items, cart, orders, profile, addresses)
- Persisted local state via AsyncStorage
- Guest-mode UX flow (no backend auth required)
- Tabs + stack navigation for browse, search, cart, checkout, orders, tracking, and profile

## Run Locally

```bash
npm install
npx expo start
```

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npx expo-doctor
npx expo export --platform web
```

## Demo Data and Security Notes

- This project uses **demo-only fictional data** stored in local TypeScript modules.
- No API keys, secrets, private tokens, or credentials are included.
- No remote backend calls are used for the primary app flow.
- App state is persisted locally on-device with AsyncStorage for demo continuity.
- Profile, address, and order values are non-sensitive placeholders for UI demonstration.
