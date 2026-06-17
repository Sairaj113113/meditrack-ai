import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Switch, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderMode, setReminderMode] = useState<'NOTIFICATION' | 'ALARM'>('NOTIFICATION');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.get('/settings');
      const data = response.data.data;
      setNotificationsEnabled(data.notificationsEnabled);
      setReminderMode(data.reminderMode);
      setVibrationEnabled(data.vibrationEnabled);
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/settings', {
        notificationsEnabled,
        reminderMode,
        vibrationEnabled,
      });
      Alert.alert('Success', 'Settings saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionDesc}>
          Manage how you receive medicine reminder alerts.
        </Text>

        <View style={styles.card}>

          {/* Enable Notifications */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5EE' }]}>
                <Ionicons name="notifications-outline" size={20} color={GREEN} />
              </View>
              <Text style={styles.rowTitle}>Enable Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: GREEN }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Reminder Mode */}
          <View style={styles.reminderSection}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5EE' }]}>
                <Ionicons name="time-outline" size={20} color={GREEN} />
              </View>
              <Text style={styles.rowTitle}>Reminder Mode</Text>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setReminderMode('NOTIFICATION')}
              >
                <View style={[
                  styles.radioOuter,
                  reminderMode === 'NOTIFICATION' && styles.radioOuterActive
                ]}>
                  {reminderMode === 'NOTIFICATION' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Notification Only</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioRow}
                onPress={() => setReminderMode('ALARM')}
              >
                <View style={[
                  styles.radioOuter,
                  reminderMode === 'ALARM' && styles.radioOuterActive
                ]}>
                  {reminderMode === 'ALARM' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Alarm Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Vibration */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5EE' }]}>
                <Ionicons name="phone-portrait-outline" size={20} color={GREEN} />
              </View>
              <Text style={styles.rowTitle}>Vibration</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#E5E7EB', true: GREEN }}
              thumbColor="#FFFFFF"
            />
          </View>

        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnTxt}>Save Changes</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0B1F3A',
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1F3A',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#F3F4F6',
  },
  reminderSection: {
    paddingVertical: 16,
    gap: 14,
  },
  radioGroup: {
    paddingLeft: 50,
    gap: 14,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: GREEN,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  radioLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: GREEN,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});