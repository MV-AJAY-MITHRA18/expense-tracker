import { Slot, useRouter, useSegments } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { View, ActivityIndicator, Text, StyleSheet, Platform } from "react-native";
import { COLORS } from "@/constants/colors";

// Create a web-compatible token cache
const createTokenCache = () => {
  // For web, use localStorage
  if (Platform.OS === "web") {
    return {
      async getToken(key) {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      async saveToken(key, value) {
        try {
          localStorage.setItem(key, value);
        } catch {
          return;
        }
      },
    };
  }

  // For native, use SecureStore
  const SecureStore = require("expo-secure-store");
  return {
    async getToken(key) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return null;
      }
    },
    async saveToken(key, value) {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch {
        return;
      }
    },
  };
};

const tokenCache = createTokenCache();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      router.replace("/");
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B593E" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Missing Clerk Publishable Key</Text>
        <Text style={styles.errorSubtext}>Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file</Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <InitialLayout />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.expense,
  },
  errorSubtext: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
});
