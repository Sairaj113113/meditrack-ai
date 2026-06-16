import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import Onboarding1Screen from "../screens/onboarding/Onboarding1Screen";
import Onboarding2Screen from "../screens/onboarding/Onboarding2Screen";
import Onboarding3Screen from "../screens/onboarding/Onboarding3Screen";
import Onboarding4Screen from "../screens/onboarding/Onboarding4Screen";
import Onboarding5Screen from "../screens/onboarding/Onboarding5Screen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OtpVerificationScreen from "../screens/auth/OtpVerificationScreen";


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Stack.Screen name="Onboarding4" component={Onboarding4Screen} />
      <Stack.Screen name="Onboarding5" component={Onboarding5Screen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    
    </Stack.Navigator>
  );
}