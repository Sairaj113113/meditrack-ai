import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Onboarding2Screen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboarding-2.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Manage Your{'\n'}Health Better
        </Text>

        <Text style={styles.subtitle}>
          Organize your medicines by disease{'\n'}
          and follow your treatment with ease.
        </Text>
      </View>

      <View style={styles.pagination}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === 1 && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Onboarding3')}
        >
          <Text style={styles.nextText}>Next →</Text>
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

  skipButton: {
    width: 110,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  skipText: {
    color: '#2F80ED',
    fontWeight: '600',
    fontSize: 15,
  },

  nextButton: {
    width: 140,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});