import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

interface PortfolioSettingsProps {
  portfolioData: any;
  apiUrl: string;
  onSaveSettings: (
    textFields: any,
    profileImage: ImagePicker.ImagePickerAsset | null,
    resume: DocumentPicker.DocumentPickerAsset | null
  ) => Promise<boolean>;
  isLoading: boolean;
}

type TabType = "hero" | "about" | "stats" | "contact" | "social";

export default function PortfolioSettingsScreen({
  portfolioData,
  apiUrl,
  onSaveSettings,
  isLoading,
}: PortfolioSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hero");

  // Hero States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [selectedResume, setSelectedResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [existingProfileImg, setExistingProfileImg] = useState("");
  const [existingResumeUrl, setExistingResumeUrl] = useState("");

  // About States
  const [aboutDesc1, setAboutDesc1] = useState("");
  const [aboutDesc2, setAboutDesc2] = useState("");

  // Stats States
  const [yearsExp, setYearsExp] = useState("");
  const [projectsCompleted, setProjectsCompleted] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [happyClients, setHappyClients] = useState("");

  // Contact States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Social States
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  // Populate data when received
  useEffect(() => {
    if (portfolioData) {
      setName(portfolioData.hero?.name || "");
      setTitle(portfolioData.hero?.title || "");
      setExistingProfileImg(portfolioData.hero?.profileImage || "");
      setExistingResumeUrl(portfolioData.hero?.resume || "");

      setAboutDesc1(portfolioData.about?.description1 || "");
      setAboutDesc2(portfolioData.about?.description2 || "");

      setYearsExp(portfolioData.stats?.yearsExperience != null ? String(portfolioData.stats.yearsExperience) : "0");
      setProjectsCompleted(portfolioData.stats?.projectsCompleted != null ? String(portfolioData.stats.projectsCompleted) : "0");
      setTechnologies(portfolioData.stats?.technologies != null ? String(portfolioData.stats.technologies) : "0");
      setHappyClients(portfolioData.stats?.happyClients != null ? String(portfolioData.stats.happyClients) : "0");

      setEmail(portfolioData.contact?.email || "");
      setPhone(portfolioData.contact?.phone || "");
      setLocation(portfolioData.contact?.location || "");

      setGithub(portfolioData.social?.github || "");
      setLinkedin(portfolioData.social?.linkedin || "");
      setTwitter(portfolioData.social?.twitter || "");
      setInstagram(portfolioData.social?.instagram || "");
    }
  }, [portfolioData]);

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your gallery to upload profile images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedProfileImage(result.assets[0]);
    }
  };

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedResume(result.assets[0]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to select resume document.");
    }
  };

  const handleSave = async () => {
    // Construct nested object structure identical to backend expected format
    const textFields = {
      hero: {
        name,
        title,
      },
      about: {
        description1: aboutDesc1,
        description2: aboutDesc2,
      },
      stats: {
        yearsExperience: Number(yearsExp) || 0,
        projectsCompleted: Number(projectsCompleted) || 0,
        technologies: Number(technologies) || 0,
        happyClients: Number(happyClients) || 0,
      },
      contact: {
        email,
        phone,
        location,
      },
      social: {
        github,
        linkedin,
        twitter,
        instagram,
      },
    };

    const success = await onSaveSettings(textFields, selectedProfileImage, selectedResume);
    if (success) {
      setSelectedProfileImage(null);
      setSelectedResume(null);
      Alert.alert("Success", "Portfolio settings updated successfully!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Settings Navigation Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
        {(["hero", "about", "stats", "contact", "social"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === "hero"
                ? "Hero & Profile"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Settings Form ScrollArea */}
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
        {activeTab === "hero" && (
          <View>
            <Text style={styles.sectionHeading}>Hero & Profile Details</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Hero Title / Subtitle</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            </View>

            {/* Profile Image Pick Section */}
            <View style={styles.mediaPickerRow}>
              <View style={styles.mediaCol}>
                <Text style={styles.label}>Profile Picture</Text>
                {selectedProfileImage ? (
                  <Image source={{ uri: selectedProfileImage.uri }} style={styles.profilePreview} />
                ) : existingProfileImg ? (
                  <Image
                    source={{
                      uri: existingProfileImg.startsWith("http")
                        ? existingProfileImg
                        : `${apiUrl}${existingProfileImg}`,
                    }}
                    style={styles.profilePreview}
                  />
                ) : (
                  <View style={styles.profilePreviewPlaceholder} />
                )}
                <TouchableOpacity style={styles.pickerBtn} onPress={pickProfileImage} activeOpacity={0.7}>
                  <Text style={styles.pickerBtnText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Resume File Pick Section */}
              <View style={styles.mediaCol}>
                <Text style={styles.label}>Resume (PDF)</Text>
                <View style={styles.resumeBox}>
                  <Text style={styles.fileIcon}>📄</Text>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    {selectedResume
                      ? selectedResume.name
                      : existingResumeUrl
                      ? existingResumeUrl.substring(existingResumeUrl.lastIndexOf("/") + 1)
                      : "No resume uploaded"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.pickerBtn} onPress={pickResume} activeOpacity={0.7}>
                  <Text style={styles.pickerBtnText}>Select PDF File</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === "about" && (
          <View>
            <Text style={styles.sectionHeading}>About Text Content</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description Paragraph 1</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={aboutDesc1}
                onChangeText={setAboutDesc1}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description Paragraph 2</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={aboutDesc2}
                onChangeText={setAboutDesc2}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        )}

        {activeTab === "stats" && (
          <View>
            <Text style={styles.sectionHeading}>Portfolio Statistics Counters</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                style={styles.input}
                value={yearsExp}
                onChangeText={setYearsExp}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Projects Completed</Text>
              <TextInput
                style={styles.input}
                value={projectsCompleted}
                onChangeText={setProjectsCompleted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Technologies Known</Text>
              <TextInput
                style={styles.input}
                value={technologies}
                onChangeText={setTechnologies}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Happy Clients</Text>
              <TextInput
                style={styles.input}
                value={happyClients}
                onChangeText={setHappyClients}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {activeTab === "contact" && (
          <View>
            <Text style={styles.sectionHeading}>Contact Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} />
            </View>
          </View>
        )}

        {activeTab === "social" && (
          <View>
            <Text style={styles.sectionHeading}>Social Media Profiles</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>GitHub Profile Link</Text>
              <TextInput
                style={styles.input}
                value={github}
                onChangeText={setGithub}
                placeholder="https://github.com/..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>LinkedIn Profile Link</Text>
              <TextInput
                style={styles.input}
                value={linkedin}
                onChangeText={setLinkedin}
                placeholder="https://linkedin.com/in/..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Twitter / X Link</Text>
              <TextInput
                style={styles.input}
                value={twitter}
                onChangeText={setTwitter}
                placeholder="https://twitter.com/..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Instagram Link</Text>
              <TextInput
                style={styles.input}
                value={instagram}
                onChangeText={setInstagram}
                placeholder="https://instagram.com/..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]} onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Portfolio Content</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  tabBar: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    maxHeight: 52,
  },
  tabBarContent: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#2563eb",
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  mediaPickerRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  mediaCol: {
    flex: 1,
    alignItems: "center",
  },
  profilePreview: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: "cover",
    backgroundColor: "#e2e8f0",
    marginBottom: 10,
  },
  profilePreviewPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#cbd5e1",
    marginBottom: 10,
  },
  pickerBtn: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pickerBtnText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "bold",
  },
  resumeBox: {
    width: "100%",
    height: 90,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  fileIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  fileNameText: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#2563eb",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnDisabled: {
    backgroundColor: "#1e3a8a",
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
