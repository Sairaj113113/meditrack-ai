import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Onboarding4Screen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/onboarding-4.png')}
        style={styles.fullImage}
        resizeMode="contain"
      />

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === 3 && styles.paginationDotActive,
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
            onPress={() => navigation.navigate('Onboarding5')}
          >
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  fullImage: {
    width: width,
    height: height * 0.82,
    alignSelf: 'center',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 35,
    left: 24,
    right: 24,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
    fontSize: 15,
    fontWeight: '600',
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
    fontSize: 15,
    fontWeight: '600',
  },
});