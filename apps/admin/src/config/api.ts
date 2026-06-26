import Constants from "expo-constants";
import { Platform } from "react-native";

// Always use HTTPS for production to avoid cleartext issues
export const PROD_API_URL = "https://my-portfolio-server-alpha-one.vercel.app";

// Used for fallbacks in development environment
const FALLBACK_DEV_URL = "http://localhost:5000";
const ANDROID_EMULATOR_URL = "http://10.0.2.2:5000";

export const getApiUrl = (): string => {
    // If running via Expo Go in development mode
  if (__DEV__) {
    // 1. Dynamically resolve local LAN IP from Expo manifest for physical device testing
    const hostUri = Constants.expoConfig?.hostUri;
    let lanIp = "";
    if (hostUri) {
      lanIp = hostUri.split(":")[0];
    }

    // 2. Determine the best dev url
    let activeDevUrl = FALLBACK_DEV_URL;
    
    if (process.env.EXPO_PUBLIC_API_LOCAL) {
      activeDevUrl = process.env.EXPO_PUBLIC_API_LOCAL;
    }

    // 3. Smart replacement for 'localhost' -> LAN IP
    // Always prefer LAN IP over '10.0.2.2' if available, as it works universally for physical devices & emulators
    if (activeDevUrl.includes("localhost")) {
      if (lanIp) {
         return activeDevUrl.replace("localhost", lanIp);
      } else if (Platform.OS === "android") {
         return activeDevUrl.replace("localhost", "10.0.2.2");
      }
    }
    
    return activeDevUrl;
  }

  // Standalone APK or Production build STRICTLY uses the live API URL
  return process.env.EXPO_PUBLIC_API_LIVE || PROD_API_URL;
};

// Singleton resolved instance to avoid recalculating unnecessarily
export const API_BASE_URL = getApiUrl();
