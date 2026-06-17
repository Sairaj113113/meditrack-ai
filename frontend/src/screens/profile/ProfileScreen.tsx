
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useAuthStore } from '../../store/authStore';
import {
  getUserProfile,
  getMedicalProfile,
} from '../../services/profileService';

const GREEN = '#289254';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { logout } = useAuthStore();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const [medicalProfile, setMedicalProfile] =
    useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, medicalData] =
        await Promise.all([
          getUserProfile(),
          getMedicalProfile(),
        ]);

      setProfile(profileData);
      setMedicalProfile(medicalData);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Failed to load profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const showComingSoon = (title: string) => {
    Alert.alert(
      'Coming Soon',
      `${title} will be available in a future update.`
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={GREEN}
        />
      </View>
    );
  }

  const fullName = `${profile?.firstName || ''} ${
    profile?.lastName || ''
  }`;

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={GREEN}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Profile
        </Text>

        <TouchableOpacity
          onPress={() =>
            showComingSoon('Edit Profile')
          }
        >
          <Text style={styles.editText}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.firstName
                ?.charAt(0)
                ?.toUpperCase() || 'U'}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {fullName}
            </Text>

            <Text style={styles.subtitle}>
              Take care and stay healthy!
            </Text>

            <View style={styles.infoRow}>
              <Ionicons
                name="call"
                size={14}
                color="#9CA3AF"
              />
              <Text style={styles.infoText}>
                {profile?.mobile || '-'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="mail"
                size={14}
                color="#9CA3AF"
              />
              <Text style={styles.infoText}>
                {profile?.email || '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Security Banner */}

        <View style={styles.securityCard}>
          <View style={styles.securityIcon}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color={GREEN}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>
              Your health information is secure
            </Text>

            <Text style={styles.securitySub}>
              We never share your data with
              anyone.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9CA3AF"
          />
        </View>

        {/* Personal Information */}

        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.sectionCard}>
          <ProfileRow
            icon="person-outline"
            label="Full Name"
            value={fullName}
          />

          <ProfileRow
            icon="calendar-outline"
            label="Date Of Birth"
            value={
              medicalProfile?.dateOfBirth || '-'
            }
          />

          <ProfileRow
            icon="male-female-outline"
            label="Gender"
            value={
              medicalProfile?.gender || '-'
            }
          />

          <ProfileRow
            icon="call-outline"
            label="Phone Number"
            value={profile?.mobile || '-'}
          />

          <ProfileRow
            icon="mail-outline"
            label="Email"
            value={profile?.email || '-'}
          />

          <ProfileRow
            icon="globe-outline"
            label="Timezone"
            value={
              profile?.timezone || '-'
            }
            isLast
          />
        </View>

        {/* Health Profile */}

        <Text style={styles.sectionTitle}>
          Health Profile
        </Text>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            navigation.navigate('MedicalProfile')
          }
        >
          <View style={styles.menuLeft}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor:
                    '#E8FAF0',
                },
              ]}
            >
              <Ionicons
                name="heart"
                size={20}
                color={GREEN}
              />
            </View>

            <View>
              <Text style={styles.menuTitle}>
                Medical Profile
              </Text>

              <Text style={styles.menuSub}>
                View diseases,
                allergies and more
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        {/* Account */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            navigation.navigate(
              'ChangePassword'
            )
          }
        >
          <View style={styles.menuLeft}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor:
                    '#EEF2FF',
                },
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6366F1"
              />
            </View>

            <Text style={styles.menuTitle}>
              Change Password
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={handleLogout}
        >
          <View style={styles.menuLeft}>
            <View
              style={[
                styles.menuIcon,
                {
                  backgroundColor:
                    '#FEE2E2',
                },
              ]}
            >
              <Ionicons
                name="log-out"
                size={20}
                color="#EF4444"
              />
            </View>

            <Text
              style={[
                styles.menuTitle,
                { color: '#EF4444' },
              ]}
            >
              Logout
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        <View
          style={{ height: 40 }}
        />
      </ScrollView>
    </View>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  isLast,
}: any) {
  return (
    <View
      style={[
        styles.row,
        isLast && {
          borderBottomWidth: 0,
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={18}
          color={GREEN}
        />

        <Text style={styles.rowLabel}>
          {label}
        </Text>
      </View>

      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>
          {value}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={16}
          color="#D1D5DB"
        />
      </View>
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  editText: {
    color: GREEN,
    fontWeight: '700',
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },

  infoText: {
    color: '#6B7280',
    fontSize: 12,
  },

  securityCard: {
    backgroundColor: '#E8FAF0',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityIcon: {
    marginRight: 12,
  },

  securityTitle: {
    fontWeight: '600',
    color: '#0B1F3A',
  },

  securitySub: {
    fontSize: 12,
    color: '#6B7280',
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    fontWeight: '700',
    fontSize: 15,
    color: '#0B1F3A',
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  rowLabel: {
    color: '#374151',
    fontSize: 14,
  },

  rowValue: {
    color: '#6B7280',
    fontSize: 13,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B1F3A',
  },

  menuSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});

