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
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { addMedicine } from "../../services/medicineService";

// Enums based on backend specifications
type MedicineType = "TABLET" | "CAPSULE" | "SYRUP" | "INJECTION" | "DROPS" | "INHALER" | "OTHER";
type FrequencyType = "DAILY" | "WEEKLY" | "INTERVAL" | "CUSTOM";
type IntakeInstruction = "BEFORE_FOOD" | "AFTER_FOOD" | "WITH_FOOD" | "EMPTY_STOMACH" | "ANYTIME";
type ReminderSound = "DEFAULT" | "BELL" | "CHIME" | "ALARM";

interface PickerOption {
  label: string;
  value: string;
}

const DAYS_OF_WEEK = [
  { label: "Monday", value: "MONDAY", short: "Mon" },
  { label: "Tuesday", value: "TUESDAY", short: "Tue" },
  { label: "Wednesday", value: "WEDNESDAY", short: "Wed" },
  { label: "Thursday", value: "THURSDAY", short: "Thu" },
  { label: "Friday", value: "FRIDAY", short: "Fri" },
  { label: "Saturday", value: "SATURDAY", short: "Sat" },
  { label: "Sunday", value: "SUNDAY", short: "Sun" },
];

export default function AddQuickMedicineScreen() {
  const navigation = useNavigation<any>();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);

  // Section 1: Medicine Information
  const [diseaseName, setDiseaseName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [medicineType, setMedicineType] = useState<MedicineType>("TABLET");

  // Section 2: Reminder & Scheduling Settings
  const [reminderTime, setReminderTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("DAILY");
  const [intakeInstruction, setIntakeInstruction] = useState<IntakeInstruction>("AFTER_FOOD");

  // Scheduling Configurations
  const [selectedWeeklyDay, setSelectedWeeklyDay] = useState<string>("MONDAY");
  const [selectedIntervalHours, setSelectedIntervalHours] = useState<string>("6");
  const [selectedCustomDays, setSelectedCustomDays] = useState<string[]>([]);

  // Section 3: Advanced Options Settings
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [reminderSound, setReminderSound] = useState<ReminderSound>("DEFAULT");
  const [snoozeMinutes, setSnoozeMinutes] = useState("10");

  const [remindersPerTime, setRemindersPerTime] = useState<string>("2 Reminders");
  const [customReminderCount, setCustomReminderCount] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Bottom Sheet Picker Controller
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOptions, setModalOptions] = useState<PickerOption[]>([]);
  const [modalTarget, setModalTarget] = useState<string>("");

  // --- NATIVE DATE/TIME EVENT HANDLERS ---
  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) setReminderTime(selectedDate);
  };

  const handleStartDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (selectedDate) setEndDate(selectedDate);
  };

  // --- FORMATTING HELPERS ---
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  };

  const toggleCustomDay = (dayValue: string) => {
    if (selectedCustomDays.includes(dayValue)) {
      setSelectedCustomDays(selectedCustomDays.filter((d) => d !== dayValue));
    } else {
      setSelectedCustomDays([...selectedCustomDays, dayValue]);
    }
  };

  const openOptionSelector = (target: string, title: string, options: PickerOption[]) => {
    setModalTarget(target);
    setModalTitle(title);
    setModalOptions(options);
    setModalVisible(true);
  };

  const handleSelectOption = (value: string) => {
    if (modalTarget === "remindersPerTime") {
      if (value === "CUSTOM") {
        setShowCustomInput(true);
        setModalVisible(false);
        return;
      } else {
        setShowCustomInput(false);
        setRemindersPerTime(value);
      }
    }

    switch (modalTarget) {
      case "type": setMedicineType(value as MedicineType); break;
      case "frequency": setFrequencyType(value as FrequencyType); break;
      case "weeklyDay": setSelectedWeeklyDay(value); break;
      case "intake": setIntakeInstruction(value as IntakeInstruction); break;
      case "sound": setReminderSound(value as ReminderSound); break;
      case "snooze": setSnoozeMinutes(value); break;
    }
    setModalVisible(false);
  };

  const handleSaveCustomReminderCount = () => {
    if (!customReminderCount.trim()) {
      Alert.alert("Input Required", "Please enter a valid count.");
      return;
    }
    setRemindersPerTime(`${customReminderCount.trim()} Reminders`);
    setShowCustomInput(false);
  };

  // --- SUBMISSION METHOD & API INTEGRATION ---
  const handleSave = async () => {
    if (!medicineName.trim()) {
      Alert.alert("Validation", "Please fill in all required fields (Medicine Name).");
      return;
    }

    if (frequencyType === "INTERVAL") {
      const intervalVal = parseInt(selectedIntervalHours, 10);
      if (!selectedIntervalHours.trim() || isNaN(intervalVal) || intervalVal <= 0) {
        Alert.alert("Validation", "Please enter valid interval hours.");
        return;
      }
    }

    if (frequencyType === "CUSTOM" && selectedCustomDays.length === 0) {
      Alert.alert("Validation", "Please select at least one day.");
      return;
    }

    setLoading(true);
    const hours = reminderTime.getHours().toString().padStart(2, "0");
    const minutes = reminderTime.getMinutes().toString().padStart(2, "0");
    const timeFormatted = formatTime(reminderTime);

    const extractedRemindersCount = parseInt(remindersPerTime.replace(/[^0-9]/g, ""), 10) || 1;

    const payload: any = {
      diseaseName: diseaseName.trim() || undefined,
      medicineName: medicineName.trim(),
      medicineCategory: "QUICK",
      medicineType,
      frequencyType,
      intakeInstruction,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
      notes: notes.trim() || undefined,
      reminderSound,
      snoozeMinutes: parseInt(snoozeMinutes, 10),
      schedules: [
        {
          scheduleTime: `${hours}:${minutes}`,
          scheduleType: frequencyType === "INTERVAL" ? "CUSTOM" : frequencyType,
          remindersCount: extractedRemindersCount,
        },
      ],
    };

    if (frequencyType === "WEEKLY") payload.dayOfWeek = selectedWeeklyDay;
    else if (frequencyType === "INTERVAL") payload.intervalHours = parseInt(selectedIntervalHours, 10);
    else if (frequencyType === "CUSTOM") payload.selectedDays = selectedCustomDays;

    try {
      await addMedicine(payload);
      navigation.navigate('MedicineAddedSuccessScreen', {
        medicineName: medicineName,
        medicineType: medicineType,
        reminderTime: timeFormatted,
        frequencyType: frequencyType,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
        notes: notes,
        intakeInstruction: intakeInstruction,
      });
    } catch (error) {
      console.error("Save Error:", error);
      Alert.alert("Error", "Failed to save medicine. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9FF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A2E40" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Quick Medicines</Text>
          <Text style={styles.headerSubtitle}>Add a medicine you need to take right away</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.label}>Disease (Optional)</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="medical-outline" size={18} color="#289254" />
          </View>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Diabetes, Hypertension, Fever..."
            placeholderTextColor="#9EA9B7"
            value={diseaseName}
            onChangeText={setDiseaseName}
          />
        </View>

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

        <Text style={styles.label}>Medicine Type</Text>
        <TouchableOpacity 
          style={styles.selectorWrapper} 
          activeOpacity={0.7}
          onPress={() => openOptionSelector("type", "Select Medicine Type", [
            { label: "Tablet", value: "TABLET" },
            { label: "Capsule", value: "CAPSULE" },
            { label: "Syrup", value: "SYRUP" },
            { label: "Injection", value: "INJECTION" },
            { label: "Drops", value: "DROPS" },
            { label: "Inhaler", value: "INHALER" },
            { label: "Other", value: "OTHER" },
          ])}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="flask-outline" size={18} color="#289254" />
            </View>
            <Text style={styles.selectorText}>{medicineType}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#9EA9B7" />
        </TouchableOpacity>

        <Text style={styles.label}>Reminder Time</Text>
        <TouchableOpacity style={styles.selectorWrapper} activeOpacity={0.7} onPress={() => setShowTimePicker(true)}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={18} color="#289254" />
            </View>
            <Text style={styles.selectorText}>{formatTime(reminderTime)}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>Set Clock</Text>
          </View>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker 
            value={reminderTime} 
            mode="time" 
            is24Hour={false} 
            display={Platform.OS === "ios" ? "spinner" : "clock"} 
            onChange={handleTimeChange} 
          />
        )}

        <Text style={styles.label}>Repeat Settings</Text>
        <View style={styles.repeatSchedulingCard}>
          <TouchableOpacity 
            style={[styles.selectorWrapper, { borderWidth: 0, paddingHorizontal: 0, height: 40 }]} 
            activeOpacity={0.7}
            onPress={() => openOptionSelector("frequency", "Primary Repeat Type", [
              { label: "Daily", value: "DAILY" },
              { label: "Weekly", value: "WEEKLY" },
              { label: "Every X Hours", value: "INTERVAL" },
              { label: "Custom Days", value: "CUSTOM" },
            ])}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="refresh-outline" size={18} color="#289254" />
              </View>
              <Text style={styles.selectorText}>
                {frequencyType.charAt(0) + frequencyType.slice(1).toLowerCase()}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#9EA9B7" />
          </TouchableOpacity>

          {frequencyType === "DAILY" && (
            <View style={styles.dynamicContainer}>
              <View style={styles.infoBadge}>
                <Ionicons name="information-circle-outline" size={16} color="#2B6CB0" style={{ marginRight: 6 }} />
                <Text style={styles.infoBadgeText}>Take every day at {formatTime(reminderTime)}.</Text>
              </View>
            </View>
          )}

          {frequencyType === "WEEKLY" && (
            <View style={styles.dynamicContainer}>
              <Text style={styles.dynamicSubLabel}>Day Selection</Text>
              <TouchableOpacity 
                style={styles.innerSelector}
                onPress={() => openOptionSelector("weeklyDay", "Select Day of Week", DAYS_OF_WEEK)}
              >
                <Text style={styles.innerSelectorText}>{selectedWeeklyDay}</Text>
                <Ionicons name="chevron-down" size={16} color="#718096" />
              </TouchableOpacity>
              <View style={styles.infoBadge}>
                <Ionicons name="information-circle-outline" size={16} color="#2B6CB0" style={{ marginRight: 6 }} />
                <Text style={styles.infoBadgeText}>Every {selectedWeeklyDay.toLowerCase()} at {formatTime(reminderTime)}.</Text>
              </View>
            </View>
          )}

          {frequencyType === "INTERVAL" && (
            <View style={styles.dynamicContainer}>
              <Text style={styles.dynamicSubLabel}>Interval Duration (Hours)</Text>
              <View style={styles.innerTextInputRow}>
                <TextInput
                  style={styles.innerNumericInput}
                  placeholder="E.g. 6"
                  keyboardType="numeric"
                  value={selectedIntervalHours}
                  onChangeText={(text) => setSelectedIntervalHours(text.replace(/[^0-9]/g, ""))}
                />
                <Text style={styles.innerInputSuffix}>Hours</Text>
              </View>
            </View>
          )}

          {frequencyType === "CUSTOM" && (
            <View style={styles.dynamicContainer}>
              <Text style={styles.dynamicSubLabel}>Select Days</Text>
              <View style={styles.chipsWrapper}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day.value}
                    style={[styles.dayChip, selectedCustomDays.includes(day.value) ? styles.dayChipSelected : styles.dayChipUnselected]}
                    onPress={() => toggleCustomDay(day.value)}
                  >
                    <Text style={[styles.dayChipText, selectedCustomDays.includes(day.value) ? styles.dayChipTextSelected : styles.dayChipTextUnselected]}>
                      {day.short}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <Text style={styles.label}>Intake Instruction</Text>
        <TouchableOpacity 
          style={styles.selectorWrapper} 
          activeOpacity={0.7}
          onPress={() => openOptionSelector("intake", "Intake Instructions", [
            { label: "Before Food", value: "BEFORE_FOOD" },
            { label: "After Food", value: "AFTER_FOOD" },
            { label: "With Food", value: "WITH_FOOD" },
            { label: "Empty Stomach", value: "EMPTY_STOMACH" },
            { label: "Anytime", value: "ANYTIME" },
          ])}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="nutrition-outline" size={18} color="#289254" />
            </View>
            <Text style={styles.selectorText}>{intakeInstruction.replace("_", " ")}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#9EA9B7" />
        </TouchableOpacity>

        <View style={styles.advancedContainer}>
          <TouchableOpacity
            style={styles.advancedHeader}
            onPress={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="settings-outline" size={20} color="#289254" style={{ marginRight: 8 }} />
              <Text style={styles.advancedHeaderTitle}>Advanced Options</Text>
            </View>
            <Ionicons name={isAdvancedExpanded ? "chevron-up" : "chevron-down"} size={20} color="#289254" />
          </TouchableOpacity>

          {isAdvancedExpanded && (
            <View style={styles.advancedContent}>
              <Text style={styles.advancedSectionLabel}>Duration</Text>
              <View style={styles.datePickerRow}>
                <TouchableOpacity style={styles.dateBlock} onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.dateBlockLabel}>Start Date</Text>
                  <Text style={styles.dateBlockValue}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Ionicons name="arrow-forward" size={16} color="#9EA9B7" style={{ marginHorizontal: 4 }} />
                <TouchableOpacity style={styles.dateBlock} onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.dateBlockLabel}>End Date</Text>
                  <Text style={styles.dateBlockValue}>{endDate ? formatDate(endDate) : "Continuous"}</Text>
                </TouchableOpacity>
              </View>

              {showStartDatePicker && <DateTimePicker value={startDate} mode="date" onChange={handleStartDateChange} />}
              {showEndDatePicker && <DateTimePicker value={endDate || new Date()} mode="date" onChange={handleEndDateChange} />}

              {/* REMINDERS PER TIME */}
              <TouchableOpacity 
                style={styles.advancedRowItem}
                onPress={() => openOptionSelector("remindersPerTime", "Reminders per time", [
                  { label: "1 Reminder", value: "1 Reminder" },
                  { label: "2 Reminders", value: "2 Reminders" },
                  { label: "3 Reminders", value: "3 Reminders" },
                  { label: "Custom Value...", value: "CUSTOM" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="notifications-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.rowItemTitleText}>Reminders per time</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{remindersPerTime}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

              {showCustomInput && (
                <View style={styles.customInputCard}>
                  <View style={styles.customInputRow}>
                    <TextInput
                      style={styles.customTextInput}
                      placeholder="e.g. 5"
                      keyboardType="numeric"
                      value={customReminderCount}
                      onChangeText={setCustomReminderCount}
                    />
                    <TouchableOpacity style={styles.customSaveButton} onPress={handleSaveCustomReminderCount}>
                      <Text style={styles.customSaveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* SNOOZE MINUTES SELECTOR */}
              <TouchableOpacity 
                style={styles.advancedRowItem}
                onPress={() => openOptionSelector("snooze", "Select Snooze Duration", [
                  { label: "5 Minutes", value: "5" },
                  { label: "10 Minutes", value: "10" },
                  { label: "15 Minutes", value: "15" },
                  { label: "30 Minutes", value: "30" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="alarm-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.rowItemTitleText}>Snooze Time</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{snoozeMinutes} min</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

              {/* REMINDER SOUND */}
              <TouchableOpacity 
                style={[styles.advancedRowItem, { borderBottomWidth: 0 }]}
                onPress={() => openOptionSelector("sound", "Select Sound Alert", [
                  { label: "Default", value: "DEFAULT" },
                  { label: "Bell Sound", value: "BELL" },
                  { label: "Chime Ring", value: "CHIME" },
                  { label: "Continuous Alarm", value: "ALARM" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="volume-medium-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <View>
                    <Text style={styles.rowItemTitleText}>Reminder Sound</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{reminderSound}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

              <Text style={styles.advancedSectionLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="E.g. Drink warm water..."
                placeholderTextColor="#A0AEC0"
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="add" size={24} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveButtonText}>Save Medicine</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismissView} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheetContent}>
            <View style={styles.modalHeaderIndicator} />
            <Text style={styles.modalSheetTitle}>{modalTitle}</Text>
            <FlatList
              data={modalOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOptionRow} onPress={() => handleSelectOption(item.value)}>
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
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  label: { fontSize: 13, fontWeight: "600", color: "#2D3748", marginBottom: 6, marginTop: 10 },
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
  iconCircleSmall: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#EDF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  selectorText: { fontSize: 14, color: "#1A2E40", fontWeight: "500", marginLeft: 10 },
  timeBadge: { backgroundColor: "#289254", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timeBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  repeatSchedulingCard: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 12, marginBottom: 4 },
  dynamicContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#EDF2F7" },
  dynamicSubLabel: { fontSize: 12, fontWeight: "600", color: "#4A5568", marginBottom: 6 },
  innerSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  innerSelectorText: { fontSize: 13, color: "#1A2E40", fontWeight: "500" },
  innerTextInputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F7FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, height: 44, paddingHorizontal: 12, marginBottom: 8 },
  innerNumericInput: { flex: 1, height: "100%", fontSize: 14, color: "#1A2E40", fontWeight: "500" },
  innerInputSuffix: { fontSize: 13, color: "#718096", fontWeight: "600" },
  chipsWrapper: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -2, marginBottom: 6 },
  dayChip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1, marginHorizontal: 2, marginBottom: 6 },
  dayChipUnselected: { backgroundColor: "#F7FAFC", borderColor: "#E2E8F0" },
  dayChipSelected: { backgroundColor: "#EDF7ED", borderColor: "#289254" },
  dayChipText: { fontSize: 12, fontWeight: "600" },
  dayChipTextUnselected: { color: "#718096" },
  dayChipTextSelected: { color: "#289254" },
  infoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#EBF8FF", borderRadius: 8, padding: 8, marginTop: 2 },
  infoBadgeText: { fontSize: 11, color: "#2B6CB0", fontWeight: "500", flex: 1 },
  advancedContainer: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, marginTop: 14, overflow: "hidden" },
  advancedHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 12 },
  advancedHeaderTitle: { fontSize: 14, fontWeight: "600", color: "#1A2E40" },
  advancedContent: { paddingHorizontal: 12, paddingBottom: 14 },
  advancedSectionLabel: { fontSize: 10, fontWeight: "700", color: "#718096", textTransform: "uppercase", marginTop: 10, marginBottom: 6 },
  advancedRowItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#EDF2F7" },
  rowItemTitleText: { fontSize: 13, fontWeight: "600", color: "#2D3748" },
  rowRight: { flexDirection: "row", alignItems: "center" },
  rowRightText: { fontSize: 13, color: "#289254", fontWeight: "600" },
  datePickerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  dateBlock: { flex: 1, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  dateBlockLabel: { fontSize: 9, color: "#718096" },
  dateBlockValue: { fontSize: 12, fontWeight: "600", color: "#2D3748" },
  notesInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, padding: 10, fontSize: 13, color: "#2D3748", minHeight: 56, textAlignVertical: "top", marginTop: 2 },
  customInputCard: { backgroundColor: "#F7FAFC", borderRadius: 8, padding: 10, marginTop: 6, borderWidth: 1, borderColor: "#E2E8F0" },
  customInputRow: { flexDirection: "row", alignItems: "center" },
  customTextInput: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E0", borderRadius: 6, height: 36, paddingHorizontal: 10, fontSize: 13 },
  customSaveButton: { backgroundColor: "#289254", borderRadius: 6, paddingHorizontal: 14, height: 36, justifyContent: "center", alignItems: "center", marginLeft: 6 },
  customSaveButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  previewCard: { backgroundColor: "#EBF8FF", borderColor: "#BEE3F8", borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 12 },
  previewTitle: { fontSize: 12, fontWeight: "700", color: "#2B6CB0", marginBottom: 4 },
  previewText: { fontSize: 12, color: "#2D3748", marginTop: 2 },
  bottomActions: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: Platform.OS === "ios" ? 24 : 16, paddingTop: 8, backgroundColor: "#F5F9FF" },
  saveButton: { flexDirection: "row", backgroundColor: "#289254", height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center", elevation: 3 },
  saveButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 42, 71, 0.35)", justifyContent: "flex-end" },
  modalDismissView: { flex: 1 },
  modalSheetContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingBottom: 30, maxHeight: "65%" },
  modalHeaderIndicator: { width: 36, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 16 },
  modalSheetTitle: { fontSize: 16, fontWeight: "700", color: "#1A2E40", marginBottom: 12 },
  modalOptionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderColor: "#F7FAFC" },
  modalOptionLabel: { fontSize: 15, color: "#2D3748", fontWeight: "500" },
});