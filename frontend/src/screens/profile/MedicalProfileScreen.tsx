import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../../services/apiClient';

import { getMedicalProfile } from '../../services/medicalProfileService';
import { getCaregivers } from '../../services/caregiverService';

const GREEN = '#289254';

export default function MedicalProfileScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
const [emergencyNumber, setEmergencyNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [medicalData, caregiverData] =
        await Promise.all([
          getMedicalProfile(),
          getCaregivers(),
        ]);

      setProfile(medicalData);
      setCaregivers(caregiverData || []);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Failed to load medical profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const comingSoon = (title: string) => {
    Alert.alert(
      'Coming Soon',
      `${title} will be available in a future update.`
    );
  };

  const saveEmergencyContact = async () => {
  try {
    await apiClient.put(
      '/users/medical-profile',
      {
        emergencyContactMobile: emergencyNumber,
      }
    );

    setEmergencyModalVisible(false);

    await loadData(); // your existing profile reload function

    Alert.alert(
      'Success',
      'Emergency contact updated'
    );
  } catch (error) {
    Alert.alert(
      'Error',
      'Failed to update emergency contact'
    );
  }
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
          Medical Profile
        </Text>

        <TouchableOpacity
          onPress={() =>
            comingSoon(
              'Edit Medical Profile'
            )
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
        {/* Diseases */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    '#E8FAF0',
                },
              ]}
            >
              <Ionicons
                name="heart"
                size={18}
                color={GREEN}
              />
            </View>

            <Text style={styles.cardTitle}>
              Diseases / Conditions
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9CA3AF"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.valueText}>
              {profile?.chronicConditions ||
                'No conditions added'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                comingSoon(
                  'Add Disease'
                )
              }
            >
              <Text
                style={styles.addText}
              >
                + Add Disease
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Allergies */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    '#F3E8FF',
                },
              ]}
            >
              <Ionicons
                name="shield"
                size={18}
                color="#A855F7"
              />
            </View>

            <Text style={styles.cardTitle}>
              Allergies
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9CA3AF"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.valueText}>
              {profile?.allergies ||
                'No allergies added'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                comingSoon(
                  'Add Allergy'
                )
              }
            >
              <Text
                style={[
                  styles.addText,
                  {
                    color:
                      '#A855F7',
                  },
                ]}
              >
                + Add Allergy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

       {/* Emergency Contact */}

<View style={styles.card}>
  <View style={styles.cardHeader}>
    <View
      style={[
        styles.iconBox,
        {
          backgroundColor: '#FEE2E2',
        },
      ]}
    >
      <Ionicons
        name="call"
        size={18}
        color="#EF4444"
      />
    </View>

    <Text style={styles.cardTitle}>
      Emergency Contact
    </Text>

    <Ionicons
      name="chevron-forward"
      size={18}
      color="#9CA3AF"
    />
  </View>

  <View style={styles.content}>
    {profile?.emergencyContactMobile ? (
  <>
    <Text style={styles.contactMobile}>
      {profile.emergencyContactMobile}
    </Text>

    <TouchableOpacity
      onPress={() => {
  setEmergencyNumber(
    profile?.emergencyContactMobile || ''
  );
  setEmergencyModalVisible(true);
}}
    >
      <Text
        style={[
          styles.addText,
          {
            color: '#EF4444',
          },
        ]}
      >
        + Edit Emergency Contact
      </Text>
    </TouchableOpacity>
  </>
) : (
  <>
    <Text style={styles.valueText}>
      No emergency contact added
    </Text>

  <TouchableOpacity
  onPress={() => {
    setEmergencyNumber('');
    setEmergencyModalVisible(true);
  }}
>
      <Text
        style={[
          styles.addText,
          {
            color: '#EF4444',
          },
        ]}
      >
        + Add Emergency Contact
      </Text>
    </TouchableOpacity>
  </>
)}
  </View>
</View>

        {/* Caregivers */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    '#DBEAFE',
                },
              ]}
            >
              <Ionicons
                name="people"
                size={18}
                color="#3B82F6"
              />
            </View>

            <Text style={styles.cardTitle}>
              Caregiver / Family Member
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#9CA3AF"
            />
          </View>

          <View style={styles.content}>
            {caregivers.length > 0 ? (
              caregivers.map(
                (
                  caregiver,
                  index
                ) => (
                  <View
                    key={caregiver.id}
                    style={{
                      marginBottom: 10,
                    }}
                  >
                <Text style={styles.contactName}>
  {caregiver.caregiverName}
</Text>

<Text style={styles.contactMobile}>
  {caregiver.caregiverMobile}
</Text>

<Text
  style={[
    styles.contactMobile,
    { fontSize: 12 }
  ]}
>
  {caregiver.relationType}
</Text>
                  </View>
                )
              )
            ) : (
              <Text
                style={
                  styles.valueText
                }
              >
                No caregivers added
              </Text>
            )}

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Caregivers')
              }
            >
              <Text
                style={[
                  styles.addText,
                  {
                    color:
                      '#3B82F6',
                  },
                ]}
              >
                + Add Caregiver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Medical Notes */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor:
                    '#FEF3C7',
                },
              ]}
            >
              <Ionicons
                name="document-text"
                size={18}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.cardTitle}>
              Medical Notes
            </Text>
          </View>

          <View style={styles.content}>
            <View
              style={
                styles.notesBox
              }
            >
              <Text
                style={
                  styles.noteText
                }
              >
                {profile?.medicalNotes ||
                  'No notes added'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                comingSoon(
                  'Add Note'
                )
              }
            >
              <Text
                style={[
                  styles.addText,
                  {
                    color:
                      '#F59E0B',
                  },
                ]}
              >
                + Add Note
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{ height: 40 }}
        />
      </ScrollView>
      <Modal
  visible={emergencyModalVisible}
  transparent
  animationType="slide"
>
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor:
        'rgba(0,0,0,0.4)',
      padding: 20,
    }}
  >
    <View
      style={{
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginBottom: 16,
        }}
      >
        Emergency Contact
      </Text>

      <TextInput
        value={emergencyNumber}
        onChangeText={
          setEmergencyNumber
        }
        keyboardType="phone-pad"
        placeholder="Enter mobile number"
        style={{
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 12,
            padding: 14,
            marginRight: 8,
            alignItems: 'center',
          }}
          onPress={() =>
            setEmergencyModalVisible(
              false
            )
          }
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:
              '#289254',
            borderRadius: 12,
            padding: 14,
            marginLeft: 8,
            alignItems: 'center',
          }}
          onPress={
            saveEmergencyContact
          }
        >
          <Text
            style={{
              color: '#FFF',
              fontWeight: '700',
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
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
    justifyContent:
      'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 14,
    paddingHorizontal: 16,
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

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  content: {
    marginTop: 16,
  },

  valueText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },

  addText: {
    marginTop: 14,
    color: GREEN,
    fontWeight: '600',
    fontSize: 13,
  },

  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  contactMobile: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },

  notesBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 10,
    padding: 12,
  },

  noteText: {
    color: '#6B7280',
    fontSize: 13,
  },
});