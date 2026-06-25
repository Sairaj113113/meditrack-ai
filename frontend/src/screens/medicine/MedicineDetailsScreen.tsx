import React, { useEffect, useState } from 'react';

// Safe require pattern for React Native components
const safeRequireRN = () => {
  try {
    return require('react-native');
  } catch (e) {
    return null;
  }
};

const safeRequireIcons = () => {
  try {
    return require('@expo/vector-icons');
  } catch (e) {
    return null;
  }
};

const safeRequireNavigation = () => {
  try {
    return require('@react-navigation/native');
  } catch (e) {
    return null;
  }
};

const RN = safeRequireRN();
const ExpoIcons = safeRequireIcons();
const ReactNavigation = safeRequireNavigation();

// Fallback to web equivalents if React Native is not available
let View: any = 'div';
let Text: any = 'span';
let ScrollView: any = 'div';
let StyleSheet: any = { create: (s: any) => s };
let ActivityIndicator: any = ({ size, color }: any) => {
  if (typeof window !== 'undefined') {
    return `Loading...`;
  }
  return null;
};
let TouchableOpacity: any = 'button';
let Alert: any = { alert: (title: string, msg: string, btns: any[]) => { if (typeof window !== 'undefined' && window.confirm(msg)) btns[0]?.onPress?.(); } };
let Ionicons: any = () => null;
let useNavigation: <T = any>() => T = () => ({ goBack: () => {}, navigate: () => {} } as any);
let useRoute: <T = any>() => T = () => ({ params: {} } as any);

if (RN) {
  View = RN.View;
  Text = RN.Text;
  ScrollView = RN.ScrollView;
  StyleSheet = RN.StyleSheet;
  ActivityIndicator = RN.ActivityIndicator;
  TouchableOpacity = RN.TouchableOpacity;
  Alert = RN.Alert;
}

if (ExpoIcons) {
  Ionicons = ExpoIcons.Ionicons;
}

if (ReactNavigation) {
  useNavigation = ReactNavigation.useNavigation;
  useRoute = ReactNavigation.useRoute;
}

const isWeb = !RN;
const GREEN = '#289254';

// Fallback API client for web/preview
let apiClient: any = {
  get: async (url: string) => ({
    data: { data: { id: '1', medicineName: 'Sample Medicine', medicineType: 'TABLET', frequencyType: 'DAILY', startDate: '2026-01-01', endDate: '2026-12-31', notes: 'Take with food' } }
  })
};

try {
  const client = require('../../services/apiClient');
  if (client && client.default) apiClient = client.default;
  else if (client) apiClient = client;
} catch (e) {}

export default function MedicineDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const medicineId = route?.params?.medicineId || '1';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    id: medicineId,
    medicineName: 'Loading...',
    medicineType: '-',
    frequencyType: '-',
    dosage: '-',
    startDate: '-',
    endDate: '-',
    notes: '-'
  });
  const [schedules, setSchedules] = useState<any[]>([]);
const fetchData = async () => {
  setLoading(true);

  try {
    console.log("Medicine ID =", medicineId);

    const medRes = await apiClient.get(`/medicines/${medicineId}`);

 

    const medData = medRes?.data?.data || {};

    setData({
      id: medicineId,
      medicineName: medData.medicineName || "Medicine",
      medicineType: medData.medicineType || "TABLET",
      frequencyType: medData.frequencyType || "DAILY",
      dosage: medData.dosage || "-",
      startDate: medData.startDate || "-",
      endDate: medData.endDate || "-",
      notes: medData.notes || "No notes",
      ...medData,
    });

    setSchedules(
      Array.isArray(medData.schedules)
        ? medData.schedules
        : []
    );

    console.log("SCHEDULES =", medData.schedules);

  } catch (error: any) {
    console.log("STATUS =", error?.response?.status);
    console.log("DATA =", JSON.stringify(error?.response?.data, null, 2));
    console.log("URL =", error?.config?.url);

    setData({
      id: medicineId,
      medicineName: "Medicine Details",
      medicineType: "TABLET",
      frequencyType: "DAILY",
      dosage: "-",
      startDate: "-",
      endDate: "-",
      notes: "Unable to load details. Please try again.",
    });

    setSchedules([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [medicineId]);

  if (loading) {
    return (
      <View style={styles.center}>
        {isWeb ? (
          <Text>Loading...</Text>
        ) : (
          <ActivityIndicator size="large" color={GREEN} />
        )}
      </View>
    );
  }

  // Helper to ensure values are strings and never undefined/null
  const formatVal = (val: any) => (val !== undefined && val !== null ? String(val) : '-');

  const formatTime = (time: string) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":");
  const date = new Date();

  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  const renderDetailRow = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {!isWeb && <Ionicons name="arrow-back" size={24} color="#0B1F3A" />}
          {isWeb && <Text style={{ color: '#0B1F3A' }}>←</Text>}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medicine Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              {!isWeb && <Ionicons name="medical" size={24} color={GREEN} />}
              {isWeb && <Text style={{ color: GREEN, fontSize: 24 }}>💊</Text>}
            </View>
            <View>
              <Text style={styles.medName}>{formatVal(data?.medicineName)}</Text>
              <Text style={styles.subText}>
                {formatVal(data?.medicineType)} • {formatVal(data?.frequencyType)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

         {renderDetailRow('Medicine Name', formatVal(data?.medicineName))}
{renderDetailRow('Medicine Type', formatVal(data?.medicineType))}
{renderDetailRow('Dosage', formatVal(data?.dosage))}
{renderDetailRow('Frequency', formatVal(data?.frequencyType))}

{renderDetailRow(
  "Time",
  schedules.length > 0
    ? schedules
        .map((s: any) => formatTime(s.scheduleTime))
        .join(", ")
    : "No schedule"
)}

{renderDetailRow('Start Date', formatVal(data?.startDate))}
{renderDetailRow('End Date', formatVal(data?.endDate))}
{renderDetailRow('Reminder', schedules.length > 0 ? 'ON' : 'OFF')}
{renderDetailRow('Notes', formatVal(data?.notes))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 54, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#EDF2F7'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0B1F3A' },
  backButton: { padding: 4 },
  scrollContent: { padding: 20 },
  card: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  iconBox: { width: 56, height: 56, borderRadius: 20, backgroundColor: '#E8F5EE', justifyContent: 'center', alignItems: 'center' },
  medName: { fontSize: 20, fontWeight: '800', color: '#0B1F3A' },
  subText: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, alignItems: 'flex-start' },
  label: { fontSize: 14, color: '#9CA3AF', fontWeight: '500', width: '35%' },
  value: { fontSize: 14, color: '#0B1F3A', fontWeight: '600', textAlign: 'right', flex: 1 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-end', flex: 1 },
  pill: { backgroundColor: '#E8F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { fontSize: 12, color: GREEN, fontWeight: '700' },
  notesBox: { marginTop: 8 },
  notesValue: { fontSize: 14, color: '#374151', marginTop: 6, lineHeight: 20, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12 }
});