import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

const GREEN = '#289254';

const settingsItems = [
  {
    id: 'notifications',
    title: 'Notification Settings',
    subtitle: 'Manage reminders, alarms and alerts',
    icon: 'notifications-outline',
    iconBg: '#E8F5EE',
    iconColor: GREEN,
    route: 'NotificationSettings',
  },
  {
    id: 'password',
    title: 'Change Password',
    subtitle: 'Update your account password',
    icon: 'lock-closed-outline',
    iconBg: '#EEF2FF',
    iconColor: '#6366F1',
    route: 'ChangePassword',
  },
  {
    id: 'about',
    title: 'About MediTrack',
    subtitle: 'Version, terms and support',
    icon: 'information-circle-outline',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
    route: 'AboutApp',
  },
  {
    id: 'logout',
    title: 'Logout',
    subtitle: 'Sign out from your account',
    icon: 'log-out-outline',
    iconBg: '#FEE2E2',
    iconColor: '#EF4444',
    route: null,
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();

  const handlePress = (item: typeof settingsItems[0]) => {
    if (item.id === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => logout(),
          },
        ]
      );
      return;
    }
    if (item.route) navigation.navigate(item.route);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              index === settingsItems.length - 1 && { marginTop: 8 }
            ]}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
              <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
            </View>
            <View style={styles.itemContent}>
              <Text style={[
                styles.itemTitle,
                item.id === 'logout' && { color: '#EF4444' }
              ]}>
                {item.title}
              </Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
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
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0B1F3A',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 3,
  },
});