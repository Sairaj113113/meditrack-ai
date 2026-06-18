import React, { useState, useCallback } from 'react';

// --- DUAL-ENVIRONMENT COMPATIBILITY WRAPPER ---
// Uses static string literal requires so Metro Bundler can statically analyze and pack them
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

const safeRequireSvg = () => {
  try {
    return require('react-native-svg');
  } catch (e) {
    return null;
  }
};

const RN = safeRequireRN();
const ExpoIcons = safeRequireIcons();
const ReactNavigation = safeRequireNavigation();
const RNSvg = safeRequireSvg();

// Local project relative mock stores (to prevent compile failures if references are empty in web preview)
let useAuthStore: any = () => ({ user: { firstName: 'Alex' } });
let getDashboard: any = async () => ({
  todayAdherencePercentage: 75,
  takenCount: 3,
  pendingCount: 1,
  missedCount: 0,
  currentStreak: 5,
  totalMedicines: 4,
  todayMedicines: [
    { medicineName: 'Metformin 500mg', scheduledTime: '08:00 AM', status: 'TAKEN' },
    { medicineName: 'Vitamin D3 60K', scheduledTime: '09:00 AM', status: 'TAKEN' },
    { medicineName: 'Amlodipine 5mg', scheduledTime: '08:00 PM', status: 'PENDING' },
    { medicineName: 'Atorvastatin 10mg', scheduledTime: '10:00 PM', status: 'PENDING' }
  ]
});

try {
  const authStore = require('../../store/authStore');
  if (authStore && authStore.useAuthStore) useAuthStore = authStore.useAuthStore;
} catch (e) {}

try {
  const dashService = require('../../services/dashboardService');
  if (dashService && dashService.getDashboard) getDashboard = dashService.getDashboard;
} catch (e) {}

const isWeb = !RN;

// Mock Fallbacks for Web Preview environment compilation
let View: any = 'div';
let Text: any = 'span';
let ScrollView: any = 'div';
let TouchableOpacity: any = 'button';
let RefreshControl: any = 'div';
let Dimensions: any = { get: () => ({ width: 375, height: 812 }) };
let Modal: any = 'div';
let Ionicons: any = () => null;
let Svg: any = 'svg';
let Circle: any = 'circle';
let StyleSheet: any = { create: (styles: any) => styles };

// Generic-safe hooks supporting local VSCode/Windsurf IDE compilers
let useNavigation: <T = any>() => T = () => ({ navigate: () => {} } as any);
let useFocusEffect: any = (cb: any) => React.useEffect(cb, []);

