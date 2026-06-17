import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigator from "./BottomTabNavigator";

import NotificationSettingsScreen from "../screens/settings/NotificationSettingsScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import AboutAppScreen from "../screens/settings/AboutAppScreen";

import NotificationCenterScreen from "../screens/notifications/NotificationCenterScreen";

import MedicationCalendarScreen from "../screens/adherence/MedicationCalendarScreen";

import ProfileScreen from "../screens/profile/ProfileScreen";
import MedicalProfileScreen from "../screens/profile/MedicalProfileScreen";

import CaregiversScreen from "../screens/caregiver/CaregiverScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
      />

      {/* Settings */}
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      <Stack.Screen
        name="AboutApp"
        component={AboutAppScreen}
      />

      {/* Notifications */}
      <Stack.Screen
        name="Notifications"
        component={NotificationCenterScreen}
      />

      {/* Adherence */}
      <Stack.Screen
        name="MedicationCalendar"
        component={MedicationCalendarScreen}
      />

      {/* Profile */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="MedicalProfile"
        component={MedicalProfileScreen}
      />

      {/* Caregivers */}
      <Stack.Screen
        name="Caregivers"
        component={CaregiversScreen}
      />
    </Stack.Navigator>
  );
}