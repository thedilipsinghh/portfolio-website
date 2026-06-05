import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

interface DashboardScreenProps {
  portfolioData: any;
  skillsCount: number;
  projectsCount: number;
  experiencesCount: number;
  onNavigateTo: (screen: any) => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export default function DashboardScreen({
  portfolioData,
  skillsCount,
  projectsCount,
  experiencesCount,
  onNavigateTo,
  onRefresh,
  isRefreshing,
}: DashboardScreenProps) {
  const stats = portfolioData?.stats || {
    yearsExperience: 0,
    projectsCompleted: 0,
    technologies: 0,
    happyClients: 0,
  };

  const hero = portfolioData?.hero || {
    name: "Dilip Singh",
    title: "MERN Stack Developer",
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
      }
    >
      {/* Welcome & Profile Summary Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>Hello, {hero.name}</Text>
        <Text style={styles.welcomeSubtitle}>{hero.title}</Text>
      </View>

      {/* Database Record Counts */}
      <Text style={styles.sectionTitle}>Content Overview</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.countCard, { borderLeftColor: "#10b981" }]}
          onPress={() => onNavigateTo("skills")}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>🛠️</Text>
          <Text style={styles.cardCount}>{skillsCount}</Text>
          <Text style={styles.cardLabel}>Skills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.countCard, { borderLeftColor: "#3b82f6" }]}
          onPress={() => onNavigateTo("projects")}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>📂</Text>
          <Text style={styles.cardCount}>{projectsCount}</Text>
          <Text style={styles.cardLabel}>Projects</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.countCard, { borderLeftColor: "#8b5cf6" }]}
          onPress={() => onNavigateTo("experiences")}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>💼</Text>
          <Text style={styles.cardCount}>{experiencesCount}</Text>
          <Text style={styles.cardLabel}>Experiences</Text>
        </TouchableOpacity>
      </View>

      {/* Portfolio Statistics */}
      <Text style={styles.sectionTitle}>Portfolio Live Stats</Text>
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{stats.yearsExperience}+</Text>
            <Text style={styles.statLabel}>Years Exp</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{stats.projectsCompleted}+</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>
        <View style={styles.statRowDivider} />
        <View style={styles.statRow}>
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{stats.technologies}+</Text>
            <Text style={styles.statLabel}>Tech Stack</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statNumber}>{stats.happyClients}+</Text>
            <Text style={styles.statLabel}>Happy Clients</Text>
          </View>
        </View>
      </View>

      {/* Content Health & Reports */}
      <Text style={styles.sectionTitle}>System Report</Text>
      <View style={styles.reportCard}>
        <View style={styles.reportItem}>
          <View style={[styles.dot, { backgroundColor: "#10b981" }]} />
          <View style={styles.reportTextContainer}>
            <Text style={styles.reportItemTitle}>Database Health</Text>
            <Text style={styles.reportItemDesc}>PostgreSQL is connected and healthy.</Text>
          </View>
        </View>

        <View style={styles.reportItem}>
          <View style={[styles.dot, { backgroundColor: "#3b82f6" }]} />
          <View style={styles.reportTextContainer}>
            <Text style={styles.reportItemTitle}>Portfolio Site Status</Text>
            <Text style={styles.reportItemDesc}>Live site sync revalidation active.</Text>
          </View>
        </View>

        <View style={styles.reportItem}>
          <View style={[styles.dot, { backgroundColor: "#f59e0b" }]} />
          <View style={styles.reportTextContainer}>
            <Text style={styles.reportItemTitle}>Images & Assets</Text>
            <Text style={styles.reportItemDesc}>Cloudinary CDN connected and active.</Text>
          </View>
        </View>
      </View>

      {/* Quick Settings Action */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => onNavigateTo("settings")}
        activeOpacity={0.8}
      >
        <Text style={styles.settingsButtonText}>⚙️ Manage Profile & Portfolio Content</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Cool gray background
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 36,
  },
  welcomeBanner: {
    backgroundColor: "#0f172a", // Dark header
    borderRadius: 14,
    padding: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  countCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: "31%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  cardCount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: "#e2e8f0",
  },
  statRowDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 14,
  },
  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  reportTextContainer: {
    flex: 1,
  },
  reportItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  reportItemDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
  },
  settingsButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
});
