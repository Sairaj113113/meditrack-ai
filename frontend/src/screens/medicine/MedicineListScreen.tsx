import React, { useEffect, useState, useCallback } from 'react';

// --- DUAL-ENVIRONMENT COMPATIBILITY WRAPPER ---
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

// Fallback api client config (to prevent runtime compile crashes on local systems)
let apiClient: any = {
  get: async (url: string) => {
    // Standard mock database structure aligning with spec
    if (url.includes('/reminders/today')) {
      return {
        data: {
          success: true,
          message: "Success",
          data: [
            {
              sessionId: "session_id_1",
              sessionTime: "08:54 AM",
              status: "PENDING",
              medicineCount: 2,
              medicines: [
                { userMedicineId: "med_1", medicineName: "Metformin 500mg", status: "PENDING" },
                { userMedicineId: "med_2", medicineName: "Vitamin D3 60K", status: "PENDING" }
              ]
            },
            {
              sessionId: "session_id_2",
              sessionTime: "12:00 PM",
              status: "PENDING",
              medicineCount: 1,
              medicines: [
                { userMedicineId: "med_3", medicineName: "Amlodipine 5mg", status: "PENDING" }
              ]
            },
            {
              sessionId: "session_id_3",
              sessionTime: "09:30 PM",
              status: "PENDING",
              medicineCount: 1,
              medicines: [
                { userMedicineId: "med_4", medicineName: "Atorvastatin 10mg", status: "PENDING" }
              ]
            }
          ]
        }
      };
    }
    // Management catalogs fallbacks
    return {
      data: {
        success: true,
        message: "Success",
        data: [
          { id: "med_1", medicineName: "Metformin 500mg", medicineCategory: "ROUTINE", medicineType: "TABLET", intakeInstruction: "AFTER_FOOD", period: "MORNING" },
          { id: "med_2", medicineName: "Vitamin D3 60K", medicineCategory: "ROUTINE", medicineType: "CAPSULE", intakeInstruction: "AFTER_FOOD", period: "MORNING" },
          { id: "med_3", medicineName: "Amlodipine 5mg", medicineCategory: "ROUTINE", medicineType: "TABLET", intakeInstruction: "AFTER_DINNER", period: "EVENING" },
          { id: "med_4", medicineName: "Atorvastatin 10mg", medicineCategory: "ROUTINE", medicineType: "TABLET", intakeInstruction: "BEFORE_SLEEP", period: "NIGHT" },
          { id: "med_q1", medicineName: "Paracetamol 500mg", medicineCategory: "QUICK", medicineType: "TABLET", intakeInstruction: "ANYTIME" },
          { id: "med_q2", medicineName: "Ibuprofen 400mg", medicineCategory: "QUICK", medicineType: "TABLET", intakeInstruction: "AFTER_FOOD" },
          { id: "med_q3", medicineName: "Cetirizine 10mg", medicineCategory: "QUICK", medicineType: "TABLET", intakeInstruction: "ANYTIME" }
        ]
      }
    };
  },
  post: async () => ({ success: true })
};

try {
  const client = require('../../services/apiClient');
  if (client && client.default) apiClient = client.default;
  else if (client) apiClient = client;
} catch (e) {}

const isWeb = !RN;

// Mock Fallbacks for Web Preview environment compilation
let View: any = 'div';
let Text: any = 'span';
let ScrollView: any = 'div';
let TouchableOpacity: any = 'button';
let RefreshControl: any = 'div';
let ActivityIndicator: any = () => null;
let Dimensions: any = { get: () => ({ width: 375, height: 812 }) };
let Ionicons: any = () => null;
let StyleSheet: any = { create: (styles: any) => styles };
let Alert: any = {
  alert: (title: string, message: string, buttons: any[]) => {
    if (typeof window !== 'undefined' && window.confirm(message)) {
      const updateButton = buttons.find(b => b.text === 'Save' || b.text === 'Update');
      if (updateButton && updateButton.onPress) updateButton.onPress();
    }
  }
};

let useNavigation: <T = any>() => T = () => ({ navigate: () => {} } as any);

