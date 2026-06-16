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

export default function Onboarding1Screen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Top Dots */}
      <View style={styles.dotsTopLeft}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.dot} />
        ))}
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/onboarding-1.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Never Miss{'\n'}a Medicine
        </Text>

        <Text style={styles.subtitle}>
          Get timely reminders and stay{'\n'}
          on track with every dose.
        </Text>
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === 0 && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.navigate('Onboarding2')}
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
    backgroundColor: '#F5F9FF',
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  dotsTopLeft: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },

  imageContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
},

  illustration: {
  width: width * 1.05,
  height: height * 0.62,
},

  textContainer: {
  alignItems: 'center',
  marginBottom: 45,
},

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0B1F3A',
    textAlign: 'center',
    lineHeight: 38,
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 24,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },

  paginationDotActive: {
    width: 24,
    backgroundColor: '#2F80ED',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2F80ED',
    backgroundColor: '#FFFFFF',
  },

  skipText: {
    color: '#2F80ED',
    fontSize: 15,
    fontWeight: '600',
  },

  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#2F80ED',
  },

  nextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});