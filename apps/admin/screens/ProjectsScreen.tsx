import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ProjectItem {
  id: number;
  _id: string;
  title: string;
  description: string;
  note: string;
  image: string;
  tags: string;
  liveLink: string;
  githubLink: string;
}

interface ProjectsScreenProps {
  projects: ProjectItem[];
  apiUrl: string;
  onSaveProject: (formData: FormData, editingId: string | null) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<boolean>;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export default function ProjectsScreen({
  projects,
  apiUrl,
  onSaveProject,
  onDeleteProject,
  isLoading,
  onRefresh,
  isRefreshing,
}: ProjectsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const filteredProjects = projects.filter(
    (proj) =>
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your gallery to upload project images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0]);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setNote("");
    setTags("");
    setLiveLink("");
    setGithubLink("");
    setSelectedImage(null);
    setExistingImageUrl("");
    setModalVisible(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingId(proj.id ? String(proj.id) : proj._id);
    setTitle(proj.title);
    setDescription(proj.description);
    setNote(proj.note || "");
    setTags(proj.tags || "");
    setLiveLink(proj.liveLink || "");
    setGithubLink(proj.githubLink || "");
    setSelectedImage(null);
    setExistingImageUrl(proj.image || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Validation", "Title and Description are required.");
      return;
    }

    if (!editingId && !selectedImage) {
      Alert.alert("Validation", "Please select a project image.");
      return;
    }

    // Build multipart/form-data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("note", note);
    formData.append("tags", tags);
    formData.append("liveLink", liveLink);
    formData.append("githubLink", githubLink);

    if (editingId) {
      formData.append("_id", editingId);
    }

    if (selectedImage) {
      const uri = selectedImage.uri;
      const fileType = uri.substring(uri.lastIndexOf(".") + 1);
      const fileName = uri.substring(uri.lastIndexOf("/") + 1);
      
      formData.append("image", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: fileName || "project.jpg",
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
      } as any);
    }

    const success = await onSaveProject(formData, editingId);
    if (success) {
      setModalVisible(false);
      openCreateModal(); // reset fields
    }
  };

  const handleDelete = (proj: ProjectItem) => {
    const targetId = proj.id ? String(proj.id) : proj._id;
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${proj.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteProject(targetId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      {isRefreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No projects found</Text>
            </View>
          ) : (
            filteredProjects.map((item, idx) => (
              <View key={item._id || item.id || idx} style={styles.listItem}>
                {item.image ? (
                  <Image
                    source={{
                      uri: item.image.startsWith("http")
                        ? item.image
                        : `${apiUrl}${item.image}`,
                    }}
                    style={styles.projectImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}

                <View style={styles.projectDetails}>
                  <Text style={styles.projectTitle}>{item.title}</Text>
                  <Text style={styles.projectTags}>{item.tags}</Text>
                  <Text style={styles.projectDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  {item.note ? <Text style={styles.projectNote}>Note: {item.note}</Text> : null}

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => openEditModal(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Project" : "Add New Project"}
            </Text>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.label}>Project Title *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Portfolio Website"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your project..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Optional Note</Text>
                <TextInput
                  style={styles.input}
                  value={note}
                  onChangeText={setNote}
                  placeholder="e.g. Hosted on Render (free tier)"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Tags</Text>
                <TextInput
                  style={styles.input}
                  value={tags}
                  onChangeText={setTags}
                  placeholder="e.g. React, Node.js, Tailwind"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Live Link</Text>
                <TextInput
                  style={styles.input}
                  value={liveLink}
                  onChangeText={setLiveLink}
                  placeholder="e.g. https://domain.com"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>GitHub Link</Text>
                <TextInput
                  style={styles.input}
                  value={githubLink}
                  onChangeText={setGithubLink}
                  placeholder="e.g. https://github.com/..."
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Project Image *</Text>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                ) : existingImageUrl ? (
                  <Image
                    source={{
                      uri: existingImageUrl.startsWith("http")
                        ? existingImageUrl
                        : `${apiUrl}${existingImageUrl}`,
                    }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.noPreview}>
                    <Text style={styles.noPreviewText}>No image selected</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage} activeOpacity={0.7}>
                  <Text style={styles.imagePickerBtnText}>Select Image File</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Project</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  scrollList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
  },
  listItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  projectImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#64748b",
    fontSize: 14,
  },
  projectDetails: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  projectTags: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
    marginTop: 4,
  },
  projectDesc: {
    fontSize: 14,
    color: "#475569",
    marginTop: 8,
    lineHeight: 20,
  },
  projectNote: {
    fontSize: 12,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 8,
    backgroundColor: "#f1f5f9",
    padding: 8,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 12,
  },
  editButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  editButtonText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 22,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalScroll: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 14,
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
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  previewImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 8,
  },
  noPreview: {
    width: "100%",
    height: 140,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    marginBottom: 8,
  },
  noPreviewText: {
    color: "#64748b",
    fontSize: 13,
  },
  imagePickerBtn: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  imagePickerBtnText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#475569",
    fontWeight: "bold",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
