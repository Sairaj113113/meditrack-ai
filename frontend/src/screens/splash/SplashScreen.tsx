import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VIDEO_WIDTH = width;
const VIDEO_HEIGHT = (width * 3) / 2;

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 2000;
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(p + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  if (status.isLoaded && status.didJustFinish) {
    navigation.replace('Onboarding1');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.videoWrapper}>
        <Video
          source={require('../../../assets/animations/splash-logo.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          isMuted
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Initializing App...</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWrapper: {
    width: width,
    height: Math.min(VIDEO_HEIGHT, height * 0.85),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  video: {
    width: width,
    height: Math.min(VIDEO_HEIGHT, height * 0.85),
  },
  progressSection: {
    position: 'absolute',
    bottom: 50,
    width: width - 48,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C2C2A',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2F80ED',
    borderRadius: 3,
  },
  progressPercent: {
    textAlign: 'right',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});