import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Switch,
  Animated,
} from "react-native";

interface LoginScreenProps {
  apiUrl: string;
  isCustomUrl: boolean;
  customUrl: string;
  onUpdateApiConfig: (useCustom: boolean, url: string) => Promise<void>;
  onLogin: (email: string, pass: string) => Promise<void>;
  isLoading: boolean;
}

export default function LoginScreen({
  apiUrl,
  isCustomUrl,
  customUrl,
  onUpdateApiConfig,
  onLogin,
  isLoading,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Local developer settings states
  const [tapCount, setTapCount] = useState(0);
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [localCustomUrl, setLocalCustomUrl] = useState(customUrl || apiUrl);
  const [localUseCustom, setLocalUseCustom] = useState(isCustomUrl);
  const [testingConnection, setTestingConnection] = useState(false);

  // Focus states for glowing input fields
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [devInputFocused, setDevInputFocused] = useState(false);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const devHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Sync local custom states when props change
    setLocalCustomUrl(customUrl);
    setLocalUseCustom(isCustomUrl);
  }, [customUrl, isCustomUrl]);

  // Handle double-tap/five-tap gesture to unlock developer settings
  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      const targetState = !showDevSettings;
      setShowDevSettings(targetState);
      setTapCount(0);
      Alert.alert(
        targetState ? "Developer Mode Unlocked" : "Developer Mode Locked",
        targetState 
          ? "You can now customize the API base URL override and test connection status."
          : "Custom API URL override settings have been hidden."
      );
      
      // Animate developer panel expansion
      Animated.timing(devHeightAnim, {
        toValue: targetState ? 1 : 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleTestConnection = async () => {
    const testUrl = localUseCustom ? localCustomUrl : apiUrl;
    if (!testUrl) {
      Alert.alert("Error", "Server URL cannot be empty.");
      return;
    }
    
    setTestingConnection(true);
    try {
      const cleanUrl = testUrl.trim().replace(/\/$/, "");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch(`${cleanUrl}/api/auth/admin-signin`, {
        method: "GET", // Root request or invalid method to auth signin route
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      // If we receive any HTTP response (even 404 or 405), the API is running and reachable
      Alert.alert(
        "Connection Success",
        `Successfully reached server at:\n${cleanUrl}\n\nServer Status: Active`
      );
    } catch (e: any) {
      Alert.alert(
        "Connection Error",
        `Could not reach:\n${testUrl}\n\nEnsure the backend server is running and accessible on your network.\n\nError: ${e.message || "Network Timeout"}`
      );
    } finally {
      setTestingConnection(false);
    }
  };

  const handleApplyConfig = async () => {
    if (localUseCustom && !localCustomUrl.trim()) {
      Alert.alert("Validation Error", "Please provide a valid Custom URL.");
      return;
    }
    await onUpdateApiConfig(localUseCustom, localCustomUrl.trim());
    Alert.alert("Settings Applied", `API Server Base URL has been set to:\n${localUseCustom ? localCustomUrl : "Auto-Resolved Endpoint"}`);
  };

  const handleResetConfig = async () => {
    setLocalUseCustom(false);
    setLocalCustomUrl(apiUrl);
    await onUpdateApiConfig(false, "");
    Alert.alert("Reset Complete", "Reverted to automatic dynamic URL resolution.");
  };

  const handleSubmit = () => {
    onLogin(email, password);
  };

  const isLive = apiUrl.includes("vercel.app");
  const connectionModeText = isLive 
    ? "Production Mode (Vercel Cloud)" 
    : `Local Server (${apiUrl.replace("http://", "").replace("https://", "")})`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Logo Emblem Header */}
          <TouchableOpacity onPress={handleLogoTap} activeOpacity={0.9} style={styles.logoWrapper}>
            <View style={styles.logoRing}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoIcon}>🔐</Text>
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>MyAppPortfolio Mobile Admin</Text>
          </TouchableOpacity>

          {/* Connection Status Badge */}
          <View style={styles.connectionBadge}>
            <View style={[styles.statusDot, isLive ? styles.statusDotLive : styles.statusDotDev]} />
            <Text style={styles.connectionText} numberOfLines={1}>
              {connectionModeText}
            </Text>
          </View>

          {/* Developer settings collapsible menu */}
          {showDevSettings && (
            <Animated.View style={[
              styles.devSettingsCard,
              {
                opacity: devHeightAnim,
                transform: [
                  {
                    scale: devHeightAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }
            ]}>
              <View style={styles.devHeader}>
                <Text style={styles.devHeaderTitle}>🛠️ Developer Settings</Text>
              </View>

              <View style={styles.devRow}>
                <Text style={styles.devRowLabel}>Use Custom Server IP</Text>
                <Switch
                  value={localUseCustom}
                  onValueChange={(val) => setLocalUseCustom(val)}
                  trackColor={{ false: "#334155", true: "#3b82f6" }}
                  thumbColor={localUseCustom ? "#ffffff" : "#94a3b8"}
                />
              </View>

              {localUseCustom && (
                <View style={styles.inputGroup}>
                  <Text style={styles.devLabel}>Custom Server API Base URL</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.devInput,
                      devInputFocused && styles.inputFocused
                    ]}
                    value={localCustomUrl}
                    onChangeText={setLocalCustomUrl}
                    placeholder="e.g. http://192.168.1.50:5000"
                    placeholderTextColor="#64748b"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setDevInputFocused(true)}
                    onBlur={() => setDevInputFocused(false)}
                  />
                </View>
              )}

              <View style={styles.devActions}>
                <TouchableOpacity 
                  onPress={handleTestConnection} 
                  style={[styles.devBtn, styles.devBtnTest]} 
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : (
                    <Text style={styles.devBtnTestText}>Test Ping</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleApplyConfig} style={[styles.devBtn, styles.devBtnApply]}>
                  <Text style={styles.devBtnApplyText}>Apply</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResetConfig} style={[styles.devBtn, styles.devBtnReset]}>
                  <Text style={styles.devBtnResetText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Email input field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder="admin@email.com"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          {/* Password input field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, passwordFocused && styles.inputFocused]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0f19", // Very premium deep dark navy blue
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#111827", // Modern dark slate background
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 32,
    width: "100%",
    maxWidth: 390,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#475569",
  },
  logoIcon: {
    fontSize: 26,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f8fafc",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "500",
  },
  connectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 24,
    maxWidth: "95%",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusDotLive: {
    backgroundColor: "#10b981", // Emerald Green
  },
  statusDotDev: {
    backgroundColor: "#f59e0b", // Amber Orange
  },
  connectionText: {
    color: "#9ca3af",
    fontSize: 11,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 18,
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#1f2937",
    color: "#f8fafc",
  },
  inputFocused: {
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  button: {
    backgroundColor: "#2563eb", // Premium brand Blue
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#1d4ed8",
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  devSettingsCard: {
    backgroundColor: "#0b0f19",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f59e0b",
    marginBottom: 24,
    width: "100%",
  },
  devHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    paddingBottom: 8,
    marginBottom: 12,
  },
  devHeaderTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f59e0b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  devRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  devRowLabel: {
    fontSize: 13,
    color: "#d1d5db",
    fontWeight: "500",
  },
  devLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#f59e0b",
    marginBottom: 6,
  },
  devInput: {
    borderColor: "#4b5563",
    fontSize: 13,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#111827",
  },
  devActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  devBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
  },
  devBtnTest: {
    backgroundColor: "rgba(96, 165, 250, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.4)",
  },
  devBtnTestText: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "bold",
  },
  devBtnApply: {
    backgroundColor: "#2563eb",
  },
  devBtnApplyText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  devBtnReset: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  devBtnResetText: {
    color: "#f87171",
    fontSize: 12,
    fontWeight: "bold",
  },
});
