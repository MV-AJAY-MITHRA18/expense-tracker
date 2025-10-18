import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import SafeScreen from "@/components/SafeScreen";

// Persist Clerk session tokens
const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

export default function RootLayout() {
  console.log("CLERK KEY:", process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
