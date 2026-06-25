import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';

interface ArchivedMedicine {
  id: string;
  diseaseName: string;
  medicineName: string;
  medicineType: string;
  frequencyType: string;
  startDate: string;
  endDate: string;
}

export default function ArchivedMedicinesScreen() {
  const navigation = useNavigation<any>();
  const [medicines, setMedicines] = useState<ArchivedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const loadArchivedMedicines = async () => {
    try {
      const response = await apiClient.get('/medicines/archived');
      setMedicines(response.data.data || []);
    } catch (error) {
      console.log('Archived medicines error:', error);
      Alert.alert('Error', 'Unable to load archived medicines');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArchivedMedicines();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadArchivedMedicines();
  }, []);

  const handleUnarchive = async (medicine: ArchivedMedicine) => {
    try {
      await apiClient.post(`/medicines/${medicine.id}/unarchive`);
      setMedicines((prev) => prev.filter((item) => item.id !== medicine.id));
      setMenuVisible(null);
      Alert.alert('Success', 'Medicine unarchived successfully');
    } catch (error) {
      console.log('Unarchive error:', error);
      Alert.alert('Error', 'Unable to unarchive this medicine');
    }
  };

  const handleDeletePermanently = (medicine: ArchivedMedicine) => {
    const deleteMedicine = async () => {
      try {
        await apiClient.delete(`/medicines/${medicine.id}`);
        setMenuVisible(null);
        setMedicines((prev) => prev.filter((item) => item.id !== medicine.id));
        Alert.alert('Success', 'Medicine deleted permanently');
      } catch (error) {
        console.log('Delete permanently error:', error);
        Alert.alert('Error', 'Unable to delete this medicine');
      }
    };

    Alert.alert(
      'Delete Permanently',
      `Are you sure you want to permanently delete ${medicine.medicineName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteMedicine },
      ]
    );
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Archived Medicines</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Archived Medicines ({medicines.length})</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
        }
        contentContainerStyle={styles.content}
      >
        {medicines.map((medicine, index) => (
          <View key={medicine.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                {medicine.diseaseName ? (
                  <View style={styles.diseaseBadge}>
                    <Ionicons name="heart-outline" size={12} color="#6366F1" />
                    <Text style={styles.diseaseBadgeText}>{medicine.diseaseName}</Text>
                  </View>
                ) : null}
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>Archived</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => setMenuVisible(menuVisible === medicine.id ? null : medicine.id)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={[styles.medIcon, { backgroundColor: index % 2 === 0 ? '#E8F5EE' : '#EEF2FF' }]}>
              <Ionicons name="medical" size={22} color={GREEN} />
            </View>

            <Text style={styles.medName}>{medicine.medicineName}</Text>
            <Text style={styles.medMeta}>{medicine.medicineType}</Text>
            <Text style={styles.medMeta}>{medicine.frequencyType}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
              <Text style={styles.dateText}>{medicine.startDate} - {medicine.endDate}</Text>
            </View>

            {menuVisible === medicine.id && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setMenuVisible(null);
                    navigation.navigate('MedicineDetails', { medicineId: medicine.id });
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
                  onPress={() => handleUnarchive(medicine)}
                >
                  <View style={[styles.dropdownIcon, { backgroundColor: '#E8F5EE' }]}>
                    <Ionicons name="archive-outline" size={18} color={GREEN} />
                  </View>
                  <Text style={styles.dropdownText}>Unarchive</Text>
                </TouchableOpacity>

                <View style={styles.dropdownDivider} />

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDeletePermanently(medicine)}
                >
                  <View style={[styles.dropdownIcon, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </View>
                  <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Delete Permanently</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddQuickMedicine')}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Medicine</Text>
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
  subtitleRow: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  subtitle: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  content: { padding: 16, paddingBottom: 0 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 0.5, borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardHeaderLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  diseaseBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 6,
    borderRadius: 999,
  },
  diseaseBadgeText: { fontSize: 11, color: '#6366F1', fontWeight: '600' },
  statusBadge: {
    backgroundColor: '#E8F5EE', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: { fontSize: 11, color: GREEN, fontWeight: '700' },
  medIcon: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  medName: { fontSize: 16, fontWeight: '700', color: '#0B1F3A', marginBottom: 6 },
  medMeta: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  dateText: { fontSize: 12, color: '#6B7280' },
  menuBtn: { padding: 6 },
  dropdown: {
    marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 12,
    borderWidth: 0.5, borderColor: '#E5E7EB', overflow: 'hidden', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
  },
  dropdownIcon: {
    width: 32, height: 32, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  dropdownDivider: { height: 0.5, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
  addButton: {
    position: 'absolute', left: 24, right: 24, bottom: 24,
    backgroundColor: GREEN, height: 54, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
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
});
