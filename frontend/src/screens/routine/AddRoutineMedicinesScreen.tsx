import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiClient from "../../services/apiClient";

type MedicineType = "TABLET" | "CAPSULE" | "SYRUP" | "INJECTION" | "DROPS" | "INHALER" | "OTHER";

interface MedicineItem {
  id: string;
  medicineName: string;
  medicineType: MedicineType;
  notes?: string;
}

interface PickerOption {
  label: string;
  value: string;
}

export default function AddRoutineMedicinesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract master routine metrics passed from screen 1 via route params wrapper
  const routineId = route.params?.routineId;
  const displayRoutineName = route.params?.routineName || "Morning";
  const displayRoutineTime = route.params?.routineTime || "08:30 AM";
  const displayFrequency = route.params?.frequencyType || "daily";

  // --- LOCAL COMPONENT STATES ---
  const [loading, setLoading] = useState(false);
  const [medicinesList, setMedicinesList] = useState<MedicineItem[]>([]);

  // Popups & Modal Visibility States
  const [addFormModalVisible, setAddFormModalVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  // Add Medicine Internal Popup Form States
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState<MedicineType>("TABLET");
  const [notes, setNotes] = useState("");

  const handleSelectOption = (value: string) => {
  setMedicineType(value as MedicineType);
  setPickerModalVisible(false);
};

  const medicineTypeOptions: PickerOption[] = [
    { label: "Tablets", value: "TABLET" },
    { label: "Capsules", value: "CAPSULE" },
    { label: "Syrup", value: "SYRUP" },
    { label: "Injection", value: "INJECTION" },
    { label: "Drops", value: "DROPS" },
    { label: "Inhaler", value: "INHALER" },
    { label: "Other", value: "OTHER" },
  ];

  // --- OPERATIONS CONTROLLERS ---
  const handleOpenAddFormModal = () => {
    // Clear localized temporary items context buffer before rendering form layout
    setMedicineName("");
    setMedicineType("TABLET");
    setNotes("");
    setAddFormModalVisible(true);
  };

  const handleAddMedicineIntoLocalState = () => {
    if (!medicineName.trim()) {
      Alert.alert("Validation", "Please fill in the required Medicine Name field.");
      return;
    }

    const newMedItem: MedicineItem = {
      id: Date.now().toString(),
      medicineName: medicineName.trim(),
      medicineType,
      notes: notes.trim() || undefined,
    };

    setMedicinesList([...medicinesList, newMedItem]);
    setAddFormModalVisible(false); // Close the intermediate modal pop up automatically as shown inside image_db97bd.png
  };

  const handleDeleteLocalItem = (id: string) => {
    setMedicinesList(medicinesList.filter((m) => m.id !== id));
  };

  const handleCommitAllMedicinesToServer = async () => {
    if (medicinesList.length === 0) {
      Alert.alert("Validation", "Please add at least one medicine to finish creating this routine.");
      return;
    }

    if (!routineId) {
      Alert.alert("Error", "Routine reference context tracking parameter dropped. Go back and retry.");
      return;
    }

    setLoading(true);

  //  REPLACE WITH THIS UPDATED NAVIGATION BLOCK:
try {
  for (const med of medicinesList) {
    const payload = {
      medicineName: med.medicineName,
      medicineType: med.medicineType,
      notes: med.notes || null,
    };
    await apiClient.post(`/routines/${routineId}/medicines`, payload);
  }

  // Navigates directly to Screen 3 passing along the custom card metrics
  navigation.navigate("RoutineCreatedSuccessScreen", {
    routineName: displayRoutineName,
    diseaseName: route.params?.diseaseName || "General Health", 
    routineTime: displayRoutineTime,
  });
} catch (error) {
      console.error("Failed executing batch transactional asset allocation:", error);
      Alert.alert("Transaction Error", "Failed to preserve routine medicine targets on database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9FF" />

      {/* HEADER SECTION LAYOUT PATTERN */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A2E40" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{displayRoutineName} Routine</Text>
          <Text style={styles.headerSubtitle}>{displayRoutineTime} {displayFrequency.toLowerCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* GREEN INFORMATION BAR MATCHING THE SPECIFIED BLUEPRINT NOTE EXPLICITLY */}
       <View style={styles.infoBox}>
    <Ionicons name="information-circle-outline" size={18} color="#289254" />
    <Text style={styles.infoText}>
      Note: Add medicine you take in {displayRoutineTime}
    </Text>
  </View>

        {/* DASHED TRIGGER BUTTON POPPING UP INTERACTIVE MID-BOTTOM ENTRY BLOCK ELEMENT */}
        <TouchableOpacity 
          style={styles.addMedicineTriggerButton} 
          onPress={handleOpenAddFormModal}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={20} color="#289254" style={{ marginRight: 6 }} />
          <Text style={styles.addMedicineTriggerText}>Add Medicine</Text>
        </TouchableOpacity>

        {/* COLLECTED MEDICINE RENDER GROUP LAYOUT ARCHITECTURE */}
        {medicinesList.length > 0 ? (
          <View style={styles.listSectionWrapper}>
            {medicinesList.map((item) => (
              <View key={item.id} style={styles.medicineCard}>
                <View style={styles.cardDragHandleIcon}>
                  <Ionicons name="menu-outline" size={20} color="#CBD5E0" />
                </View>
                <View style={styles.cardMiddleBody}>
                  <Text style={styles.cardMedicineTitle}>{item.medicineName}</Text>
                  <Text style={styles.cardMedicineTypeSubtitle}>
                    1 {item.medicineType.charAt(0) + item.medicineType.slice(1).toLowerCase()}
                  </Text>
                  {item.notes && <Text style={styles.cardNotesDetail}>Note: {item.notes}</Text>}
                </View>
                <TouchableOpacity 
                  style={styles.cardDeleteTriggerAction}
                  onPress={() => handleDeleteLocalItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#E53E3E" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainerState}>
            <Ionicons name="alert-circle-outline" size={48} color="#CBD5E0" />
            <Text style={styles.emptyContainerText}>No medicines added to this layout loop stack yet.</Text>
          </View>
        )}

      </ScrollView>

      {/* CONTINUOUS WORKFLOW STACK PROGRESS BUTTON REGISTRY FRAMEWORK */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleCommitAllMedicinesToServer} 
          disabled={loading} 
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Create Routine</Text>
              <Ionicons name="arrow-forward-outline" size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* --- ADD MEDICINE INPUT FORM POPUP MODAL (CHANGE DIALOG TO OPEN LAYOUT SYSTEM) --- */}
      <Modal 
        visible={addFormModalVisible} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setAddFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissView} activeOpacity={1} onPress={() => setAddFormModalVisible(false)} />
          <View style={[styles.modalSheetContent, { maxHeight: "80%" }]}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={styles.modalSheetTitle}>Add Medicine</Text>

            {/* FORM FIELD: MEDICINE NAME */}
            <Text style={styles.label}>Medicine Name</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <Ionicons name="leaf-outline" size={18} color="#289254" />
              </View>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter medicine name"
                placeholderTextColor="#9EA9B7"
                value={medicineName}
                onChangeText={setMedicineName}
              />
            </View>

            {/* FORM FIELD: MEDICINE TYPE */}
            <Text style={styles.label}>Medicine Type</Text>
            <TouchableOpacity 
              style={styles.selectorWrapper} 
              activeOpacity={0.7}
              onPress={() => setPickerModalVisible(true)}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name="flask-outline" size={18} color="#289254" />
                </View>
                <Text style={styles.selectorText}>
                  {medicineTypeOptions.find(o => o.value === medicineType)?.label || "Tablets"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#9EA9B7" />
            </TouchableOpacity>

            {/* FORM FIELD: NOTES (OPTIONAL) */}
            <Text style={styles.label}>Notes (Optional)</Text>
            <View style={[styles.inputWrapper, styles.multilineFieldWrapper]}>
              <View style={[styles.iconCircle, { alignSelf: "flex-start", marginTop: 8 }]}>
                <Ionicons name="document-text-outline" size={18} color="#289254" />
              </View>
              <TextInput
                style={[styles.inputWithIcon, styles.multilineInputBox]}
                placeholder="Add notes (optional)"
                placeholderTextColor="#9EA9B7"
                multiline
                numberOfLines={2}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* LOCAL COMMIT SAVE BUTTON INSIDE POPUP DRAWER CONTAINER */}
            <TouchableOpacity 
              style={[styles.saveButton, { marginTop: 24 }]} 
              onPress={handleAddMedicineIntoLocalState}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- REUSE IN-STACK TYPE PICKER OPTIONS SELECTOR SHEET --- */}
      <Modal 
        visible={pickerModalVisible} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 20, 40, 0.5)" }]}>
          <TouchableOpacity style={styles.modalDismissView} activeOpacity={1} onPress={() => setPickerModalVisible(false)} />
          <View style={[styles.modalSheetContent, { paddingBottom: 24 }]}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={styles.modalSheetTitle}>Select Medicine Type</Text>
            <FlatList
              data={medicineTypeOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalOptionRow} 
                  onPress={() => { handleSelectOption(item.value); setPickerModalVisible(false); }}
                >
                  <Text style={styles.modalOptionLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward-outline" size={16} color="#CBD5E0" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F9FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 24) : 12,
    paddingBottom: 8,
  },
  backButton: { padding: 6, marginRight: 4 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1A2E40" },
  headerSubtitle: { fontSize: 12, color: "#718096", marginTop: 1 },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 110 },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF7ED",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#C3E6CB",
  },
  infoText: { flex: 1, marginLeft: 8, fontSize: 13, color: "#289254", fontWeight: "500" },
  addMedicineTriggerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#289254",
    borderRadius: 12,
    height: 48,
    marginTop: 14,
    marginBottom: 8,
  },
  addMedicineTriggerText: { color: "#289254", fontSize: 14, fontWeight: "600" },
  listSectionWrapper: { marginTop: 6 },
  medicineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardDragHandleIcon: { marginRight: 10 },
  cardMiddleBody: { flex: 1 },
  cardMedicineTitle: { fontSize: 15, fontWeight: "600", color: "#1A2E40" },
  cardMedicineTypeSubtitle: { fontSize: 12, color: "#718096", marginTop: 1 },
  cardNotesDetail: { fontSize: 11, color: "#4A5568", marginTop: 4, fontStyle: "italic" },
  cardDeleteTriggerAction: { padding: 6, marginLeft: 6 },
  emptyContainerState: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyContainerText: { fontSize: 13, color: "#A0AEC0", marginTop: 10, textAlign: "center" },
  label: { fontSize: 13, fontWeight: "600", color: "#2D3748", marginBottom: 6, marginTop: 14 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 10,
  },
  inputWithIcon: { flex: 1, height: "100%", fontSize: 14, color: "#1A2E40", marginLeft: 10 },
  multilineFieldWrapper: { height: "auto", minHeight: 70, alignItems: "flex-start" },
  multilineInputBox: { textAlignVertical: "top", paddingVertical: 10, minHeight: 70 },
  selectorWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 10,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EDF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  selectorText: { fontSize: 14, color: "#1A2E40", fontWeight: "500", marginLeft: 10 },
  bottomActions: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: Platform.OS === "ios" ? 24 : 16, paddingTop: 8, backgroundColor: "#F5F9FF" },
  saveButton: { flexDirection: "row", backgroundColor: "#289254", height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center", elevation: 3 },
  saveButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 42, 71, 0.4)", justifyContent: "flex-end" },
  modalDismissView: { flex: 1 },
  modalSheetContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingBottom: 30 },
  modalHeaderIndicator: { width: 36, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 16 },
  modalSheetTitle: { fontSize: 16, fontWeight: "700", color: "#1A2E40", marginBottom: 12 },
  modalOptionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#F7FAFC" },
  modalOptionLabel: { fontSize: 15, color: "#2D3748", fontWeight: "500" },
});