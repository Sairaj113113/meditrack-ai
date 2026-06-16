import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import PasswordInput from '../../components/auth/PasswordInput';
import AuthService from '../../services/authService';

export default function RegisterScreen({
  navigation,
}: any) {
  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [mobile, setMobile] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (!firstName.trim()) {
      return Alert.alert(
        'Validation',
        'Enter First Name'
      );
    }

    if (!lastName.trim()) {
      return Alert.alert(
        'Validation',
        'Enter Last Name'
      );
    }

    if (!email.trim()) {
      return Alert.alert(
        'Validation',
        'Enter Email Address'
      );
    }

    if (!mobile.trim()) {
      return Alert.alert(
        'Validation',
        'Enter Mobile Number'
      );
    }

    if (password.length < 8) {
      return Alert.alert(
        'Validation',
        'Password must be at least 8 characters'
      );
    }

    if (password !== confirmPassword) {
      return Alert.alert(
        'Validation',
        'Passwords do not match'
      );
    }

    if (!acceptedTerms) {
      return Alert.alert(
        'Validation',
        'Please accept Terms & Privacy Policy'
      );
    }

    try {
      setLoading(true);

      const response =
        await AuthService.register({
          firstName,
          lastName,
          email,
          mobile,
          password,
        });

     navigation.navigate('OtpVerification', {
  userId: response.data.userId,
  email,
});
    } catch (error: any) {
  console.log('REGISTER ERROR =>', error);
  console.log('REGISTER RESPONSE =>', error?.response?.data);

  Alert.alert(
    'Registration Failed',
    JSON.stringify(error?.response?.data || error.message)
  );
}finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.logo}>
        MediTrack AI
      </Text>

      <Text style={styles.title}>
        Create Your Account
      </Text>

      <Text style={styles.subtitle}>
        Let's get started with your
        better health journey.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <PasswordInput
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ height: 16 }} />

      <PasswordInput
        value={confirmPassword}
        onChangeText={
          setConfirmPassword
        }
      />

      <TouchableOpacity
        style={styles.termsRow}
        onPress={() =>
          setAcceptedTerms(
            !acceptedTerms
          )
        }
      >
        <View
          style={[
            styles.checkbox,
            acceptedTerms &&
              styles.checkboxActive,
          ]}
        />

        <Text style={styles.termsText}>
          I agree to Terms of Service
          and Privacy Policy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text
          style={styles.registerText}
        >
          {loading
            ? 'Creating Account...'
            : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Login'
          )
        }
      >
        <Text style={styles.loginLink}>
          Already have an account?
          Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },

  logo: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700',
    color: '#2F80ED',
    marginBottom: 24,
  },

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#2F80ED',
    borderRadius: 4,
    marginRight: 10,
  },

  checkboxActive: {
    backgroundColor: '#2F80ED',
  },

  termsText: {
    color: '#6B7280',
    flex: 1,
    fontSize: 13,
  },

  registerButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  registerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  loginLink: {
    textAlign: 'center',
    marginTop: 24,
    color: '#2F80ED',
    fontWeight: '600',
  },
});