import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function RoutineCreatedSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Extract dynamic parameters passed across the pipeline screens
  const routineName = route.params?.routineName || "Morning";
  const routineTime = route.params?.routineTime || "08:30 AM";
  const frequencyType = route.params?.frequencyType || "DAILY";
  const startDateLabel = route.params?.startDateLabel || "24 Jun 2026";
  const endDateLabel = route.params?.endDateLabel || "Continuous";
  const reminderSound = route.params?.reminderSound || "DEFAULT";

  // --- AUTOMATIC REDIRECT TIMEOUT ENGINE ---
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      // Reset the navigation state down to MainTabs dashboard base stack
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    }, 2000); // Triggers automatically after exactly 2 seconds

    return () => clearTimeout(redirectTimeout);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* GREEN CIRCLE CHECKMARK BANNER */}
        <View style={styles.successIconWrapper}>
          <View style={styles.outerSuccessCircle}>
            <View style={styles.innerSuccessCircle}>
              <Ionicons name="checkmark" size={44} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.successMainTitle}>Routine Created</Text>
          <Text style={styles.successMainSubtitle}>Successfully!</Text>
        </View>

        {/* CORE SUMMARY DATA CARD METRICS */}
        <View style={styles.summaryCard}>
          
          {/* ROUTINE TYPE BLOCK */}
          <View style={styles.cardRowItem}>
            <View style={styles.iconCircleLeft}>
              <Ionicons name="sunny-outline" size={18} color="#289254" />
            </View>
            <View style={styles.rowMiddleText}>
              <Text style={styles.rowLabelTitle}>Routine</Text>
              <Text style={styles.rowValueText}>{routineName}</Text>
            </View>
            <View style={styles.compactBadge}>
              <Ionicons name="sunny" size={12} color="#289254" style={{ marginRight: 4 }} />
              <Text style={styles.compactBadgeText}>{routineName}</Text>
            </View>
          </View>

          {/* TIME SUMMARY BLOCK */}
          <View style={styles.cardRowItem}>
            <View style={styles.iconCircleLeft}>
              <Ionicons name="time-outline" size={18} color="#289254" />
            </View>
            <View style={styles.rowMiddleText}>
              <Text style={styles.rowLabelTitle}>Time</Text>
              <Text style={styles.rowValueText}>{routineTime}</Text>
            </View>
            <View style={styles.compactBadge}>
              <Ionicons name="time" size={12} color="#289254" style={{ marginRight: 4 }} />
              <Text style={styles.compactBadgeText}>
                {frequencyType === "DAILY" ? "Daily" : "Flexible"}
              </Text>
            </View>
          </View>

          {/* DURATION RUNTIME BLOCK */}
          <View style={styles.cardRowItem}>
            <View style={styles.iconCircleLeft}>
              <Ionicons name="calendar-outline" size={18} color="#289254" />
            </View>
            <View style={styles.rowMiddleText}>
              <Text style={styles.rowLabelTitle}>Duration</Text>
              <Text style={styles.rowValueText}>
                {startDateLabel} — {endDateLabel}
              </Text>
            </View>
          </View>

          {/* REPEAT BEHAVIOR BLOCK */}
          <View style={styles.cardRowItem}>
            <View style={styles.iconCircleLeft}>
              <Ionicons name="refresh-outline" size={18} color="#289254" />
            </View>
            <View style={styles.rowMiddleText}>
              <Text style={styles.rowLabelTitle}>Repeat</Text>
              <Text style={styles.rowValueText}>
                {frequencyType === "DAILY" ? "Once a Day" : "Selected Scheduled Days"}
              </Text>
            </View>
          </View>

          {/* ALARM SOUND CONFIGURATION BLOCK */}
          <View style={[styles.cardRowItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.iconCircleLeft}>
              <Ionicons name="notifications-outline" size={18} color="#289254" />
            </View>
            <View style={styles.rowMiddleText}>
              <Text style={styles.rowLabelTitle}>Reminder Tone</Text>
              <Text style={styles.rowValueText}>
                {reminderSound.charAt(0) + reminderSound.slice(1).toLowerCase()} Tone
              </Text>
            </View>
          </View>

        </View>

        {/* TRACKING NOTIFIER FOOTER BANNER BOX */}
        <View style={styles.reminderTrackBanner}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#289254" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.trackBannerTitleText}>Stay on track!</Text>
            <Text style={styles.trackBannerSubtitleText}>
              We will remind you at {routineTime} every day.
            </Text>
          </View>
          <Ionicons name="notifications" size={24} color="#C3E6CB" />
        </View>

        {/* MOTIVATIONAL BOTTOM TEXT */}
        <View style={styles.footerMotivationWrapper}>
          <Text style={styles.motivationTextMain}>You're all set! We've got you covered.</Text>
          <View style={styles.heartRow}>
            <Text style={styles.motivationTextSub}>Take care and stay healthy! </Text>
            <Ionicons name="heart" size={16} color="#289254" />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  successIconWrapper: { alignItems: "center", marginTop: 40, marginBottom: 24 },
  outerSuccessCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EDF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  innerSuccessCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#289254",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#289254",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  successMainTitle: { fontSize: 22, fontWeight: "700", color: "#1A2E40", textAlign: "center" },
  successMainSubtitle: { fontSize: 22, fontWeight: "700", color: "#1A2E40", textAlign: "center", marginTop: 2 },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0F4F8",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    elevation: 2,
    shadowColor: "#1A2E40",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },
  iconCircleLeft: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#EDF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowMiddleText: { flex: 1 },
  rowLabelTitle: { fontSize: 11, color: "#9EA9B7", fontWeight: "600" },
  rowValueText: { fontSize: 14, fontWeight: "700", color: "#1A2E40", marginTop: 1 },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF7ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactBadgeText: { color: "#289254", fontSize: 11, fontWeight: "600" },
  reminderTrackBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4FAF6",
    borderWidth: 1,
    borderColor: "#C3E6CB",
    borderRadius: 14,
    padding: 14,
    width: "100%",
    marginTop: 24,
  },
  trackBannerTitleText: { fontSize: 13, fontWeight: "700", color: "#289254" },
  trackBannerSubtitleText: { fontSize: 11, color: "#4A5568", marginTop: 2 },
  footerMotivationWrapper: { marginTop: 32, alignItems: "center" },
  motivationTextMain: { fontSize: 14, fontWeight: "600", color: "#289254", textAlign: "center" },
  heartRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
  motivationTextSub: { fontSize: 14, fontWeight: "600", color: "#289254" },
});