if (!isWeb) {
  View = RN.View;
  Text = RN.Text;
  ScrollView = RN.ScrollView;
  TouchableOpacity = RN.TouchableOpacity;
  RefreshControl = RN.RefreshControl;
  Dimensions = RN.Dimensions;
  Modal = RN.Modal;
  Ionicons = ExpoIcons.Ionicons;
  useNavigation = ReactNavigation.useNavigation;
  useFocusEffect = ReactNavigation.useFocusEffect;
  Svg = RNSvg.Svg;
  Circle = RNSvg.Circle;
  StyleSheet = RN.StyleSheet;
}

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
  const [showMedicineSheet, setShowMedicineSheet] = useState(false);

  // --- RE-FETCH DATA ON FOCUS & REFRESH ---
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

  // Triggers refresh automatically every single time the user focuses on Dashboard tab
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const adherencePercent = dashboard?.todayAdherencePercentage || 0;
  const strokeDashoffset = CIRCUMFERENCE - (adherencePercent / 100) * CIRCUMFERENCE;
  const firstName = user?.firstName || 'User';

  // --- RENDERS THE INTERACTIVE WEB PREVIEW FRAME ---
  if (isWeb) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4 font-sans">
        {/* Simulated Phone Frame */}
        <div className="w-full max-w-[390px] h-[844px] bg-[#F5F9FF] rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-slate-800 flex flex-col">
          {/* Simulated Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex justify-center items-center z-50">
            <div className="w-32 h-4 bg-black rounded-b-xl" />
          </div>

          {/* Top Bar Header */}
          <div className="bg-white border-b border-slate-100 px-4 pt-10 pb-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-[#229c55] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0B1F3A]">{getGreeting()}, {firstName} 👋</h3>
                <p className="text-[11px] text-slate-400 font-medium">Take care and stay healthy!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-1 text-slate-600">
                <span className="text-xl">⚙️</span>
              </button>
              <button className="relative p-1 text-slate-600">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>

          {/* Scrollable View Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
            {/* Progress Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-slate-800 text-sm">Today's Progress</h4>
                <span className="text-xs font-semibold text-emerald-600 cursor-pointer hover:underline">View Details →</span>
              </div>

              <div className="flex items-center space-x-6">
                {/* Circular Svg Representation */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="50" stroke="#F1F5F9" strokeWidth="10" fill="transparent" />
                    <circle cx="64" cy="64" r="50" stroke="#289254" strokeWidth="10" fill="transparent" strokeDasharray="314.16" strokeDashoffset={314.16 - (adherencePercent / 100) * 314.16} strokeLinecap="round" />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-2xl font-black text-slate-800">{Math.round(adherencePercent)}%</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</p>
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" /> Taken</span>
                    <span className="text-slate-800">{dashboard?.takenCount || 3}</span>
                  </div>
                  <div className="h-px bg-slate-50" />
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 mr-2" /> Pending</span>
                    <span className="text-slate-800">{dashboard?.pendingCount || 1}</span>
                  </div>
                  <div className="h-px bg-slate-50" />
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-400 mr-2" /> Missed</span>
                    <span className="text-slate-800">{dashboard?.missedCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Grid row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
                <span className="text-2xl">🔥</span>
                <div>
                  <h5 className="text-[12px] font-bold text-slate-800">{dashboard?.currentStreak || 5} Day Streak</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Keep it up!</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg">💊</div>
                <div>
                  <h5 className="text-[12px] font-bold text-slate-800">{dashboard?.totalMedicines || 4} Medicines</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Today</p>
                </div>
              </div>
            </div>

            {/* Medication Calendar Strip */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#289254] text-lg">📅</div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Medication Calendar</h5>
                  <p className="text-[11px] text-slate-400 font-medium">View your monthly progress</p>
                </div>
              </div>
              <span className="text-[#289254] font-bold text-lg">❯</span>
            </div>

            {/* Today's Schedule Card list */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-extrabold text-slate-800 text-sm mb-2">Today's Medicines</h4>
              {dashboard?.todayMedicines ? (
                dashboard.todayMedicines.map((med: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-600 text-lg">💊</span>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{med.medicineName}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold">{med.scheduledTime}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                      med.status === 'TAKEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No medication schedule logged yet.</p>
              )}
            </div>
          </div>

          {/* Sticky FAB */}
          <button 
            className="absolute bottom-6 inset-x-6 h-14 bg-[#289254] hover:bg-[#207a41] rounded-2xl text-white font-extrabold flex items-center justify-center space-x-2 shadow-lg transition-all"
            onClick={() => setShowMedicineSheet(true)}
          >
            <span>＋</span>
            <span>Add Medicine</span>
          </button>

          {/* Simulated Sheet Overlay Modal */}
          {showMedicineSheet && (
            <div className="absolute inset-0 bg-black/45 z-50 flex flex-col justify-end">
              <div className="bg-white rounded-t-[30px] p-6 space-y-4 shadow-2xl relative">
                <button className="absolute top-4 right-4 text-slate-400 text-sm font-bold" onClick={() => setShowMedicineSheet(false)}>✕</button>
                <h4 className="text-lg font-black text-[#0B1F3A] text-center mb-2">How do you want to add medicines?</h4>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3 border border-slate-100 hover:bg-slate-100 cursor-pointer" onClick={() => setShowMedicineSheet(false)}>
                  <span className="text-2xl">💊</span>
                  <div className="flex-1 text-left">
                    <h5 className="text-sm font-bold text-[#0B1F3A]">Quick Medicine</h5>
                    <p className="text-[10px] text-slate-400">Add single medicine with schedule</p>
                  </div>
                  <span className="text-slate-400 font-bold">❯</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-3 border border-slate-100 hover:bg-slate-100 cursor-pointer" onClick={() => setShowMedicineSheet(false)}>
                  <span className="text-2xl">📚</span>
                  <div className="flex-1 text-left">
                    <h5 className="text-sm font-bold text-[#0B1F3A]">Medicine Routine</h5>
                    <p className="text-[10px] text-slate-400">Add multiple medicines in a routine</p>
                  </div>
                  <span className="text-slate-400 font-bold">❯</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- NATIVE MOBILE SCREEN RENDER ---
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
            <TouchableOpacity onPress={() => navigation.navigate('MedicationCalendar')}>
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

        {/* Today's Medicines list */}
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
        onPress={() => setShowMedicineSheet(true)}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.fabTxt}>Add Medicine</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Picker Modal */}
      <Modal
        visible={showMedicineSheet}
        transparent
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setShowMedicineSheet(false)}
        >
          <View style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>
              How do you want to add medicines?
            </Text>

            <TouchableOpacity
              style={styles.sheetCard}
              onPress={() => {
                setShowMedicineSheet(false);
                navigation.navigate('AddQuickMedicine');
              }}
            >
              <Ionicons
                name="medkit"
                size={30}
                color="#289254"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetCardTitle}>
                  Quick Medicine
                </Text>
                <Text style={styles.sheetCardSub}>
                  Add single medicine with schedule
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCard}
              onPress={() => {
                setShowMedicineSheet(false);
                navigation.navigate('CreateMedicineRoutine');
              }}
            >
              <Ionicons
                name="layers"
                size={30}
                color="#7C3AED"
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.sheetCardTitle}>
                  Medicine Routine
                </Text>
                <Text style={styles.sheetCardSub}>
                  Add multiple medicines in a routine
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Plain Object StyleSheet for guaranteed compilation and TS compatibility
const styles: any = {
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

  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheetContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0B1F3A',
  },

  sheetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  sheetCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  sheetCardSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
};