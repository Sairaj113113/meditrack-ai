import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import MedicinesScreen from "../screens/medicine/MedicinesScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#289254",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          height: 72,
          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },

        tabBarIcon: ({ color }) => {
          let iconName: any;

          switch (route.name) {
            case "Medicine":
              iconName = "medkit";
              break;

            case "Doctors":
              iconName = "medical";
              break;

            case "Dashboard":
              iconName = "home";
              break;

            case "AI":
              iconName = "sparkles";
              break;

            case "Settings":
              iconName = "settings";
              break;
          }

          if (route.name === "Dashboard") {
            return (
              <View
                style={{
                  marginTop: -24,
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  backgroundColor: "#289254",
                  justifyContent: "center",
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Ionicons
                  name="home"
                  size={26}
                  color="#FFFFFF"
                />
              </View>
            );
          }

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
     <Tab.Screen
  name="Medicine"
  component={MedicinesScreen}
/>

      <Tab.Screen
        name="Doctors"
        component={ReportsScreen}
      />

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "",
        }}
      />

      <Tab.Screen
        name="AI"
        component={SettingsScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}