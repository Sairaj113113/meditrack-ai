import React, { useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { changePassword } from '../../services/userService';

const GREEN = '#289254';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const getStrength = () => {
    let score = 0;

    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;

    if (score <= 1)
      return { label: 'Weak', width: '25%', color: '#F44336' };

    if (score <= 3)
      return { label: 'Medium', width: '65%', color: '#FF9800' };

    return { label: 'Strong', width: '100%', color: '#00C853' };
  };

  const strength = getStrength();

  const validate = () => {
    if (!currentPassword.trim()) {
      Alert.alert(
        'Validation',
        'Enter current password'
      );
      return false;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Validation',
        'Password must be at least 8 characters'
      );
      return false;
    }

    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert(
        'Validation',
        'Password must contain uppercase letter'
      );
      return false;
    }

    if (!/[a-z]/.test(newPassword)) {
      Alert.alert(
        'Validation',
        'Password must contain lowercase letter'
      );
      return false;
    }

    if (!/[0-9]/.test(newPassword)) {
      Alert.alert(
        'Validation',
        'Password must contain number'
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Validation',
        'Passwords do not match'
      );
      return false;
    }

    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert(
        'Success',
        'Password updated successfully',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Unable to update password'
      );
    } finally {
      setSaving(false);
    }
  };

  const Rule = ({
    valid,
    text,
  }: {
    valid: boolean;
    text: string;
  }) => (
    <View style={styles.ruleRow}>
      <Ionicons
        name={
          valid
            ? 'checkmark-circle'
            : 'ellipse-outline'
        }
        size={18}
        color={valid ? GREEN : '#D1D5DB'}
      />
      <Text
        style={[
          styles.ruleText,
          valid && { color: GREEN },
        ]}
      >
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={GREEN}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Change Password
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={GREEN}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>
              Keep your account secure
            </Text>

            <Text style={styles.infoSub}>
              Use a strong password that
              you don't use elsewhere.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            Current Password
          </Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="lock-closed"
              size={18}
              color={GREEN}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={
                setCurrentPassword
              }
            />

            <TouchableOpacity
              onPress={() =>
                setShowCurrent(
                  !showCurrent
                )
              }
            >
              <Ionicons
                name={
                  showCurrent
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="lock-closed"
              size={18}
              color={GREEN}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowNew(!showNew)
              }
            >
              <Ionicons
                name={
                  showNew
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.strengthLabel}>
            Password Strength:{' '}
            {strength.label}
          </Text>

          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                {
                  width: strength.width as any,
                  backgroundColor:
                    strength.color,
                },
              ]}
            />
          </View>

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="lock-closed"
              size={18}
              color={GREEN}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={
                setConfirmPassword
              }
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
            >
              <Ionicons
                name={
                  showConfirm
                    ? 'eye-outline'
                    : 'eye-off-outline'
                }
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.rulesTitle}>
            Password must contain:
          </Text>

          <Rule
            valid={newPassword.length >= 8}
            text="At least 8 characters"
          />

          <Rule
            valid={/[A-Z]/.test(newPassword)}
            text="One uppercase letter (A-Z)"
          />

          <Rule
            valid={/[a-z]/.test(newPassword)}
            text="One lowercase letter (a-z)"
          />

          <Rule
            valid={/[0-9]/.test(newPassword)}
            text="One number (0-9)"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdatePassword}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFF"
            />
          ) : (
            <>
              <Ionicons
                name="lock-closed"
                size={18}
                color="#FFF"
              />
              <Text
                style={styles.buttonText}
              >
                Update Password
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark"
            size={18}
            color={GREEN}
          />

          <Text style={styles.footerText}>
            Your password is encrypted and
            stored securely.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#F5F9FF'},
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 16,
  paddingBottom: 16,

  paddingTop:
    Platform.OS === 'android'
      ? StatusBar.currentHeight
      : 10,
},
  headerTitle:{fontSize:18,fontWeight:'700',color:'#0B1F3A'},
  infoCard:{backgroundColor:'#FFF',margin:16,borderRadius:16,padding:16,flexDirection:'row',gap:12},
  infoIcon:{width:48,height:48,borderRadius:24,backgroundColor:'#E8FAF0',justifyContent:'center',alignItems:'center'},
  infoTitle:{fontSize:14,fontWeight:'700',color:'#0B1F3A'},
  infoSub:{fontSize:12,color:'#6B7280',marginTop:4},
  card:{backgroundColor:'#FFF',marginHorizontal:16,marginBottom:16,padding:16,borderRadius:16},
  label:{fontSize:14,fontWeight:'600',marginBottom:8,color:'#0B1F3A',marginTop:10},
  inputBox:{flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:'#E5E7EB',borderRadius:12,paddingHorizontal:12,height:52},
  input:{flex:1,marginLeft:10},
  strengthLabel:{fontSize:12,color:'#6B7280',marginTop:10},
  strengthBar:{height:6,backgroundColor:'#E5E7EB',borderRadius:4,marginTop:8},
  strengthFill:{height:6,borderRadius:4},
  rulesTitle:{fontSize:14,fontWeight:'700',marginBottom:12},
  ruleRow:{flexDirection:'row',alignItems:'center',marginBottom:10},
  ruleText:{marginLeft:8,fontSize:13,color:'#6B7280'},
  button:{height:56,marginHorizontal:16,borderRadius:14,backgroundColor:GREEN,justifyContent:'center',alignItems:'center',flexDirection:'row',gap:8},
  buttonText:{color:'#FFF',fontWeight:'700',fontSize:16},
  footer:{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:20},
  footerText:{fontSize:12,color:'#6B7280',marginLeft:6},
});