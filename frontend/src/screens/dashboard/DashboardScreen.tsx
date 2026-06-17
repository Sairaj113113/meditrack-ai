import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { getDashboard } from '../../services/dashboardService';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 14;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.log('Dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const adherencePercent = dashboard?.todayAdherencePercentage || 0;
  const strokeDashoffset = CIRCUMFERENCE - (adherencePercent / 100) * CIRCUMFERENCE;
  const firstName = user?.firstName || 'User';

  

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
  style={styles.avatar}
  onPress={() => navigation.navigate('Profile')}
>
  <Text style={styles.avatarText}>
    {firstName.charAt(0).toUpperCase()}
  </Text>
</TouchableOpacity>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {firstName} 👋
            </Text>
            <Text style={styles.subGreeting}>Take care and stay healthy!</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#374151" />
            <Text style={styles.iconLabel}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View>
              <Ionicons name="notifications-outline" size={22} color="#374151" />
              <View style={styles.badge} />
            </View>
            <Text style={styles.iconLabel}>Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sosBtn}>
            <Text style={styles.sosTxt}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00C853" />
        }
      >

        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Progress</Text>
            <TouchableOpacity>
              <Text style={styles.viewDetails}>View Details →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.circleWrap}>
              <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  stroke="#E5E7EB"
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  stroke="#00C853"
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
                />
              </Svg>
              <View style={styles.circleCenter}>
                <Text style={styles.percentTxt}>{Math.round(adherencePercent)}%</Text>
                <Text style={styles.completedTxt}>Completed</Text>
              </View>
            </View>

            <View style={styles.statsCol}>
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: '#00C853' }]} />
                <Text style={styles.statLbl}>Taken</Text>
                <Text style={styles.statVal}>{dashboard?.takenCount || 0}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: '#FF9800' }]} />
                <Text style={styles.statLbl}>Pending</Text>
                <Text style={styles.statVal}>{dashboard?.pendingCount || 0}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <View style={[styles.statDot, { backgroundColor: '#F44336' }]} />
                <Text style={styles.statLbl}>Missed</Text>
                <Text style={styles.statVal}>{dashboard?.missedCount || 0}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Streak + Medicines */}
        <View style={styles.rowCards}>
          <View style={styles.miniCard}>
            <Text style={styles.miniIcon}>🔥</Text>
            <View>
              <Text style={styles.miniVal}>
                {dashboard?.currentStreak || 0} Day Streak
              </Text>
              <Text style={styles.miniSub}>Keep it up!</Text>
            </View>
          </View>

          <View style={styles.miniCard}>
            <View style={styles.miniIconBox}>
              <Ionicons name="medkit" size={20} color="#00C853" />
            </View>
            <View>
              <Text style={styles.miniVal}>
                {dashboard?.totalMedicines || 0} Medicines
              </Text>
              <Text style={styles.miniSub}>Today</Text>
            </View>
          </View>
        </View>

        {/* Medication Calendar Button */}
        <TouchableOpacity
          style={styles.calendarBtn}
          onPress={() => navigation.navigate('MedicationCalendar')}
        >
          <View style={styles.calendarBtnLeft}>
            <View style={styles.calendarIconBox}>
              <Ionicons name="calendar" size={22} color="#289254" />
            </View>
            <View>
              <Text style={styles.calendarBtnTitle}>Medication Calendar</Text>
              <Text style={styles.calendarBtnSub}>View your monthly progress</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#00C853" />
        </TouchableOpacity>

        {/* Today's Medicines */}
        {dashboard?.todayMedicines?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Medicines</Text>
            {dashboard.todayMedicines.map((med: any, index: number) => (
              <View key={index} style={styles.medRow}>
                <View style={styles.medIconBox}>
                  <Ionicons name="medical" size={16} color="#289254" />
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.medicineName}</Text>
                  <Text style={styles.medTime}>{med.scheduledTime}</Text>
                </View>
                <View style={[
                  styles.medStatus,
                  med.status === 'TAKEN' && { backgroundColor: '#E8FAF0' },
                  med.status === 'PENDING' && { backgroundColor: '#FFF3E0' },
                  med.status === 'MISSED' && { backgroundColor: '#FFEBEE' },
                ]}>
                  <Text style={[
                    styles.medStatusTxt,
                    med.status === 'TAKEN' && { color: '#00C853' },
                    med.status === 'PENDING' && { color: '#FF9800' },
                    med.status === 'MISSED' && { color: '#F44336' },
                  ]}>
                    {med.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add Medicine FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMedicine')}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.fabTxt}>Add Medicine</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#6B7280' },
  scroll: { paddingTop: 8, paddingBottom: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#229c55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  greeting: { fontSize: 14, fontWeight: '700', color: '#0B1F3A' },
  subGreeting: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn: { alignItems: 'center', gap: 2 },
  iconLabel: { fontSize: 10, color: '#6B7280' },
  badge: {
    position: 'absolute', top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#F44336',
  },
  sosBtn: {
    backgroundColor: '#F44336',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8,
  },
  sosTxt: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0B1F3A' },
  viewDetails: { fontSize: 12, color: '#00C853', fontWeight: '600' },

  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  circleWrap: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentTxt: { fontSize: 24, fontWeight: '800', color: '#0B1F3A' },
  completedTxt: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  statsCol: { flex: 1, gap: 4 },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statLbl: { flex: 1, fontSize: 14, color: '#374151', fontWeight: '500' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#0B1F3A' },
  divider: { height: 0.5, backgroundColor: '#F3F4F6' },

  rowCards: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  miniIcon: { fontSize: 28 },
  miniIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8FAF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniVal: { fontSize: 13, fontWeight: '700', color: '#0B1F3A' },
  miniSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  calendarBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  calendarBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8FAF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarBtnTitle: { fontSize: 15, fontWeight: '700', color: '#0B1F3A' },
  calendarBtnSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  medIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8FAF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 14, fontWeight: '600', color: '#0B1F3A' },
  medTime: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  medStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  medStatusTxt: { fontSize: 11, fontWeight: '700' },

  fab: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
    backgroundColor: '#289254',
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  fabTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});