if (!isWeb) {
  View = RN.View;
  Text = RN.Text;
  ScrollView = RN.ScrollView;
  TouchableOpacity = RN.TouchableOpacity;
  RefreshControl = RN.RefreshControl;
  ActivityIndicator = RN.ActivityIndicator;
  Dimensions = RN.Dimensions;
  Ionicons = ExpoIcons.Ionicons;
  useNavigation = ReactNavigation.useNavigation;
  StyleSheet = RN.StyleSheet;
  Alert = RN.Alert;
}

const GREEN = '#289254';
const { width } = Dimensions.get('window');

const FILTER_TABS = ['All', 'Quick', 'Routine'];
const PERIOD_TABS = ['Morning', 'Evening', 'Night'];

const PERIOD_ICONS: { [key: string]: string } = {
  Morning: 'sunny-outline',
  Evening: 'partly-sunny-outline',
  Night: 'moon-outline',
};

const MEDICINE_COLORS = ['#E8F5EE', '#FEE2E2', '#FEF3C7', '#EEF2FF', '#F0FFF4'];
const MEDICINE_ICON_COLORS = [GREEN, '#EF4444', '#F59E0B', '#6366F1', '#10B981'];

export default function MedicineListScreen() {
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState('All');
  const [activePeriod, setActivePeriod] = useState('Morning');
  
  // Real active schedule reminders & medicines from database
  const [todayReminders, setTodayReminders] = useState<any[]>([]);
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const normalizeTime = (time: string) => {
    const value = (time || '').trim();
    if (!value) return '';

    const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
    if (!match) return value;

    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const meridiem = match[3]?.toUpperCase();

    if (meridiem === 'PM' && hour < 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minute}`;
  };

  const formatDisplayTime = (time: string) => {
    const normalized = normalizeTime(time);
    if (!normalized) return 'Anytime';

    const [hourStr, minute] = normalized.split(':');
    const hour = parseInt(hourStr, 10);
    const isPm = hour >= 12;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minute} ${isPm ? 'PM' : 'AM'}`;
  };

  const getPeriodFromTime = (time: string) => {
    const normalized = normalizeTime(time);
    if (!normalized) return 'Morning';

    const hour = parseInt(normalized.split(':')[0], 10);
    if (hour >= 12 && hour < 18) return 'Evening';
    if (hour >= 18 || hour < 5) return 'Night';
    return 'Morning';
  };

  const isMedicineActiveToday = (medicine: any) => {
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const parseDateValue = (value: any) => {
      if (!value) return null;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    };

    const startDate = parseDateValue(medicine.startDate);
    const endDate = parseDateValue(medicine.endDate);

    if (!startDate || startDate > todayOnly) return false;
    if (endDate && todayOnly > endDate) return false;
    return true;
  };

  const getStatusMaps = () => {
    const statusByIdAndTime = new Map<string, string>();
    const sessionByIdAndTime = new Map<string, string>();
    const statusById = new Map<string, string>();
    const safeReminders = Array.isArray(todayReminders) ? todayReminders : [];

    safeReminders.forEach((session: any) => {
      const sessionTime = normalizeTime(session.sessionTime || '');
      const medicines = Array.isArray(session.medicines) ? session.medicines : [];

      medicines.forEach((med: any) => {
        const status = typeof med.status === 'string' && med.status ? med.status : 'PENDING';
        const key = `${med.userMedicineId}|${sessionTime}`;

        if (sessionTime) {
          statusByIdAndTime.set(key, status);
          sessionByIdAndTime.set(key, session.sessionId);
        }

        if (!statusById.has(med.userMedicineId)) {
          statusById.set(med.userMedicineId, status);
        }
      });
    });

    return { statusByIdAndTime, statusById, sessionByIdAndTime };
  };

  const buildTodayMedicineEntries = () => {
    const safeMedicines = Array.isArray(allMedicines) ? allMedicines : [];
    const { statusByIdAndTime, statusById, sessionByIdAndTime } = getStatusMaps();

    const entries: any[] = [];

    safeMedicines.filter(isMedicineActiveToday).forEach((medicine: any) => {
      const schedules = Array.isArray(medicine.schedules) && medicine.schedules.length > 0
        ? medicine.schedules
        : [{ scheduleTime: '' }];

      schedules.filter((schedule: any) => schedule.isActive !== false).forEach((schedule: any) => {
        const rawTime = normalizeTime(schedule.scheduleTime || '');
        const status = statusByIdAndTime.get(`${medicine.id}|${rawTime}`)
          || statusById.get(medicine.id)
          || 'PENDING';
        const sessionId = sessionByIdAndTime.get(`${medicine.id}|${rawTime}`);

        entries.push({
          medicineId: medicine.id,
          userMedicineId: medicine.id,
          sessionId,
          medicineName: medicine.medicineName,
          medicineType: medicine.medicineType || 'TABLET',
          intakeInstruction: medicine.intakeInstruction || '',
          category: medicine.medicineCategory || 'ROUTINE',
          reminderTime: formatDisplayTime(rawTime),
          rawScheduleTime: rawTime,
          period: getPeriodFromTime(rawTime),
          status,
          frequencyType: medicine.frequencyType,
        });
      });
    });

    return entries.sort((a, b) => {
      if (a.rawScheduleTime === b.rawScheduleTime) return 0;
      if (!a.rawScheduleTime) return -1;
      if (!b.rawScheduleTime) return 1;
      return a.rawScheduleTime.localeCompare(b.rawScheduleTime);
    });
  };

  // FETCH INTEGRATED DATA
  const fetchScreenData = async () => {
    try {
      const catalogResponse = await apiClient.get('/medicines');
      const catalogPayload = catalogResponse?.data;
      const catalogList = catalogPayload?.data !== undefined ? catalogPayload.data : (Array.isArray(catalogPayload) ? catalogPayload : []);
      setAllMedicines(Array.isArray(catalogList) ? catalogList : []);

      const remindersResponse = await apiClient.get('/reminders/today');
      const remindersPayload = remindersResponse?.data;
      const remindersList = remindersPayload?.data !== undefined ? remindersPayload.data : (Array.isArray(remindersPayload) ? remindersPayload : []);
      setTodayReminders(Array.isArray(remindersList) ? remindersList : []);
      console.log("TODAY REMINDERS API", JSON.stringify(remindersList, null, 2));
    } catch (error) {
      console.log('Error fetching screen data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchScreenData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchScreenData();
  }, []);

  // DIALOG CONFIRMATION & API UPDATE POST HANDLER
  const handleMarkDose = async (sessionId: string, medicineId: string, actionStatus: string) => {
    // Optimistic frontend update
    setTodayReminders(prevSessions => {
      const sessions = Array.isArray(prevSessions) ? prevSessions : [];
      return sessions.map(session => {
        if (session.sessionId === sessionId) {
          const medicinesList = Array.isArray(session.medicines) ? session.medicines : [];
          return {
            ...session,
            medicines: medicinesList.map((med: any) =>
              med.userMedicineId === medicineId ? { ...med, status: actionStatus } : med
            )
          };
        }
        return session;
      });
    });

    try {
      await apiClient.post(`/reminders/session/${sessionId}/medicines/${medicineId}/status`, {
        status: actionStatus
      });
    } catch (error) {
      console.log('Failed to log medicine update on backend:', error);
    }
  };

  // ASKS THE USER TO CONFIRM THE STATUS UPDATE
  const confirmAndMarkDose = (sessionId: string | undefined, medicineId: string, medicineName: string, actionStatus: string) => {
    if (!sessionId) {
      Alert.alert(
        'Update Unavailable',
        `This medicine does not yet have an active reminder session for status updates. It will remain pending until the reminder is generated.`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Update Status',
      `Would you like to mark "${medicineName}" as ${actionStatus.toUpperCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          style: 'default',
          onPress: () => handleMarkDose(sessionId, medicineId, actionStatus)
        }
      ]
    );
  };

  const todayMedicineEntries = buildTodayMedicineEntries();
  console.log("MAPPED MEDICINES", JSON.stringify(todayMedicineEntries, null, 2));

  const todayQuickReminders = todayMedicineEntries.filter(m => m.category === 'QUICK');
  console.log("TODAY QUICK", JSON.stringify(todayQuickReminders, null, 2));
  const todayRoutineReminders = todayMedicineEntries.filter(m => m.category === 'ROUTINE');

  // Filtered lists for the catalog list views (Management Tabs)
  const safeMedicines = Array.isArray(allMedicines) ? allMedicines : [];
  const quickCatalog = safeMedicines.filter(m => m.medicineCategory === 'QUICK');
  const routineCatalog = safeMedicines.filter(m => m.medicineCategory === 'ROUTINE');

  const getMedicineColor = (index: number) => MEDICINE_COLORS[index % MEDICINE_COLORS.length];
  const getMedicineIconColor = (index: number) => MEDICINE_ICON_COLORS[index % MEDICINE_ICON_COLORS.length];

  // --- RENDERS THE INTERACTIVE WEB PREVIEW FRAME ---
  if (isWeb) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4 font-sans">
        <div className="w-full max-w-[390px] h-[844px] bg-[#F5F9FF] rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-slate-800 flex flex-col">
          {/* Simulated Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 flex justify-center items-center z-50">
            <div className="w-32 h-4 bg-black rounded-b-xl" />
          </div>

          {/* Header */}
          <div className="bg-white px-4 pt-10 pb-3 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-[#0B1F3A]">Medicines</h2>
            <button className="text-slate-600 text-xl">🔔</button>
          </div>

          {/* Filter Bar Row */}
          <div className="bg-white px-4 pb-3 flex space-x-2 border-b border-slate-100">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeFilter === tab ? 'bg-[#289254] text-white' : 'bg-slate-100 text-slate-500'
                }`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Main List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            
            {/* ALL TAB (TODAY'S ACTIVE SCHEDULE) */}
            {activeFilter === 'All' && (
              <div className="space-y-4">
                
                {/* 1. Quick Medicines Section */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center text-sm font-extrabold text-[#0B1F3A]"><span className="mr-2">⚡</span>Quick Medicines</span>
                    <div className="flex space-x-3 text-[10px] font-bold text-slate-400">
                      <span className="text-[#289254]">✓ Taken</span>
                      <span className="text-red-500">✗ Missed</span>
                      <span>⊖ Skip</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {todayQuickReminders.length > 0 ? (
                      todayQuickReminders.map((med, index) => (
                        <div key={`${med.medicineId}-${med.rawScheduleTime}`} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#289254] text-lg">💊</div>
                            <div>
                              <h4 className="text-xs font-bold text-[#0B1F3A]">{med.medicineName}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{med.medicineType}</p>
                            </div>
                          </div>
                          {/* Instant Action buttons with Confirm prompts */}
                          <div className="flex space-x-2">
                            <button onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'TAKEN')} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${med.status === 'TAKEN' ? 'bg-emerald-500 text-white' : 'bg-slate-100 border border-slate-200 text-slate-500'}`}>✓</button>
                            <button onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'MISSED')} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${med.status === 'MISSED' ? 'bg-red-500 text-white' : 'bg-slate-100 border border-slate-200 text-slate-500'}`}>✗</button>
                            <button onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'SKIPPED')} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${med.status === 'SKIPPED' ? 'bg-slate-400 text-white' : 'bg-slate-100 border border-slate-200 text-slate-500'}`}>⊖</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">No quick medicines scheduled for today.</p>
                    )}
                  </div>
                </div>

                {/* 2. Routine Medicines Section */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg">📅</span>
                    <span className="text-sm font-extrabold text-[#0B1F3A]">Routine Medicines</span>
                  </div>

                  {/* Period selection */}
                  <div className="flex space-x-2 mb-4">
                    {PERIOD_TABS.map(period => (
                      <button
                        key={period}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 border ${
                          activePeriod === period ? 'bg-emerald-50 border-[#289254] text-[#289254]' : 'bg-slate-50 border-transparent text-slate-400'
                        }`}
                        onClick={() => setActivePeriod(period)}
                      >
                        <span>{period === 'Morning' ? '☀️' : period === 'Evening' ? '⛅' : '🌙'}</span>
                        <span>{period}</span>
                      </button>
                    ))}
                  </div>

                  {/* Matrix Check Header */}
                  <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-2 mb-2">
                    <span className="col-span-6">Medicine</span>
                    <span className="col-span-2 text-center text-emerald-600">Taken</span>
                    <span className="col-span-2 text-center text-red-500">Missed</span>
                    <span className="col-span-2 text-center">Skip</span>
                  </div>

                  <div className="space-y-3">
                    {todayRoutineReminders.filter(m => m.period === activePeriod).length > 0 ? (
                      todayRoutineReminders.filter(m => m.period === activePeriod).map(med => (
                        <div key={`${med.medicineId}-${med.rawScheduleTime}`} className="grid grid-cols-12 items-center py-2 border-b border-slate-50 last:border-0">
                          <div className="col-span-6">
                            <h4 className="text-xs font-bold text-[#0B1F3A]">{med.medicineName}</h4>
                            <p className="text-[9px] text-slate-400 font-semibold">{med.intakeInstruction}</p>
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <div onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'TAKEN')} className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${med.status === 'TAKEN' ? 'bg-[#289254] border-[#289254] text-white text-[9px]' : 'border-slate-300'}`}>✓</div>
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <div onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'MISSED')} className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${med.status === 'MISSED' ? 'bg-red-500 border-red-500 text-white text-[9px]' : 'border-slate-300'}`}>✗</div>
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <div onClick={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'SKIPPED')} className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${med.status === 'SKIPPED' ? 'bg-slate-400 border-slate-400 text-white text-[9px]' : 'border-slate-300'}`}>⊖</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">No routine medicines scheduled for the {activePeriod.toLowerCase()}.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* CATALOG MANAGEMENT TABS */}
            {activeFilter === 'Quick' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-[#0B1F3A] text-sm">Quick Catalog List</h3>
                {quickCatalog.map((med, index) => (
                  <div key={med.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">💊</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{med.medicineName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">1 {med.medicineType?.toLowerCase() || 'tablet'}</p>
                      </div>
                    </div>
                    <span className="text-slate-300 text-xs">Edit ✎</span>
                  </div>
                ))}
              </div>
            )}

            {activeFilter === 'Routine' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-extrabold text-[#0B1F3A] text-sm">Routine Catalog List</h3>
                {routineCatalog.map((med, index) => (
                  <div key={med.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">📅</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{med.medicineName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{med.intakeInstruction}</p>
                      </div>
                    </div>
                    <span className="text-slate-300 text-xs">Edit ✎</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Floating Action Button */}
          <button className="absolute bottom-6 right-6 w-14 h-14 bg-[#289254] rounded-full text-white font-extrabold flex items-center justify-center shadow-lg text-2xl">
            ＋
          </button>
        </div>
      </div>
    );
  }

  // --- NATIVE MOBILE SCREEN RENDER ---
  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicines</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotificationCenter')}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
        }
        contentContainerStyle={styles.scroll}
      >
        {activeFilter === 'All' && (
          <View style={{ gap: 16 }}>
            {/* Quick Medications Checklist Table */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <Ionicons name="flash" size={16} color="#F59E0B" />
                </View>
                <Text style={styles.sectionTitle}>Quick Medicines</Text>
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderTxt, { flex: 1 }]}>Medicine</Text>
                <Text style={[styles.tableHeaderTxt, { color: GREEN, width: 52, textAlign: 'center' }]}>Taken</Text>
                <Text style={[styles.tableHeaderTxt, { color: '#EF4444', width: 52, textAlign: 'center' }]}>Missed</Text>
                <Text style={[styles.tableHeaderTxt, { color: '#9CA3AF', width: 44, textAlign: 'center' }]}>Skip</Text>
              </View>

              {todayQuickReminders.length > 0 ? (
                todayQuickReminders.map((med: any, index: number) => (
                  <View key={`${med.medicineId}-${med.rawScheduleTime}`} style={styles.quickRow}>
                    <View style={styles.quickLeft}>
                      <View style={[styles.medIcon, { backgroundColor: getMedicineColor(index) }]}>
                        <Ionicons name="medical" size={18} color={getMedicineIconColor(index)} />
                      </View>
                      <View>
                        <Text style={styles.medName}>{med.medicineName}</Text>
                        <Text style={styles.medSub}>1 {med.medicineType.charAt(0) + med.medicineType.slice(1).toLowerCase()}</Text>
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'TAKEN')}
                      >
                        <Ionicons
                          name={med.status === 'TAKEN' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                          size={26}
                          color={med.status === 'TAKEN' ? GREEN : '#D1D5DB'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'MISSED')}
                      >
                        <Ionicons
                          name={med.status === 'MISSED' ? 'close-circle' : 'close-circle-outline'}
                          size={26}
                          color={med.status === 'MISSED' ? '#EF4444' : '#D1D5DB'}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'SKIPPED')}
                      >
                        <Ionicons
                          name={med.status === 'SKIPPED' ? 'remove-circle' : 'remove-circle-outline'}
                          size={26}
                          color={med.status === 'SKIPPED' ? '#9CA3AF' : '#D1D5DB'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySubtitleText}>No Quick medicines scheduled for today.</Text>
              )}
            </View>

            {/* Routine Medications Period Check-sheet */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="time" size={16} color="#6366F1" />
                </View>
                <Text style={styles.sectionTitle}>Routine Medicines</Text>
              </View>

              {/* Period selection */}
              <View style={styles.periodTabRow}>
                {PERIOD_TABS.map(period => (
                  <TouchableOpacity
                    key={period}
                    style={[styles.periodTab, activePeriod === period && styles.periodTabActive]}
                    onPress={() => setActivePeriod(period)}
                  >
                    <Ionicons
                      name={PERIOD_ICONS[period]}
                      size={14}
                      color={activePeriod === period ? GREEN : '#9CA3AF'}
                    />
                    <Text style={[styles.periodTabText, activePeriod === period && styles.periodTabTextActive]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.routineTableHeader}>
                <Text style={[styles.tableHeaderTxt, { flex: 1 }]}>Medicine</Text>
                <Text style={[styles.tableHeaderTxt, { color: GREEN, width: 50, textAlign: 'center' }]}>Taken</Text>
                <Text style={[styles.tableHeaderTxt, { color: '#EF4444', width: 50, textAlign: 'center' }]}>Missed</Text>
                <Text style={[styles.tableHeaderTxt, { color: '#9CA3AF', width: 44, textAlign: 'center' }]}>Skip</Text>
              </View>

              {todayRoutineReminders.filter(m => m.period === activePeriod).length > 0 ? (
                todayRoutineReminders.filter(m => m.period === activePeriod).map((med: any) => (
                  <View key={`${med.medicineId}-${med.rawScheduleTime}`} style={styles.routineRow}>
                    <View style={styles.routineLeft}>
                      <Text style={styles.routineMedName}>{med.medicineName}</Text>
                      <Text style={styles.routineMedSub}>
                        1 {med.medicineType.charAt(0) + med.medicineType.slice(1).toLowerCase()}
                        {med.intakeInstruction ? ` • ${med.intakeInstruction.replace(/_/g, ' ')}` : ''}
                      </Text>
                    </View>

                    <View style={styles.routineActions}>
                      <TouchableOpacity
                        style={styles.routineActionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'TAKEN')}
                      >
                        <View style={[
                          styles.routineCircle,
                          med.status === 'TAKEN' && { backgroundColor: GREEN, borderColor: GREEN }
                        ]}>
                          {med.status === 'TAKEN' && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.routineActionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'MISSED')}
                      >
                        <View style={[
                          styles.routineCircle,
                          med.status === 'MISSED' && { backgroundColor: '#EF4444', borderColor: '#EF4444' }
                        ]}>
                          {med.status === 'MISSED' && <Ionicons name="close" size={14} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.routineActionBtn}
                        onPress={() => confirmAndMarkDose(med.sessionId, med.userMedicineId, med.medicineName, 'SKIPPED')}
                      >
                        <View style={[
                          styles.routineCircle,
                          med.status === 'SKIPPED' && { backgroundColor: '#9CA3AF', borderColor: '#9CA3AF' }
                        ]}>
                          {med.status === 'SKIPPED' && <Ionicons name="remove" size={14} color="#FFFFFF" />}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySubtitleText}>No Routine medicines scheduled for the {activePeriod.toLowerCase()}.</Text>
              )}
            </View>
          </View>
        )}

        {/* Catalog views for Quick / Routine Management */}
        {activeFilter === 'Quick' && (
          <View style={styles.section}>
            {quickCatalog.map((med, index) => (
              <TouchableOpacity
                key={med.id}
                style={styles.quickRow}
                onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
              >
                <View style={styles.quickLeft}>
                  <View style={[styles.medIcon, { backgroundColor: getMedicineColor(index) }]}>
                    <Ionicons name="medical" size={18} color={getMedicineIconColor(index)} />
                  </View>
                  <View>
                    <Text style={styles.medName}>{med.medicineName}</Text>
                    <Text style={styles.medSub}>1 {med.medicineType?.toLowerCase() || 'tablet'}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeFilter === 'Routine' && (
          <View style={styles.section}>
            {routineCatalog.map((med, index) => (
              <TouchableOpacity
                key={med.id}
                style={styles.quickRow}
                onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
              >
                <View style={styles.quickLeft}>
                  <View style={[styles.medIcon, { backgroundColor: getMedicineColor(index) }]}>
                    <Ionicons name="calendar" size={18} color={getMedicineIconColor(index)} />
                  </View>
                  <View>
                    <Text style={styles.medName}>{med.medicineName}</Text>
                    <Text style={styles.medSub}>{med.intakeInstruction || 'After breakfast'}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddQuickMedicine')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// Plain Object StyleSheet for guaranteed compilation and TS compatibility
const styles: any = {
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 54, paddingBottom: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0B1F3A' },

  filterTabRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, paddingBottom: 12, gap: 8,
    borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F3F4F6',
  },
  filterTabActive: { backgroundColor: GREEN },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#718096' },
  filterTabTextActive: { color: '#FFFFFF' },
  scroll: { padding: 16 },

  section: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
    marginBottom: 16, borderWidth: 0.5, borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14,
  },
  sectionIconBox: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0B1F3A' },

  tableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6',
    marginBottom: 4,
  },
  tableHeaderTxt: { fontSize: 11, fontWeight: '700', color: '#9CA3AF' },

  quickRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: '#F9FAFB',
  },
  quickLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  medIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  medName: { fontSize: 13, fontWeight: '600', color: '#0B1F3A' },
  medSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  actionRow: { flexDirection: 'row', gap: 0 },
  actionBtn: { width: 52, alignItems: 'center', justifyContent: 'center' },

  periodTabRow: {
    flexDirection: 'row', gap: 8, marginBottom: 12,
  },
  periodTab: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#F3F4F6',
    borderWidth: 1, borderColor: 'transparent',
  },
  periodTabActive: {
    backgroundColor: '#E8F5EE', borderColor: GREEN,
  },
  periodTabText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  periodTabTextActive: { color: GREEN },

  routineTableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6',
    marginBottom: 4,
  },
  routineRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#F9FAFB',
  },
  routineLeft: { flex: 1 },
  routineMedName: { fontSize: 13, fontWeight: '600', color: '#0B1F3A' },
  routineMedSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  routineActions: { flexDirection: 'row' },
  routineActionBtn: { width: 48, alignItems: 'center' },
  routineCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },

  emptySubtitleText: {
    fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginVertical: 16, fontWeight: '500'
  },

  fab: {
    position: 'absolute', bottom: 90, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: GREEN,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
  },
};