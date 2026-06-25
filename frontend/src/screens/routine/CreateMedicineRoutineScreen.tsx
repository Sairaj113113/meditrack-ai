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
import apiClient from "../../services/apiClient";

type RoutineType = "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";
type FrequencyType = "DAILY" | "WEEKLY" | "CUSTOM";
type DayOfWeekType = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
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

export default function CreateMedicineRoutineScreen() {
  const navigation = useNavigation<any>();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);

  // Core Fields (Directly on Screen)
  const [routineType, setRoutineType] = useState<RoutineType>("MORNING");
  const [diseaseName, setDiseaseName] = useState(""); // Kept as Textbox - Change 1
  const [routineTime, setRoutineTime] = useState<Date>(() => {
    const time = new Date();
    time.setHours(10, 0, 0, 0); // Default Morning: 10:00 AM
    return time;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("DAILY");
  const [selectedDays, setSelectedDays] = useState<DayOfWeekType[]>([]);

  // Advanced Settings Card (Default Collapsed)
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [reminderSound, setReminderSound] = useState<ReminderSound>("DEFAULT");
  const [snoozeMinutes, setSnoozeMinutes] = useState("10");

  // Reminders Per Time States - Change 4 & 5
  const [remindersPerTime, setRemindersPerTime] = useState<string>("2 Reminders");
  const [customReminderCount, setCustomReminderCount] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  // Bottom Sheet Picker Controller
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalOptions, setModalOptions] = useState<PickerOption[]>([]);
  const [modalTarget, setModalTarget] = useState<string>("");

  // --- AUTO POPULATE CORRESPONDING TYPE TIMES ---
  const handleRoutineTypeChange = (type: RoutineType) => {
    setRoutineType(type);
    const updatedTime = new Date();
    switch (type) {
      case "MORNING": updatedTime.setHours(10, 0, 0, 0); break;
      case "AFTERNOON": updatedTime.setHours(14, 0, 0, 0); break;
      case "EVENING": updatedTime.setHours(19, 0, 0, 0); break;
      case "NIGHT": updatedTime.setHours(21, 0, 0, 0); break;
    }
    setRoutineTime(updatedTime);
  };

  // --- FORMATTING HELPERS ---
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  };

  const toggleDaySelection = (dayValue: DayOfWeekType) => {
    if (frequencyType === "WEEKLY") {
      setSelectedDays([dayValue]);
    } else {
      if (selectedDays.includes(dayValue)) {
        setSelectedDays(selectedDays.filter((d) => d !== dayValue));
      } else {
        setSelectedDays([...selectedDays, dayValue]);
      }
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
      case "routineType": handleRoutineTypeChange(value as RoutineType); break;
      case "frequency": setFrequencyType(value as FrequencyType); setSelectedDays([]); break;
      case "weeklyDay": setSelectedDays([value as DayOfWeekType]); break;
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

  // --- SUBMISSION METHOD & API LAYERING ---
  const handleSaveRoutine = async () => {
    if (!diseaseName.trim()) {
      Alert.alert("Validation", "Please fill in all required fields (Disease Name).");
      return;
    }

    if (frequencyType !== "DAILY" && selectedDays.length === 0) {
      Alert.alert("Validation", "Please select at least one tracking day.");
      return;
    }

    setLoading(true);

    const hours = routineTime.getHours().toString().padStart(2, "0");
    const minutes = routineTime.getMinutes().toString().padStart(2, "0");
    const seconds = routineTime.getSeconds().toString().padStart(2, "0");

    const formatPayloadDate = (d: Date) => 
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const mappedRoutineName = routineType.charAt(0) + routineType.slice(1).toLowerCase();

    const payload = {
      routineName: mappedRoutineName,
      diseaseName: diseaseName.trim(), // Sent as clean string context mapping matching quick structure
      routineTime: `${hours}:${minutes}:${seconds}`,
      frequencyType,
      startDate: formatPayloadDate(startDate),
      endDate: endDate ? formatPayloadDate(endDate) : null,
      isReminderEnabled: true, // Auto submitted true - Change 2
      days: frequencyType === "DAILY" ? [] : selectedDays,
      reminderSound,
      snoozeMinutes: parseInt(snoozeMinutes, 10),
    };

    try {
  const response = await apiClient.post("/routines", payload);
  const parsedId = response.data?.data?.id || response.data?.id;
  
  if (!parsedId) {
    throw new Error("Mal-formatted API response wrapper payload");
  }

  // Pass dynamic values over to Screen 2
  navigation.navigate("AddRoutineMedicines", { 
    routineId: parsedId,
    routineName: mappedRoutineName, 
    diseaseName: diseaseName.trim(),
    routineTime: formatTime(routineTime), // E.g., "10:00 AM" or "07:30 PM"
    frequencyType: frequencyType
  });
}  catch (error) {
      console.error("Routine Setup Transaction Crash Logs:", error);
      Alert.alert("Error", "Failed to preserve schedule mapping parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F9FF" />

      {/* HEADER PATTERN */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A2E40" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create Medicine Routine</Text>
          <Text style={styles.headerSubtitle}>Configure strategic health tracking workflows</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* ROUTINE TYPE DROPDOWN */}
        <Text style={styles.label}>Routine Type</Text>
        <TouchableOpacity 
          style={styles.selectorWrapper} 
          activeOpacity={0.7}
          onPress={() => openOptionSelector("routineType", "Select Routine Type", [
            { label: "Morning", value: "MORNING" },
            { label: "Afternoon", value: "AFTERNOON" },
            { label: "Evening", value: "EVENING" },
            { label: "Night", value: "NIGHT" },
          ])}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="sunny-outline" size={18} color="#289254" />
            </View>
            <Text style={styles.selectorText}>
              {routineType.charAt(0) + routineType.slice(1).toLowerCase()}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#9EA9B7" />
        </TouchableOpacity>

        {/* DISEASE NAME TEXTBOX - CHANGE 1 */}
        <Text style={styles.label}>Disease Name</Text>
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="medical-outline" size={18} color="#289254" />
          </View>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Diabetes, Hypertension, Thyroid, Fever..."
            placeholderTextColor="#9EA9B7"
            value={diseaseName}
            onChangeText={setDiseaseName}
          />
        </View>

        {/* ROUTINE TIME FIELD CONTAINER */}
        <Text style={styles.label}>Routine Clock Time</Text>
        <TouchableOpacity style={styles.selectorWrapper} activeOpacity={0.7} onPress={() => setShowTimePicker(true)}>
          <View style={styles.rowLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="time-outline" size={18} color="#289254" />
            </View>
            <Text style={styles.selectorText}>{formatTime(routineTime)}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>Adjust Time</Text>
          </View>
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker 
            value={routineTime} 
            mode="time" 
            is24Hour={false} 
            display={Platform.OS === "ios" ? "spinner" : "clock"} 
            onChange={(e, t) => { setShowTimePicker(Platform.OS === "ios"); if (t) setRoutineTime(t); }} 
          />
        )}

        {/* REPEAT RULES SEGMENTATION LAYERING */}
        <Text style={styles.label}>Repeat Settings</Text>
        <View style={styles.repeatSchedulingCard}>
          <TouchableOpacity 
            style={[styles.selectorWrapper, { borderWidth: 0, paddingHorizontal: 0, height: 40 }]} 
            activeOpacity={0.7}
            onPress={() => openOptionSelector("frequency", "Primary Repeat Type", [
              { label: "Daily", value: "DAILY" },
              { label: "Weekly", value: "WEEKLY" },
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
                <Text style={styles.infoBadgeText}>Routine runs comprehensively every day at {formatTime(routineTime)}.</Text>
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
                <Text style={styles.innerSelectorText}>
                  {selectedDays[0] ? selectedDays[0].charAt(0) + selectedDays[0].slice(1).toLowerCase() : "Select single weekday"}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#718096" />
              </TouchableOpacity>
            </View>
          )}

          {frequencyType === "CUSTOM" && (
            <View style={styles.dynamicContainer}>
              <Text style={styles.dynamicSubLabel}>Select Target Days</Text>
              <View style={styles.chipsWrapper}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.value as DayOfWeekType);
                  return (
                    <TouchableOpacity
                      key={day.value}
                      style={[styles.dayChip, isSelected ? styles.dayChipSelected : styles.dayChipUnselected]}
                      onPress={() => toggleDaySelection(day.value as DayOfWeekType)}
                    >
                      <Text style={[styles.dayChipText, isSelected ? styles.dayChipTextSelected : styles.dayChipTextUnselected]}>
                        {day.short}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* ADVANCED ACCORDION PANEL - CLOSED BY DEFAULT */}
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
              <Text style={styles.advancedSectionLabel}>Duration Metrics</Text>
              <View style={styles.datePickerRow}>
                <TouchableOpacity style={styles.dateBlock} onPress={() => setShowStartDatePicker(true)}>
                  <Text style={styles.dateBlockLabel}>Start Date</Text>
                  <Text style={styles.dateBlockValue}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                <Ionicons name="arrow-forward" size={16} color="#9EA9B7" style={{ marginHorizontal: 4 }} />
                <TouchableOpacity style={styles.dateBlock} onPress={() => setShowEndDatePicker(true)}>
                  <Text style={styles.dateBlockLabel}>End Date</Text>
                  <Text style={styles.dateBlockValue}>{endDate ? formatDate(endDate) : "Continuous Tracking"}</Text>
                </TouchableOpacity>
              </View>

              {showStartDatePicker && <DateTimePicker value={startDate} mode="date" onChange={(e, d) => { setShowStartDatePicker(false); if (d) setStartDate(d); }} />}
              {showEndDatePicker && <DateTimePicker value={endDate || new Date()} mode="date" onChange={(e, d) => { setShowEndDatePicker(false); if (d) setEndDate(d); }} />}

              {/* REMINDERS PER TIME DROPDOWN FIELD - CHANGE 4 & 6 */}
              <TouchableOpacity 
                style={styles.advancedRowItem}
                onPress={() => openOptionSelector("remindersPerTime", "Reminders Per Time Instance", [
                  { label: "1 Reminder", value: "1 Reminder" },
                  { label: "2 Reminders", value: "2 Reminders" },
                  { label: "3 Reminders", value: "3 Reminders" },
                  { label: "Custom Value...", value: "CUSTOM" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="notifications-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <Text style={styles.rowItemTitleText}>Reminders Per Time</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{remindersPerTime}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

              {/* CUSTOM REMINDER COUNT SMALL CONTAINER INPUT CELL - CHANGE 5 */}
              {showCustomInput && (
                <View style={styles.customInputCard}>
                  <View style={styles.customInputRow}>
                    <TextInput
                      style={styles.customTextInput}
                      placeholder="e.g. 5"
                      placeholderTextColor="#A0AEC0"
                      keyboardType="numeric"
                      value={customReminderCount}
                      onChangeText={(txt) => setCustomReminderCount(txt.replace(/[^0-9]/g, ""))}
                    />
                    <TouchableOpacity style={styles.customSaveButton} onPress={handleSaveCustomReminderCount}>
                      <Text style={styles.customSaveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* REMINDER ALERT SOUND CONFIGURATIONS - CHANGE 6 & 7 */}
              <TouchableOpacity 
                style={styles.advancedRowItem}
                onPress={() => openOptionSelector("sound", "Select Sound Alert", [
                  { label: "Default Tone", value: "DEFAULT" },
                  { label: "Bell Tracker Alert", value: "BELL" },
                  { label: "Chime Cycle Ring", value: "CHIME" },
                  { label: "Continuous Alarm", value: "ALARM" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="volume-medium-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <Text style={styles.rowItemTitleText}>Reminder Tone</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{reminderSound}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

              {/* SNOOZE MINUTE DURATION SELECTOR OFFSET - CHANGE 6 & 8 */}
              <TouchableOpacity 
                style={[styles.advancedRowItem, { borderBottomWidth: 0 }]}
                onPress={() => openOptionSelector("snooze", "Snooze Interval Window", [
                  { label: "5 Minutes", value: "5" },
                  { label: "10 Minutes", value: "10" },
                  { label: "15 Minutes", value: "15" },
                  { label: "30 Minutes", value: "30" },
                ])}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="alarm-outline" size={18} color="#289254" style={{ marginRight: 8 }} />
                  <Text style={styles.rowItemTitleText}>Snooze Duration</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{snoozeMinutes} min</Text>
                  <Ionicons name="chevron-down" size={16} color="#9EA9B7" style={{ marginLeft: 4 }} />
                </View>
              </TouchableOpacity>

            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED ACTION FOOTER BUTTON SEGMENT */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRoutine} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Continue</Text>
              <Ionicons name="arrow-forward-outline" size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* DRAWER POPUP SELECTOR INTERFACE COMPONENT */}
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
  rowRight: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
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
    marginBottom: 4,
  },
  innerSelectorText: { fontSize: 13, color: "#1A2E40", fontWeight: "500" },
  chipsWrapper: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -2, marginBottom: 4 },
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
  advancedRowItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#EDF2F7" },
  rowItemTitleText: { fontSize: 13, fontWeight: "600", color: "#2D3748" },
  rowRightText: { fontSize: 13, color: "#289254", fontWeight: "600" },
  datePickerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  dateBlock: { flex: 1, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  dateBlockLabel: { fontSize: 9, color: "#718096" },
  dateBlockValue: { fontSize: 12, fontWeight: "600", color: "#2D3748" },
  customInputCard: { backgroundColor: "#F7FAFC", borderRadius: 8, padding: 10, marginTop: 4, marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0" },
  customInputRow: { flexDirection: "row", alignItems: "center" },
  customTextInput: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#CBD5E0", borderRadius: 6, height: 36, paddingHorizontal: 10, fontSize: 13, color: "#1A2E40" },
  customSaveButton: { backgroundColor: "#289254", borderRadius: 6, paddingHorizontal: 14, height: 36, justifyContent: "center", alignItems: "center", marginLeft: 6 },
  customSaveButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
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