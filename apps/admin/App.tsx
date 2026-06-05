import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";

// Import Custom Screens
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import SkillsScreen from "./screens/SkillsScreen";
import ProjectsScreen from "./screens/ProjectsScreen";
import ExperiencesScreen from "./screens/ExperiencesScreen";
import PortfolioSettingsScreen from "./screens/PortfolioSettingsScreen";

const LIVE_API_URL = "https://full-task-manager-server-blue.vercel.app";

const getResolvedApiUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === "web") {
      return "http://localhost:5000";
    }
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(":")[0];
      if (ip) {
        return `http://${ip}:5000`;
      }
    }
    return Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
  }
  return LIVE_API_URL;
};

const TOKEN_KEY = "PortfolioAdminToken";

type Screen = "login" | "dashboard" | "skills" | "projects" | "experiences" | "settings";

const isWeb = Platform.OS === "web";

const saveStorageItem = async (key: string, value: string) => {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.error("Storage write error", e);
  }
};

const getStorageItem = async (key: string): Promise<string | null> => {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (e) {
    console.error("Storage read error", e);
    return null;
  }
};

const deleteStorageItem = async (key: string) => {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (e) {
    console.error("Storage delete error", e);
  }
};

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>(getResolvedApiUrl());
  const [isCustomUrl, setIsCustomUrl] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Core Data States
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  // Check saved token & api url configuration on mount
  useEffect(() => {
    async function checkToken() {
      try {
        const savedToken = await getStorageItem(TOKEN_KEY);
        const savedUseCustom = await getStorageItem("PortfolioUseCustomApiUrl");
        const savedCustomUrl = await getStorageItem("PortfolioCustomApiUrl");
        
        let activeUrl = getResolvedApiUrl();
        
        if (savedUseCustom === "true" && savedCustomUrl) {
          setIsCustomUrl(true);
          setCustomUrl(savedCustomUrl);
          activeUrl = savedCustomUrl;
        } else if (savedCustomUrl) {
          setCustomUrl(savedCustomUrl);
        } else {
          setCustomUrl(getResolvedApiUrl());
        }
        
        setApiUrl(activeUrl);

        if (savedToken) {
          setToken(savedToken);
          setCurrentScreen("dashboard");
          // Fetch initial data using the correct active URL
          await fetchAllData(activeUrl, savedToken);
        }
      } catch (e) {
        console.log("Error checking token or api configuration:", e);
      } finally {
        setIsReady(true);
      }
    }
    checkToken();
  }, []);

  // Combined fetch function
  const fetchAllData = async (url = apiUrl, authToken = token) => {
    if (!authToken) return;
    setIsRefreshing(true);
    try {
      const success = await fetchPortfolio(url, authToken);
      if (success) {
        await Promise.all([
          fetchSkills(url, authToken),
          fetchProjects(url, authToken),
          fetchExperiences(url, authToken),
        ]);
      }
    } catch (e) {
      console.log("Error fetching all data", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchPortfolio = async (url = apiUrl, authToken = token): Promise<boolean> => {
    try {
      const res = await fetch(`${url}/api/admin/info-get`, {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPortfolioData(data.PResult);
        return true;
      } else {
        if (res.status === 401) {
          Alert.alert("Session Expired", "Your session has expired. Please sign in again.", [
            { text: "OK", onPress: () => handleLogout() }
          ]);
        } else {
          Alert.alert("Server Error", data.message || "Failed to fetch portfolio data.");
        }
        return false;
      }
    } catch (e: any) {
      console.log("Failed to fetch portfolio:", e);
      Alert.alert(
        "Connection Error",
        `Could not connect to server at ${url}.\n\nPlease check your network connection and server settings.`,
        [
          { text: "Retry", onPress: () => fetchPortfolio(url, authToken) },
          { text: "Change Server URL", onPress: () => handleLogout(), style: "destructive" }
        ]
      );
      return false;
    }
  };

  const fetchSkills = async (url = apiUrl, authToken = token) => {
    try {
      const res = await fetch(`${url}/api/admin/info-skill`, {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSkills(data.SResult || []);
      }
    } catch (e) {
      console.log("Failed to fetch skills:", e);
    }
  };

  const fetchProjects = async (url = apiUrl, authToken = token) => {
    try {
      const res = await fetch(`${url}/api/admin/info-project`, {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.PResult || []);
      }
    } catch (e) {
      console.log("Failed to fetch projects:", e);
    }
  };

  const fetchExperiences = async (url = apiUrl, authToken = token) => {
    try {
      const res = await fetch(`${url}/api/admin/info-exp`, {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setExperiences(data.EResult || []);
      }
    } catch (e) {
      console.log("Failed to fetch experiences:", e);
    }
  };

  const handleUpdateApiConfig = async (useCustom: boolean, url: string) => {
    setIsCustomUrl(useCustom);
    setCustomUrl(url);
    await saveStorageItem("PortfolioUseCustomApiUrl", useCustom ? "true" : "false");
    await saveStorageItem("PortfolioCustomApiUrl", url);
    
    const activeUrl = useCustom ? url : getResolvedApiUrl();
    setApiUrl(activeUrl);
    
    await saveStorageItem("PortfolioApiUrl", activeUrl);
  };

  const handleLogin = async (emailInput: string, passwordInput: string) => {
    if (!emailInput || !passwordInput) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/admin-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        await saveStorageItem(TOKEN_KEY, data.token);
        await saveStorageItem("PortfolioApiUrl", apiUrl);
        setToken(data.token);
        setCurrentScreen("dashboard");
        fetchAllData(apiUrl, data.token);
        Alert.alert("Success", "Logged in successfully!");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (e: any) {
      Alert.alert("Connection Error", "Could not connect to server: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call backend logout
      await fetch(`${apiUrl}/api/auth/admin-signout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (e) {
      console.log("Logout api failed", e);
    }
    await deleteStorageItem(TOKEN_KEY);
    setToken(null);
    setPortfolioData(null);
    setSkills([]);
    setProjects([]);
    setExperiences([]);
    setCurrentScreen("login");
    setIsLoading(false);
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    // Auto refresh lists on screen switch
    if (screen === "dashboard") fetchPortfolio();
    if (screen === "skills") fetchSkills();
    if (screen === "projects") fetchProjects();
    if (screen === "experiences") fetchExperiences();
  };

  // CRUD Skills
  const handleSaveSkill = async (name: string, editingId: string | null): Promise<boolean> => {
    setIsLoading(true);
    try {
      const url = editingId
        ? `${apiUrl}/api/admin/info-up-skill/${editingId}`
        : `${apiUrl}/api/admin/info-create-skill`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        Alert.alert("Success", `Skill ${editingId ? "updated" : "created"}!`);
        fetchSkills();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to save skill");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/info-remove-skill/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert("Success", "Skill deleted!");
        fetchSkills();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to delete skill");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Projects
  const handleSaveProject = async (formData: FormData, editingId: string | null): Promise<boolean> => {
    setIsLoading(true);
    try {
      const url = editingId
        ? `${apiUrl}/api/admin/info-up-project/${editingId}`
        : `${apiUrl}/api/admin/info-create-project`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        Alert.alert("Success", `Project ${editingId ? "updated" : "created"}!`);
        fetchProjects();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to save project");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/info-remove-project/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert("Success", "Project deleted!");
        fetchProjects();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to delete project");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD Experiences
  const handleSaveExperience = async (payload: any, editingId: string | null): Promise<boolean> => {
    setIsLoading(true);
    try {
      const url = editingId
        ? `${apiUrl}/api/admin/info-up-exp/${editingId}`
        : `${apiUrl}/api/admin/info-create-exp`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert("Success", `Experience ${editingId ? "updated" : "created"}!`);
        fetchExperiences();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to save experience");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/info-remove-exp/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert("Success", "Experience deleted!");
        fetchExperiences();
        return true;
      } else {
        const err = await res.json();
        Alert.alert("Error", err.message || "Failed to delete experience");
        return false;
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save Settings & Profile Updates
  const handleSaveSettings = async (
    textFields: any,
    profileImage: ImagePicker.ImagePickerAsset | null,
    resume: DocumentPicker.DocumentPickerAsset | null
  ): Promise<boolean> => {
    if (!portfolioData) {
      Alert.alert("Error", "Portfolio entry ID not found.");
      return false;
    }
    const pid = portfolioData.id || portfolioData._id;
    setIsLoading(true);
    try {
      // 1. Send all textual profile & configuration changes (JSON PUT)
      const textRes = await fetch(`${apiUrl}/api/admin/info-modify/${pid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(textFields)
      });

      if (!textRes.ok) {
        const err = await textRes.json();
        Alert.alert("Error", err.message || "Failed to save text settings");
        setIsLoading(false);
        return false;
      }

      // 2. Send image and pdf documents if selected (FormData PUT)
      if (profileImage || resume) {
        const formData = new FormData();
        formData.append("_id", String(pid));

        if (profileImage) {
          const uri = profileImage.uri;
          const fileType = uri.substring(uri.lastIndexOf(".") + 1);
          const fileName = uri.substring(uri.lastIndexOf("/") + 1);

          formData.append("profileImage", {
            uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
            name: fileName || "profile.jpg",
            type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
          } as any);
        }

        if (resume) {
          const uri = resume.uri;
          const fileType = uri.substring(uri.lastIndexOf(".") + 1);
          const fileName = uri.substring(uri.lastIndexOf("/") + 1);

          formData.append("resume", {
            uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
            name: fileName || "resume.pdf",
            type: "application/pdf",
          } as any);
        }

        const mediaRes = await fetch(`${apiUrl}/api/admin/info-modify/${pid}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        if (!mediaRes.ok) {
          const err = await mediaRes.json();
          Alert.alert("Error", err.message || "Failed to upload file assets");
          setIsLoading(false);
          return false;
        }
      }

      // Re-fetch everything to sync state
      await fetchPortfolio();
      return true;
    } catch (e: any) {
      Alert.alert("Error", e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initializing App...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* HEADER BAR */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("./assets/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>
        {token && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* RENDER ACTIVE SCREEN */}
      <View style={styles.content}>
        {currentScreen === "login" && (
          <LoginScreen
            apiUrl={apiUrl}
            isCustomUrl={isCustomUrl}
            customUrl={customUrl}
            onUpdateApiConfig={handleUpdateApiConfig}
            onLogin={handleLogin}
            isLoading={isLoading}
          />
        )}
        
        {currentScreen === "dashboard" && (
          <DashboardScreen
            portfolioData={portfolioData}
            skillsCount={skills.length}
            projectsCount={projects.length}
            experiencesCount={experiences.length}
            onNavigateTo={navigateTo}
            onRefresh={() => fetchAllData(apiUrl, token)}
            isRefreshing={isRefreshing}
          />
        )}

        {currentScreen === "skills" && (
          <SkillsScreen
            skills={skills}
            onSaveSkill={handleSaveSkill}
            onDeleteSkill={handleDeleteSkill}
            isLoading={isLoading}
            onRefresh={() => fetchAllData(apiUrl, token)}
            isRefreshing={isRefreshing}
          />
        )}

        {currentScreen === "projects" && (
          <ProjectsScreen
            projects={projects}
            apiUrl={apiUrl}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            isLoading={isLoading}
            onRefresh={() => fetchAllData(apiUrl, token)}
            isRefreshing={isRefreshing}
          />
        )}

        {currentScreen === "experiences" && (
          <ExperiencesScreen
            experiences={experiences}
            onSaveExperience={handleSaveExperience}
            onDeleteExperience={handleDeleteExperience}
            isLoading={isLoading}
            onRefresh={() => fetchAllData(apiUrl, token)}
            isRefreshing={isRefreshing}
          />
        )}

        {currentScreen === "settings" && (
          <PortfolioSettingsScreen
            portfolioData={portfolioData}
            apiUrl={apiUrl}
            onSaveSettings={handleSaveSettings}
            isLoading={isLoading}
          />
        )}
      </View>

      {/* BOTTOM TAB BAR NAVIGATION */}
      {token && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, currentScreen === "dashboard" && styles.tabBtnActive]}
            onPress={() => navigateTo("dashboard")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>📊</Text>
            <Text style={[styles.tabBtnText, currentScreen === "dashboard" && styles.tabBtnTextActive]}>Overview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, currentScreen === "skills" && styles.tabBtnActive]}
            onPress={() => navigateTo("skills")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>🛠️</Text>
            <Text style={[styles.tabBtnText, currentScreen === "skills" && styles.tabBtnTextActive]}>Skills</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, currentScreen === "projects" && styles.tabBtnActive]}
            onPress={() => navigateTo("projects")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>📂</Text>
            <Text style={[styles.tabBtnText, currentScreen === "projects" && styles.tabBtnTextActive]}>Projects</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, currentScreen === "experiences" && styles.tabBtnActive]}
            onPress={() => navigateTo("experiences")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>💼</Text>
            <Text style={[styles.tabBtnText, currentScreen === "experiences" && styles.tabBtnTextActive]}>Exp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, currentScreen === "settings" && styles.tabBtnActive]}
            onPress={() => navigateTo("settings")}
            activeOpacity={0.8}
          >
            <Text style={styles.tabEmoji}>⚙️</Text>
            <Text style={[styles.tabBtnText, currentScreen === "settings" && styles.tabBtnTextActive]}>Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Match header background
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#cbd5e1",
    fontSize: 15,
    marginTop: 12,
    fontWeight: "500",
  },
  header: {
    height: Platform.OS === "ios" ? 64 : 72,
    backgroundColor: "#0f172a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingTop: Platform.OS === "android" ? 22 : 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#1e293b",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  tabBar: {
    height: 64,
    backgroundColor: "#0f172a", // Match header background
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 38 : (Platform.OS === "android" ? 34 : 12),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "85%",
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  tabBtnActive: {
    backgroundColor: "rgba(59, 130, 246, 0.12)", // Soft blue capsule background
  },
  tabEmoji: {
    fontSize: 16,
    opacity: 0.8,
  },
  tabBtnText: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 3,
    fontWeight: "500",
  },
  tabBtnTextActive: {
    color: "#60a5fa", // Lighter bright blue for dark tab bar contrast
    fontWeight: "bold",
  },
});
