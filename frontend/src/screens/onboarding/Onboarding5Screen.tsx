import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Onboarding5Screen() {
  const navigation = useNavigation<any>();

  const handleGetStarted = async () => {
  try {
    await AsyncStorage.setItem(
      'onboarding_completed',
      'true'
    );

    navigation.replace('Login');
  } catch (error) {
    console.log(
      'Error saving onboarding status:',
      error
    );

    navigation.replace('Login');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboarding-5.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          AI-Powered.{'\n'}
          Smarter Care.
        </Text>

        <Text style={styles.subtitle}>
          Scan prescriptions, get AI-powered medicine setup,{'\n'}
          smart suggestions, and interaction checks{'\n'}
          for safer and smarter care.
        </Text>
      </View>

      <View style={styles.pagination}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === 4 && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>
            Get Started →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  illustration: {
    width: width,
    height: height * 0.62,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#17325C',
    textAlign: 'center',
    lineHeight: 38,
  },

  subtitle: {
    marginTop: 14,
    fontSize: 15,
    color: '#7A8499',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },

  paginationDotActive: {
    width: 22,
    backgroundColor: '#2F80ED',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },

  backButton: {
    width: 110,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  backText: {
    color: '#2F80ED',
    fontWeight: '600',
    fontSize: 15,
  },

  getStartedButton: {
    width: 160,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  getStartedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});