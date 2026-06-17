import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';
const { width } = Dimensions.get('window');

const FILTER_TABS = ['All', 'Quick', 'Routine'];
const PERIOD_TABS = ['Morning', 'Evening', 'Night'];

const PERIOD_ICONS: { [key: string]: any } = {
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
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markedStatus, setMarkedStatus] = useState<{ [key: string]: string }>({});

  const fetchMedicines = async (filter = activeFilter, period = activePeriod) => {
    try {
      let url = '/medicines';
      if (filter === 'Quick') url += '?category=QUICK';
      else if (filter === 'Routine') {
        url += `?category=ROUTINE&period=${period.toUpperCase()}`;
      }
      const response = await apiClient.get(url);
      setMedicines(response.data.data || []);
    } catch (error) {
      console.log('Medicines error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMedicines(activeFilter, activePeriod);
  }, [activeFilter, activePeriod]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMedicines(activeFilter, activePeriod);
  }, [activeFilter, activePeriod]);

  const handleMark = async (medicineId: string, action: string) => {
    try {
      await apiClient.post('/tracking/log', {
        userMedicineId: medicineId,
        action,
        scheduledTime: null,
      });
      setMarkedStatus(prev => ({ ...prev, [medicineId]: action }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update medicine status');
    }
  };

  const quickMedicines = medicines.filter(m => m.medicineCategory === 'QUICK');
  const routineMedicines = medicines.filter(m => m.medicineCategory === 'ROUTINE');

  const getDisplayMedicines = () => {
    if (activeFilter === 'Quick') return quickMedicines;
    if (activeFilter === 'Routine') return routineMedicines;
    return medicines;
  };

  const getMedicineColor = (index: number) => MEDICINE_COLORS[index % MEDICINE_COLORS.length];
  const getMedicineIconColor = (index: number) => MEDICINE_ICON_COLORS[index % MEDICINE_ICON_COLORS.length];

  const getStatusForMedicine = (med: any) => markedStatus[med.id] || null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  const displayMedicines = getDisplayMedicines();

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

        {displayMedicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Medicines Found</Text>
            <Text style={styles.emptySubtitle}>Add a medicine to get started</Text>
          </View>
        ) : (
          <>
            {/* Quick Medicines Section */}
            {(activeFilter === 'All' || activeFilter === 'Quick') && quickMedicines.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIconBox}>
                    <Ionicons name="flash" size={16} color="#F59E0B" />
                  </View>
                  <Text style={styles.sectionTitle}>Quick Medicines</Text>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderTxt, { flex: 1 }]}>Medicine</Text>
                  <Text style={[styles.tableHeaderTxt, { color: GREEN, width: 52, textAlign: 'center' }]}>Taken</Text>
                  <Text style={[styles.tableHeaderTxt, { color: '#EF4444', width: 52, textAlign: 'center' }]}>Missed</Text>
                  <Text style={[styles.tableHeaderTxt, { color: '#9CA3AF', width: 44, textAlign: 'center' }]}>Skip</Text>
                </View>

                {quickMedicines.map((med, index) => {
                  const status = getStatusForMedicine(med);
                  return (
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
                          <Text style={styles.medSub}>
                            {med.medicineType ? `1 ${med.medicineType.charAt(0) + med.medicineType.slice(1).toLowerCase()}` : '1 Tablet'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.actionRow}>
                        {/* Taken */}
                        <TouchableOpacity
                          style={[styles.actionBtn, status === 'TAKEN' && styles.takenActive]}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'TAKEN'); }}
                        >
                          <Ionicons
                            name={status === 'TAKEN' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                            size={26}
                            color={status === 'TAKEN' ? GREEN : '#D1D5DB'}
                          />
                          <Text style={[styles.actionLabel, { color: GREEN }]}>Taken</Text>
                        </TouchableOpacity>

                        {/* Missed */}
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'MISSED'); }}
                        >
                          <Ionicons
                            name={status === 'MISSED' ? 'close-circle' : 'close-circle-outline'}
                            size={26}
                            color={status === 'MISSED' ? '#EF4444' : '#D1D5DB'}
                          />
                          <Text style={[styles.actionLabel, { color: '#EF4444' }]}>Missed</Text>
                        </TouchableOpacity>

                        {/* Skip */}
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'SKIPPED'); }}
                        >
                          <Ionicons
                            name={status === 'SKIPPED' ? 'remove-circle' : 'remove-circle-outline'}
                            size={26}
                            color={status === 'SKIPPED' ? '#9CA3AF' : '#D1D5DB'}
                          />
                          <Text style={[styles.actionLabel, { color: '#9CA3AF' }]}>Skip</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Routine Medicines Section */}
            {(activeFilter === 'All' || activeFilter === 'Routine') && routineMedicines.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="time" size={16} color="#6366F1" />
                  </View>
                  <Text style={styles.sectionTitle}>Routine Medicines</Text>
                </View>

                {/* Period Tabs — only show when Routine or All */}
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

                {/* Routine Table Header */}
                <View style={styles.routineTableHeader}>
                  <Text style={[styles.tableHeaderTxt, { flex: 1 }]}>Medicine</Text>
                  <Text style={[styles.tableHeaderTxt, { color: GREEN, width: 50, textAlign: 'center' }]}>Taken</Text>
                  <Text style={[styles.tableHeaderTxt, { color: '#EF4444', width: 50, textAlign: 'center' }]}>Missed</Text>
                  <Text style={[styles.tableHeaderTxt, { color: '#9CA3AF', width: 44, textAlign: 'center' }]}>Skip</Text>
                </View>

                {routineMedicines.map((med) => {
                  const status = getStatusForMedicine(med);
                  return (
                    <TouchableOpacity
                      key={med.id}
                      style={styles.routineRow}
                      onPress={() => navigation.navigate('MedicineDetails', { medicineId: med.id })}
                    >
                      <View style={styles.routineLeft}>
                        <Text style={styles.routineMedName}>{med.medicineName}</Text>
                        <Text style={styles.routineMedSub}>
                          {med.medicineType
                            ? `1 ${med.medicineType.charAt(0) + med.medicineType.slice(1).toLowerCase()}`
                            : '1 Tablet'
                          }
                          {med.intakeInstruction
                            ? ` • ${med.intakeInstruction.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`
                            : ''
                          }
                        </Text>
                      </View>

                      <View style={styles.routineActions}>
                        {/* Taken */}
                        <TouchableOpacity
                          style={styles.routineActionBtn}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'TAKEN'); }}
                        >
                          <View style={[
                            styles.routineCircle,
                            status === 'TAKEN' && { backgroundColor: GREEN, borderColor: GREEN }
                          ]}>
                            {status === 'TAKEN' && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>

                        {/* Missed */}
                        <TouchableOpacity
                          style={styles.routineActionBtn}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'MISSED'); }}
                        >
                          <View style={[
                            styles.routineCircle,
                            status === 'MISSED' && { backgroundColor: '#EF4444', borderColor: '#EF4444' }
                          ]}>
                            {status === 'MISSED' && <Ionicons name="close" size={14} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>

                        {/* Skip */}
                        <TouchableOpacity
                          style={styles.routineActionBtn}
                          onPress={(e) => { e.stopPropagation(); handleMark(med.id, 'SKIPPED'); }}
                        >
                          <View style={[
                            styles.routineCircle,
                            status === 'SKIPPED' && { backgroundColor: '#9CA3AF', borderColor: '#9CA3AF' }
                          ]}>
                            {status === 'SKIPPED' && <Ionicons name="remove" size={14} color="#FFFFFF" />}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Medicine FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMedicine')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
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
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTabTextActive: { color: '#FFFFFF' },

  scroll: { padding: 16 },

  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF' },

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
  actionBtn: { width: 52, alignItems: 'center', gap: 2 },
  actionLabel: { fontSize: 9, fontWeight: '600' },
  takenActive: {},

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

  fab: {
    position: 'absolute', bottom: 90, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: GREEN,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
  },
});