import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Modal, TextInput, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';

const RELATION_TYPES = ['FATHER', 'MOTHER', 'SPOUSE', 'SON', 'DAUGHTER', 'BROTHER', 'SISTER', 'FRIEND', 'OTHER'];
const PERMISSIONS = ['VIEW_ONLY', 'MANAGE_MEDICINES', 'FULL_ACCESS'];

const PERMISSION_LABELS: { [key: string]: string } = {
  VIEW_ONLY: 'View Only',
  MANAGE_MEDICINES: 'Manage Medicines',
  FULL_ACCESS: 'Full Access',
};

const RELATION_LABELS: { [key: string]: string } = {
  FATHER: 'Father', MOTHER: 'Mother', SPOUSE: 'Spouse',
  SON: 'Son', DAUGHTER: 'Daughter', BROTHER: 'Brother',
  SISTER: 'Sister', FRIEND: 'Friend', OTHER: 'Other',
};

const defaultForm = {
  caregiverName: '',
  caregiverMobile: '',
  relationType: 'FATHER',
  permission: 'VIEW_ONLY',
  isPrimary: false,
};

export default function CaregiverScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => { loadCaregivers(); }, []);

  const loadCaregivers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/caregivers');
      setCaregivers(response.data.data || []);
    } catch {
      Alert.alert('Error', 'Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCaregiver(null);
    setForm(defaultForm);
    setModalVisible(true);
  };

  const openEditModal = (caregiver: any) => {
    setEditingCaregiver(caregiver);
    setForm({
      caregiverName: caregiver.caregiverName || '',
      caregiverMobile: caregiver.caregiverMobile || '',
      relationType: caregiver.relationType || 'FATHER',
      permission: caregiver.permission || 'VIEW_ONLY',
      isPrimary: caregiver.isPrimary || false,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.caregiverName.trim()) {
      Alert.alert('Validation', 'Caregiver name is required');
      return;
    }
    if (!form.caregiverMobile.trim()) {
      Alert.alert('Validation', 'Mobile number is required');
      return;
    }

    setSaving(true);
    try {
      if (editingCaregiver) {
        await apiClient.put(`/caregivers/${editingCaregiver.id}`, form);
      } else {
        await apiClient.post('/caregivers', form);
      }
      setModalVisible(false);
      loadCaregivers();
    } catch (error: any) {
  console.log(
    'SAVE ERROR =>',
    error?.response?.data
  );

  Alert.alert(
    'Error',
    JSON.stringify(
      error?.response?.data ||
      error.message
    )
  );
} finally {
      setSaving(false);
    }
  };

  const handleDelete = (caregiver: any) => {
    Alert.alert(
      'Remove Caregiver',
      `Remove ${caregiver.caregiverName} as caregiver?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/caregivers/${caregiver.id}`);
              loadCaregivers();
            } catch {
              Alert.alert('Error', 'Failed to remove caregiver');
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = (caregiver: any) => {
    Alert.alert(
      'Set Primary',
      `Set ${caregiver.caregiverName} as primary caregiver?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await apiClient.put(`/caregivers/${caregiver.id}`, {
                ...caregiver,
                isPrimary: true,
              });
              loadCaregivers();
            } catch {
              Alert.alert('Error', 'Failed to set primary caregiver');
            }
          },
        },
      ]
    );
  };

  const primaryCaregiver = caregivers.find(c => c.isPrimary);
  const otherCaregivers = caregivers.filter(c => !c.isPrimary);

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
        <Text style={styles.headerTitle}>Caregivers</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <Ionicons name="people" size={28} color={GREEN} />
          </View>
          <Text style={styles.infoText}>
            Add family members or trusted people who can help you manage medicines and handle emergencies.
          </Text>
        </View>

        {/* Primary Caregiver */}
        {primaryCaregiver && (
          <>
            <Text style={styles.sectionTitle}>PRIMARY CAREGIVER</Text>
            <View style={styles.primaryCard}>
              <View style={styles.primaryBadge}>
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
              <View style={styles.cardRow}>
                <View style={[styles.avatar, { backgroundColor: '#E8F5EE' }]}>
                  <Ionicons name="person" size={28} color={GREEN} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{primaryCaregiver.caregiverName}</Text>
                  <Text style={styles.cardMobile}>
                    <Ionicons name="call-outline" size={12} color="#6B7280" /> {primaryCaregiver.caregiverMobile || 'No mobile'}
                  </Text>
                  <View style={styles.tagRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {RELATION_LABELS[primaryCaregiver.relationType] || primaryCaregiver.relationType}
                      </Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: '#E8F5EE' }]}>
                      <Text style={[styles.tagText, { color: GREEN }]}>
                        {PERMISSION_LABELS[primaryCaregiver.permission] || primaryCaregiver.permission}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEditModal(primaryCaregiver)}
                >
                  <Ionicons name="pencil-outline" size={16} color={GREEN} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Other Caregivers */}
        {otherCaregivers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>OTHER CAREGIVERS</Text>
            {otherCaregivers.map((caregiver) => (
              <View key={caregiver.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={[styles.avatar, { backgroundColor: '#EEF2FF' }]}>
                    <Ionicons name="person" size={28} color="#6366F1" />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{caregiver.caregiverName}</Text>
                    <Text style={styles.cardMobile}>
                      <Ionicons name="call-outline" size={12} color="#6B7280" /> {caregiver.caregiverMobile || 'No mobile'}
                    </Text>
                    <View style={styles.tagRow}>
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>
                          {RELATION_LABELS[caregiver.relationType] || caregiver.relationType}
                        </Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: '#EEF2FF' }]}>
                        <Text style={[styles.tagText, { color: '#6366F1' }]}>
                          {PERMISSION_LABELS[caregiver.permission] || caregiver.permission}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(caregiver)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.setPrimaryBtn}
                    onPress={() => handleSetPrimary(caregiver)}
                  >
                    <Ionicons name="star-outline" size={14} color={GREEN} />
                    <Text style={styles.setPrimaryText}>Set as Primary</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editBtnOutline}
                    onPress={() => openEditModal(caregiver)}
                  >
                    <Ionicons name="pencil-outline" size={14} color="#6B7280" />
                    <Text style={styles.editBtnOutlineText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Empty State */}
        {caregivers.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Caregivers Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a trusted person who can help manage your medicines.
            </Text>
          </View>
        )}

        {/* Add Button */}
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add-circle" size={22} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Caregiver</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalCard}>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingCaregiver ? 'Edit Caregiver' : 'Add Caregiver'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Name */}
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter caregiver's name"
                placeholderTextColor="#9CA3AF"
                value={form.caregiverName}
                onChangeText={(t) => setForm({ ...form, caregiverName: t })}
              />

              {/* Mobile */}
              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={form.caregiverMobile}
                onChangeText={(t) => setForm({ ...form, caregiverMobile: t })}
                maxLength={10}
              />

              {/* Relation */}
              <Text style={styles.inputLabel}>Relationship</Text>
              <View style={styles.chipRow}>
                {RELATION_TYPES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, form.relationType === item && styles.chipActive]}
                    onPress={() => setForm({ ...form, relationType: item })}
                  >
                    <Text style={[styles.chipText, form.relationType === item && styles.chipTextActive]}>
                      {RELATION_LABELS[item]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Permission */}
              <Text style={styles.inputLabel}>Permission Level</Text>
              <View style={styles.chipRow}>
                {PERMISSIONS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, form.permission === item && styles.chipActive]}
                    onPress={() => setForm({ ...form, permission: item })}
                  >
                    <Text style={[styles.chipText, form.permission === item && styles.chipTextActive]}>
                      {PERMISSION_LABELS[item]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Primary Toggle */}
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Set as Primary Caregiver</Text>
                  <Text style={styles.switchSubLabel}>Primary caregiver gets priority alerts</Text>
                </View>
                <Switch
                  value={form.isPrimary}
                  onValueChange={(v) => setForm({ ...form, isPrimary: v })}
                  trackColor={{ false: '#E5E7EB', true: GREEN }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Buttons */}
              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>
                      {editingCaregiver ? 'Update' : 'Save'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </View>
      </Modal>

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

  scroll: { padding: 16 },

  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 20, borderWidth: 0.5, borderColor: '#E5E7EB',
  },
  infoIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#E8F5EE', justifyContent: 'center', alignItems: 'center',
  },
  infoText: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 20 },

  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#9CA3AF',
    letterSpacing: 1, marginBottom: 10, marginTop: 4,
  },

  primaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1.5, borderColor: GREEN,
  },
  primaryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: GREEN, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12,
  },
  primaryBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 0.5, borderColor: '#E5E7EB',
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  cardInfo: { flex: 1, gap: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#0B1F3A' },
  cardMobile: { fontSize: 13, color: '#6B7280' },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tag: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: '#374151' },

  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E8F5EE', paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: { fontSize: 13, fontWeight: '600', color: GREEN },

  cardActions: {
    flexDirection: 'row', gap: 10, marginTop: 14,
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: '#F3F4F6',
  },
  setPrimaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#E8F5EE', paddingVertical: 10, borderRadius: 10,
  },
  setPrimaryText: { fontSize: 13, fontWeight: '600', color: GREEN },
  editBtnOutline: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#F3F4F6', paddingVertical: 10, borderRadius: 10,
  },
  editBtnOutlineText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },

  emptyContainer: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: GREEN, borderRadius: 16,
    height: 54, marginTop: 16,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 20, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0B1F3A' },

  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    padding: 14, fontSize: 14, color: '#0B1F3A', marginBottom: 4,
    backgroundColor: '#FAFAFA',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    borderWidth: 1, borderColor: '#E5E7EB',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#F9FAFB',
  },
  chipActive: { backgroundColor: GREEN, borderColor: GREEN },
  chipText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  chipTextActive: { color: '#FFFFFF' },

  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
    borderTopWidth: 0.5, borderTopColor: '#F3F4F6', marginTop: 8,
  },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#0B1F3A' },
  switchSubLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },
  saveBtn: {
    flex: 1, backgroundColor: GREEN,
    borderRadius: 12, height: 50, justifyContent: 'center', alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});