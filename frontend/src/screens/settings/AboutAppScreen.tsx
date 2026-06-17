import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GREEN = '#289254';

export default function AboutAppScreen() {
  const navigation = useNavigation<any>();

  const openPrivacyPolicy = () => {
    Linking.openURL(
      'https://meditrack.ai/privacy-policy'
    );
  };

  const openTerms = () => {
    Linking.openURL(
      'https://meditrack.ai/terms-and-conditions'
    );
  };

  const openSupport = () => {
    Linking.openURL(
      'mailto:meditrack.support@gmail.com'
    );
  };

  const openCommunity = () => {
    Linking.openURL(
      'https://meditrack.ai/community'
    );
  };

  const MenuItem = ({
    icon,
    iconColor,
    bgColor,
    title,
    subtitle,
    onPress,
  }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: bgColor },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={iconColor}
        />
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#9CA3AF"
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

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
          About MediTrack
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Card */}

        <View style={styles.logoCard}>
          <Image
            source={require('../../../assets/logoM.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appName}>
            MediTrack AI
          </Text>

          <Text style={styles.tagline}>
            Track. Take. Thrive.
          </Text>

          <Text style={styles.description}>
            Your smart companion for
            medicine reminders, health
            tracking and better adherence.
          </Text>

          <View style={styles.versionBadge}>
            <Text
              style={styles.versionText}
            >
              Version 1.0.0 (Build 1)
            </Text>
          </View>
        </View>

        {/* Menu Card */}

        <View style={styles.menuCard}>
          <MenuItem
            icon="shield-checkmark-outline"
            iconColor={GREEN}
            bgColor="#E8FAF0"
            title="Privacy Policy"
            subtitle="How we collect, use and protect your data"
            onPress={openPrivacyPolicy}
          />

          <MenuItem
            icon="document-text-outline"
            iconColor="#3B82F6"
            bgColor="#DBEAFE"
            title="Terms & Conditions"
            subtitle="Terms of use and service agreement"
            onPress={openTerms}
          />

          <MenuItem
            icon="headset-outline"
            iconColor="#8B5CF6"
            bgColor="#EDE9FE"
            title="Contact Support"
            subtitle="Get help or report an issue"
            onPress={openSupport}
          />

          <MenuItem
            icon="people-outline"
            iconColor="#F59E0B"
            bgColor="#FEF3C7"
            title="MediTrack Community"
            subtitle="Join our community and stay updated"
            onPress={openCommunity}
          />
        </View>

        {/* Footer Card */}

        <View style={styles.footerCard}>
          <Ionicons
            name="heart"
            size={20}
            color={GREEN}
          />

          <Text style={styles.footerText}>
            Developed with love by
          </Text>

          <Text style={styles.teamName}>
            MediTrack Team
          </Text>

          <Text style={styles.copyright}>
            © 2026 MediTrack AI
          </Text>

          <Text style={styles.copyright}>
            All rights reserved.
          </Text>

          <Text style={styles.email}>
            meditrack.support@gmail.com
          </Text>

          <Text style={styles.website}>
            www.meditrack.ai
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },

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

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  logoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  logo: {
    width: 160,
    height: 160,
  },

  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0B1F3A',
    marginTop: 10,
  },

  tagline: {
    fontSize: 15,
    color: GREEN,
    fontWeight: '600',
    marginTop: 4,
  },

  description: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 12,
    lineHeight: 20,
  },

  versionBadge: {
    marginTop: 18,
    backgroundColor: '#E8FAF0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },

  versionText: {
    color: GREEN,
    fontWeight: '700',
    fontSize: 12,
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,

    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContent: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1F3A',
  },

  menuSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },

  footerCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  footerText: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 13,
  },

  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B1F3A',
    marginTop: 4,
  },

  copyright: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },

  email: {
    marginTop: 14,
    color: GREEN,
    fontWeight: '600',
    fontSize: 13,
  },

  website: {
    marginTop: 6,
    color: GREEN,
    fontWeight: '600',
    fontSize: 13,
  },
});