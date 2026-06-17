import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';

interface Notification {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'MEDICINE_REMINDER': return { icon: 'alarm-outline', bg: '#FEE2E2', color: '#EF4444' };
    case 'MISSED_MEDICINE': return { icon: 'close-circle-outline', bg: '#FEE2E2', color: '#EF4444' };
    case 'CAREGIVER_ALERT': return { icon: 'people-outline', bg: '#FEF3C7', color: '#F59E0B' };
    case 'SYSTEM': return { icon: 'shield-checkmark-outline', bg: '#EEF2FF', color: '#6366F1' };
    default: return { icon: 'notifications-outline', bg: '#E8F5EE', color: GREEN };
  }
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const groupByDate = (notifications: Notification[]) => {
  const groups: { [key: string]: Notification[] } = {};
  notifications.forEach((notif) => {
    const label = getDateLabel(notif.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
  });
  return groups;
};

export default function NotificationCenterScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.log('Notifications error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.log('Mark read error:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const grouped = groupByDate(notifications);

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Unread Banner */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.unreadBanner}>
          <View style={styles.unreadLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5EE' }]}>
              <Ionicons name="notifications-outline" size={20} color={GREEN} />
            </View>
            <Text style={styles.unreadText}>
              You have{' '}
              <Text style={{ color: GREEN, fontWeight: '700' }}>
                {unreadCount} unread
              </Text>{' '}
              notifications
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
        }
        contentContainerStyle={styles.scroll}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! Notifications will appear here.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([dateLabel, items]) => (
            <View key={dateLabel}>

              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{dateLabel}</Text>
                {dateLabel === 'Today' && unreadCount > 0 && (
                  <Text style={styles.sectionCount}>{unreadCount} new</Text>
                )}
              </View>

              {/* Notification Cards */}
              {items.map((notif) => {
                const { icon, bg, color } = getNotificationIcon(notif.notificationType);
                return (
                  <TouchableOpacity
                    key={notif.id}
                    style={[
                      styles.notifCard,
                      !notif.isRead && styles.notifCardUnread
                    ]}
                    onPress={() => handleMarkRead(notif.id)}
                  >
                    <View style={[styles.notifIconBox, { backgroundColor: bg }]}>
                      <Ionicons name={icon as any} size={22} color={color} />
                    </View>
                    <View style={styles.notifContent}>
                      <Text style={[
                        styles.notifTitle,
                        !notif.isRead && { fontWeight: '700' }
                      ]}>
                        {notif.title}
                      </Text>
                      <Text style={styles.notifMessage} numberOfLines={2}>
                        {notif.message}
                      </Text>
                    </View>
                    <View style={styles.notifRight}>
                      <Text style={styles.notifTime}>
                        {formatTime(notif.createdAt)}
                      </Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                      {notif.isRead && <View style={styles.readDot} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
          <Ionicons name="checkmark-circle-outline" size={20} color={GREEN} />
          <View>
            <Text style={styles.markAllTxt}>Mark All As Read</Text>
            <Text style={styles.markAllSub}>Clear all unread notifications</Text>
          </View>
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#0B1F3A' },

  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  unreadLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  unreadText: { fontSize: 13, color: '#374151' },

  scroll: { paddingHorizontal: 16, paddingTop: 8 },

  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151' },
  sectionCount: { fontSize: 12, color: GREEN, fontWeight: '600' },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  notifCardUnread: {
    backgroundColor: '#F0FFF4',
    borderColor: '#BBF7D0',
  },
  notifIconBox: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: '#0B1F3A' },
  notifMessage: { fontSize: 12, color: '#6B7280', marginTop: 4, lineHeight: 18 },
  notifRight: { alignItems: 'flex-end', gap: 6 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  readDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },

  markAllBtn: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: GREEN,
  },
  markAllTxt: { fontSize: 15, fontWeight: '700', color: GREEN },
  markAllSub: { fontSize: 11, color: '#9CA3AF' },
});