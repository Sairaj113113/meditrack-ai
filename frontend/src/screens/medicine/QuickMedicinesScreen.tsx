import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert, Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';

interface Medicine {
  id: string;
diseaseName: string;
  medicineName: string;
  medicineType: string;
  frequencyType: string;
  intakeInstruction: string;
  startDate: string;
  endDate: string;
  status: string;
  userDiseaseId: string;
  schedules: { scheduleTime: string }[];
}

const MEDICINE_COLORS = ['#E8F5EE', '#FEE2E2', '#FEF3C7', '#EEF2FF', '#F0FFF4'];
const MEDICINE_ICON_COLORS = [GREEN, '#EF4444', '#F59E0B', '#6366F1', '#10B981'];

export default function QuickMedicinesScreen() {
  const navigation = useNavigation<any>();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const fetchMedicines = async () => {
    try {
      const response = await apiClient.get('/medicines?category=QUICK');
      setMedicines(response.data.data || []);
    } catch (error) {
      console.log('Quick medicines error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMedicines();
  }, []);

  const handleDelete = (medicine: Medicine) => {
    Alert.alert(
      'Delete Medicine',
      `Delete ${medicine.medicineName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/medicines/${medicine.id}`);
              setMenuVisible(null);
              fetchMedicines();
            } catch {
              Alert.alert('Error', 'Failed to delete medicine');
            }
          },
        },
      ]
    );
  };

  const handleArchive = (medicine: Medicine) => {
    Alert.alert(
      'Archive Medicine?',
      'Are you sure you want to archive this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            try {
              await apiClient.post(`/medicines/${medicine.id}/archive`);
              setMenuVisible(null);
              setMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
              fetchMedicines();
              Alert.alert('Success', 'Medicine archived successfully');
            } catch {
              Alert.alert('Error', 'Failed to archive medicine');
            }
          },
        },
      ]
    );
  };

  const getScheduleTimes = (schedules: { scheduleTime: string }[]) => {
    if (!schedules || schedules.length === 0) return 'No schedule';
    return schedules.map(s => s.scheduleTime).join(', ');
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'DAILY': return 'Every day';
      case 'WEEKLY': return 'Weekly';
      case 'INTERVAL': return 'Every few hours';
      case 'CUSTOM': return 'Custom';
      default: return freq;
    }
  };

  const getMedicineTypeLabel = (type: string) => {
    if (!type) return 'Tablet';
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Medicines</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ArchivedMedicines')}>
          <View style={styles.archiveBtn}>
            <Ionicons name="archive-outline" size={16} color={GREEN} />
            <Text style={styles.archiveBtnText}>Archive</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
        }
        contentContainerStyle={styles.scroll}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Quick Medicines</Text>
            <Text style={styles.emptySubtitle}>
              Add a quick medicine to take as needed
            </Text>
          </View>
        ) : (
          <>
            

            <Text style={styles.countLabel}>Medicines ({medicines.length})</Text>

            {medicines.map((med, index) => (
              <View key={med.id} style={styles.card}>

                {/* Disease Badge */}
              {/* Disease Badge */}
{med.diseaseName && (
  <View style={styles.diseaseBadge}>
    <Ionicons 
      name="heart-outline" 
      size={12} 
      color="#6366F1" 
    />

    <Text style={styles.diseaseBadgeText}>
      Disease: {med.diseaseName}
    </Text>
  </View>
)}

                <View style={styles.cardRow}>
                  {/* Medicine Icon */}
                  <View style={[
                    styles.medIcon,
                    { backgroundColor: MEDICINE_COLORS[index % MEDICINE_COLORS.length] }
                  ]}>
                    <Ionicons
                      name="medical"
                      size={22}
                      color={MEDICINE_ICON_COLORS[index % MEDICINE_ICON_COLORS.length]}
                    />
                  </View>

                  {/* Medicine Info */}
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med.medicineName}</Text>
                    <Text style={styles.medFreq}>
                      {getFrequencyLabel(med.frequencyType)}
                    </Text>
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                      <Text style={styles.timeText}>
                        {getScheduleTimes(med.schedules)}
                      </Text>
                    </View>
                  </View>

                  {/* 3-dot Menu Button */}
                  <TouchableOpacity
                    style={styles.menuBtn}
                    onPress={() => setMenuVisible(menuVisible === med.id ? null : med.id)}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Dropdown Menu */}
                {menuVisible === med.id && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setMenuVisible(null);
                        navigation.navigate('MedicineDetails', { medicineId: med.id }); 
                      }}
                    >
                      <View style={[styles.dropdownIcon, { backgroundColor: '#EEF2FF' }]}>
                        <Ionicons name="information-circle-outline" size={18} color="#6366F1" />
                      </View>
                      <Text style={styles.dropdownText}>Details</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setMenuVisible(null);
                        navigation.navigate('EditMedicineScreen', { medicineId: med.id });
                      }}
                    >
                      <View style={[styles.dropdownIcon, { backgroundColor: '#E8F5EE' }]}>
                        <Ionicons name="pencil-outline" size={18} color={GREEN} />
                      </View>
                      <Text style={styles.dropdownText}>Edit</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleArchive(med)}
                    >
                      <View style={[styles.dropdownIcon, { backgroundColor: '#F3F4F6' }]}>
                        <Ionicons name="archive-outline" size={18} color="#6B7280" />
                      </View>
                      <Text style={styles.dropdownText}>Archive</Text>
                    </TouchableOpacity>

                    <View style={styles.dropdownDivider} />

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleDelete(med)}
                    >
                      <View style={[styles.dropdownIcon, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </View>
                      <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Medicine FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMedicineScreen', { category: 'QUICK' })}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Medicine</Text>
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0B1F3A' },
  archiveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E8F5EE', paddingHorizontal: 10,
    paddingVertical: 6, borderRadius: 8,
  },
  archiveBtnText: { fontSize: 12, fontWeight: '600', color: GREEN },

  scroll: { padding: 16 },

  countLabel: {
    fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 12,
  },

  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 0.5, borderColor: '#E5E7EB',
  },

  diseaseBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginBottom: 10,
  },
  diseaseBadgeText: { fontSize: 11, color: '#6366F1', fontWeight: '600' },

  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  medIcon: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 15, fontWeight: '700', color: '#0B1F3A' },
  medFreq: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  timeText: { fontSize: 12, color: '#9CA3AF' },

  menuBtn: { padding: 4 },

  dropdown: {
    marginTop: 12, backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 0.5, borderColor: '#E5E7EB',
    overflow: 'hidden', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 12,
  },
  dropdownIcon: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  dropdownDivider: { height: 0.5, backgroundColor: '#F3F4F6', marginHorizontal: 12 },

  archiveCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16,
    borderWidth: 0.5, borderColor: '#E5E7EB', marginBottom: 16,
  },
  archiveCardIcon: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: '#E8F5EE', justifyContent: 'center', alignItems: 'center',
  },
  archiveCardContent: { flex: 1 },
  archiveCardTitle: { fontSize: 15, fontWeight: '700', color: '#0B1F3A' },
  archiveCardSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  fab: {
    position: 'absolute', bottom: 24, left: 24, right: 24,
    backgroundColor: GREEN, borderRadius: 16, height: 54,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  fabText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});