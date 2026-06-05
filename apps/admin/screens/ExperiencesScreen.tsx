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
} from "react-native";

interface ExperienceItem {
  id: number;
  _id: string;
  title: string;
  place: string;
  date: string;
  type: string;
  description: string;
}

interface ExperiencesScreenProps {
  experiences: ExperienceItem[];
  onSaveExperience: (data: any, editingId: string | null) => Promise<boolean>;
  onDeleteExperience: (id: string) => Promise<boolean>;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export default function ExperiencesScreen({
  experiences,
  onSaveExperience,
  onDeleteExperience,
  isLoading,
  onRefresh,
  isRefreshing,
}: ExperiencesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("work");
  const [description, setDescription] = useState("");

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setPlace("");
    setDate("");
    setType("work");
    setDescription("");
    setModalVisible(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingId(exp.id ? String(exp.id) : exp._id);
    setTitle(exp.title);
    setPlace(exp.place);
    setDate(exp.date);
    setType(exp.type || "work");
    setDescription(exp.description);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !place.trim() || !date.trim() || !description.trim()) {
      Alert.alert("Validation", "Please fill in all required fields.");
      return;
    }

    const payload = {
      title,
      place,
      date,
      type,
      description,
    };

    const success = await onSaveExperience(payload, editingId);
    if (success) {
      setModalVisible(false);
      setTitle("");
      setPlace("");
      setDate("");
      setType("work");
      setDescription("");
      setEditingId(null);
    }
  };

  const handleDelete = (exp: ExperienceItem) => {
    const targetId = exp.id ? String(exp.id) : exp._id;
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${exp.title}" experience at "${exp.place}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteExperience(targetId),
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
          placeholder="Search experiences..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isRefreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
          {filteredExperiences.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No experiences found</Text>
            </View>
          ) : (
            filteredExperiences.map((item, idx) => (
              <View key={item._id || item.id || idx} style={styles.listItem}>
                <View style={styles.headerRow}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <View style={[styles.typeBadge, item.type.toLowerCase() === "education" ? styles.eduBadge : styles.workBadge]}>
                    <Text style={[styles.typeBadgeText, item.type.toLowerCase() === "education" ? styles.eduBadgeText : styles.workBadgeText]}>
                      {item.type}
                    </Text>
                  </View>
                </View>
                <Text style={styles.placeText}>{item.place} ({item.date})</Text>
                <Text style={styles.descText}>{item.description}</Text>

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
            ))
          )}
        </ScrollView>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Experience" : "Add Experience"}
            </Text>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Software Engineer"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Place / Company *</Text>
                <TextInput
                  style={styles.input}
                  value={place}
                  onChangeText={setPlace}
                  placeholder="e.g. Google"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Date Range *</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="e.g. Feb 2026 - Present"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Type *</Text>
                <View style={styles.typeSelectorContainer}>
                  <TouchableOpacity
                    style={[styles.typeOptionBtn, type === "work" && styles.typeOptionBtnActive]}
                    onPress={() => setType("work")}
                  >
                    <Text style={[styles.typeOptionText, type === "work" && styles.typeOptionTextActive]}>
                      Work
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typeOptionBtn, type === "education" && styles.typeOptionBtnActive]}
                    onPress={() => setType("education")}
                  >
                    <Text style={[styles.typeOptionText, type === "education" && styles.typeOptionTextActive]}>
                      Education
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe your role and accomplishments..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                />
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
                  <Text style={styles.saveBtnText}>Save</Text>
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
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  workBadge: {
    backgroundColor: "#eff6ff",
  },
  workBadgeText: {
    color: "#2563eb",
  },
  eduBadge: {
    backgroundColor: "#f0fdf4",
  },
  eduBadgeText: {
    color: "#10b981",
  },
  placeText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
    marginTop: 4,
  },
  descText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
  editButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  typeSelectorContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeOptionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  typeOptionBtnActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  typeOptionText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  typeOptionTextActive: {
    color: "#2563eb",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
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
