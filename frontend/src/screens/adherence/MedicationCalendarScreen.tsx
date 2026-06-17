import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, ActivityIndicator, Image, Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../services/apiClient';

const GREEN = '#289254';
const { width } = Dimensions.get('window');
const SCREEN_PADDING = 32;
const CARD_PADDING = 12;
const CALENDAR_WIDTH = width - SCREEN_PADDING - CARD_PADDING * 2;
const CELL_SIZE = Math.floor(CALENDAR_WIDTH / 7);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarDay {
  date: string;
  status: string;
  adherencePercentage: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ALL_TAKEN': return GREEN;
    case 'PARTIAL': return '#F59E0B';
    case 'MISSED': return '#EF4444';
    default: return '#D1D5DB';
  }
};

export default function AdherenceScreen() {
  const navigation = useNavigation<any>();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCalendar = async () => {
    try {
      const response = await apiClient.get(`/adherence/calendar?year=${year}&month=${month}`);
      setCalendarDays(response.data.data?.days || []);
    } catch (error) {
      console.log('Calendar error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
  fetchCalendar();
}, [year, month]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCalendar();
  }, [year, month]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDaysCount = new Date(year, month - 1, 0).getDate();

  const cells: { day: number; prev?: boolean; next?: boolean }[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ day: prevMonthDaysCount - firstDayOfMonth + 1 + i, prev: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay++, next: true });
  }

  const calendarMap: { [key: string]: CalendarDay } = {};
  calendarDays.forEach(d => { calendarMap[d.date] = d; });

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear();

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarMap[dateStr];
  };

  const handleDayPress = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigation.navigate('DailyMedicationDetails', { date: dateStr });
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
        <Text style={styles.headerTitle}>Medication Calendar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN} />
        }
        contentContainerStyle={styles.scroll}
      >

        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Track your daily medication</Text>
            <Text style={styles.bannerSubtitle}>progress at a glance.</Text>
          </View>
          <Image
            source={require('../../../assets/calendar.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>

          {/* Month Nav */}
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
              <Ionicons name="chevron-back" size={18} color={GREEN} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{MONTHS[month - 1]} {year}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={18} color={GREEN} />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaderRow}>
            {DAYS.map(d => (
              <View key={d} style={styles.dayHeaderCell}>
                <Text style={styles.dayHeaderTxt}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Grid */}
          <View style={styles.grid}>
            {cells.map((cell, index) => {
              if (cell.prev || cell.next) {
                return (
                  <View key={index} style={styles.cell}>
                    <Text style={styles.otherDay}>{cell.day}</Text>
                  </View>
                );
              }

              const dayData = getDayData(cell.day);
              const todayFlag = isToday(cell.day);
              const statusColor = dayData ? getStatusColor(dayData.status) : null;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.cell}
                  onPress={() => handleDayPress(cell.day)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.dayCircle,
                    todayFlag && styles.todayCircle,
                  ]}>
                    <Text style={[
                      styles.dayNum,
                      todayFlag && styles.todayNum,
                    ]}>
                      {cell.day}
                    </Text>
                  </View>
                  <View style={[
                    styles.dot,
                    { backgroundColor: statusColor || 'transparent' }
                  ]} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            {[
              { label: 'All Taken', color: GREEN },
              { label: 'Partial', color: '#F59E0B' },
              { label: 'Missed', color: '#EF4444' },
              { label: 'No Data', color: '#D1D5DB' },
            ].map(item => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

        </View>

        {/* Report Cards */}
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => navigation.navigate('Reports', { type: 'weekly' })}
        >
          <View style={styles.reportLeft}>
            <View style={styles.reportIconBox}>
              <Ionicons name="bar-chart-outline" size={22} color={GREEN} />
            </View>
            <View>
              <Text style={styles.reportTitle}>Weekly Report</Text>
              <Text style={styles.reportSub}>View this week's summary</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => navigation.navigate('Reports', { type: 'monthly' })}
        >
          <View style={styles.reportLeft}>
            <View style={styles.reportIconBox}>
              <Ionicons name="calendar-outline" size={22} color={GREEN} />
            </View>
            <View>
              <Text style={styles.reportTitle}>Monthly Report</Text>
              <Text style={styles.reportSub}>View this month's summary</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  scroll: { padding: 16, gap: 12 },

  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeft: { flex: 1, gap: 4 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#374151' },
  bannerSubtitle: { fontSize: 12, color: '#9CA3AF' },
  bannerImage: { width: 72, height: 72 },

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: CARD_PADDING,
    paddingTop: 14,
    paddingBottom: 14,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  navBtn: {
    width: 28, height: 28,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: { fontSize: 15, fontWeight: '700', color: '#0B1F3A', minWidth: 130, textAlign: 'center' },

  dayHeaderRow: {
    flexDirection: 'row',
    width: CELL_SIZE * 7,
    marginBottom: 4,
  },
  dayHeaderCell: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  dayHeaderTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  divider: {
    width: CELL_SIZE * 7,
    height: 0.5,
    backgroundColor: '#F3F4F6',
    marginBottom: 4,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * 7,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: GREEN,
  },
  dayNum: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  todayNum: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  otherDay: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: CELL_SIZE * 7,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#F3F4F6',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendLabel: { fontSize: 10, color: '#6B7280' },

  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  reportLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  reportIconBox: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTitle: { fontSize: 15, fontWeight: '600', color: '#0B1F3A' },
  reportSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
});