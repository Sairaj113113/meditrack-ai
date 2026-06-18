import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// --- Types ---
interface MedicineParams {
  medicineName: string;
  medicineType: string;
  reminderTime: string;
  frequencyType: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  intakeInstruction?: string;
}

type RootStackParamList = {
  MedicineAddedSuccess: MedicineParams;
  MainTabs: { screen: string };
};

type SuccessScreenRouteProp = RouteProp<RootStackParamList, "MedicineAddedSuccess">;

// --- Theme Colors ---
const COLORS = {
  primaryGreen: "#289254",
  lightGreen: "#E8FAF0",
  background: "#F8FAFC",
  cardBackground: "#FFFFFF",
  darkText: "#0B1F3A",
  secondaryText: "#6B7280",
  borderColor: "#E5E7EB",
};

const { width } = Dimensions.get("window");

export default function MedicineAddedSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<SuccessScreenRouteProp>();
  
  // Destructure route params with fallbacks
  const {
    medicineName = "Medicine",
    medicineType = "Tablet",
    reminderTime = "08:00 AM",
    frequencyType = "Daily",
    startDate = "Today",
    endDate,
    notes,
    intakeInstruction,
  } = route.params || {};

  // --- Animation Drivers ---
  const scaleAnim = useRef(new Animated.Value(0)).current;     // Success Circle
  const opacityAnim = useRef(new Animated.Value(0)).current;   // Checkmark
  const slideAnim = useRef(new Animated.Value(40)).current;    // Card sliding up
  const contentOpacity = useRef(new Animated.Value(0)).current; // Card/Text fade-in

  useEffect(() => {
    // 1. Run Entry Animations
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 500,
          delay: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Automatic Redirect Timer (2 seconds)
    const timer = setTimeout(() => {
      navigation.navigate("MainTabs", {
        screen: "Dashboard",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim, slideAnim, contentOpacity]);

  // Helper to determine medicine type icon
  const getMedicineIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("capsule") || lowerType.includes("pill")) return "medkit-outline";
    if (lowerType.includes("liquid") || lowerType.includes("syrup")) return "water-outline";
    if (lowerType.includes("injection") || lowerType.includes("shot")) return "medical-outline";
    return "medkit-outline"; // Default medicine icon
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* TOP SUCCESS AREA */}
        <View style={styles.successHeaderContainer}>
          {/* Animated Glow Effect & Success Circle */}
          <Animated.View style={[styles.glowRing, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.successCircle}>
              <Animated.View style={{ opacity: opacityAnim }}>
                <Ionicons name="checkmark" size={44} color="#FFFFFF" />
              </Animated.View>
            </View>
            {/* Sparkle Decoration - Top Right */}
            <Ionicons name="sparkles" size={20} color={COLORS.primaryGreen} style={styles.sparkleTR} />
            {/* Sparkle Decoration - Bottom Left */}
            <Ionicons name="sparkles" size={16} color={COLORS.primaryGreen} style={styles.sparkleBL} />
          </Animated.View>

          <Animated.Text style={[styles.successTitle, { opacity: contentOpacity }]}>
            Medicine Added Successfully!
          </Animated.Text>
        </View>

        {/* MEDICINE SUMMARY CARD */}
        <Animated.View 
          style={[
            styles.card, 
            { 
              opacity: contentOpacity,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.medIconContainer}>
              <Ionicons name={getMedicineIcon(medicineType)} size={26} color={COLORS.primaryGreen} />
            </View>
            <View style={styles.medTitleContainer}>
              <Text style={styles.medNameText} numberOfLines={1}>{medicineName}</Text>
              <Text style={styles.medTypeText}>{medicineType}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Row 1: Time & Frequency Badge */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="time-outline" size={20} color={COLORS.secondaryText} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>Time</Text>
                <Text style={styles.rowValue}>{reminderTime}</Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{frequencyType}</Text>
            </View>
          </View>

          {/* Row 2: Duration */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.secondaryText} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>Duration</Text>
                <Text style={styles.rowValue}>
                  {endDate ? `${startDate} → ${endDate}` : "Ongoing"}
                </Text>
              </View>
            </View>
          </View>

          {/* Row 3: Intake Instructions */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="restaurant-outline" size={20} color={COLORS.secondaryText} style={styles.rowIcon} />
              <View>
                <Text style={styles.rowLabel}>Instruction</Text>
                <Text style={styles.rowValue}>{intakeInstruction || "Anytime"}</Text>
              </View>
            </View>
          </View>

          {/* Row 4: Notes */}
          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="document-text-outline" size={20} color={COLORS.secondaryText} style={styles.rowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Notes</Text>
                <Text style={styles.rowValue} numberOfLines={2}>
                  {notes || "No notes provided"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* MOTIVATION CARD */}
        <Animated.View 
          style={[
            styles.motivationCard, 
            { 
              opacity: contentOpacity,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.shieldIconContainer}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.primaryGreen} />
          </View>
          <View style={styles.motivationTextContainer}>
            <Text style={styles.motivationTitle}>Stay on track!</Text>
            <Text style={styles.motivationSubtitle}>We'll remind you at your scheduled time.</Text>
          </View>
        </Animated.View>

        {/* BOTTOM MESSAGE */}
        <Animated.View style={[styles.bottomMessageContainer, { opacity: contentOpacity }]}>
          <Text style={styles.bottomMessageTitle}>You're all set!</Text>
          <Text style={styles.bottomMessageSubtitle}>We've got you covered.</Text>
          <Text style={styles.bottomMessageGreeting}>Take care and stay healthy! 💚</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  successHeaderContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 10,
  },
  glowRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(40, 146, 84, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryGreen,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primaryGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sparkleTR: {
    position: "absolute",
    top: 6,
    right: 4,
  },
  sparkleBL: {
    position: "absolute",
    bottom: 12,
    left: 2,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.darkText,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  medIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  medTitleContainer: {
    flex: 1,
  },
  medNameText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.darkText,
    marginBottom: 2,
  },
  medTypeText: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.5)",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 14,
    width: 20,
    textAlign: "center",
  },
  rowLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 1,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.darkText,
  },
  badge: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "center",
  },
  badgeText: {
    color: COLORS.primaryGreen,
    fontSize: 12,
    fontWeight: "600",
  },
  motivationCard: {
    width: "100%",
    backgroundColor: COLORS.lightGreen,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  shieldIconContainer: {
    marginRight: 12,
  },
  motivationTextContainer: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primaryGreen,
    marginBottom: 2,
  },
  motivationSubtitle: {
    fontSize: 13,
    color: "#475569",
  },
  bottomMessageContainer: {
    alignItems: "center",
    marginTop: "auto",
  },
  bottomMessageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryGreen,
    marginBottom: 2,
  },
  bottomMessageSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 8,
  },
  bottomMessageGreeting: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primaryGreen,
  },
});