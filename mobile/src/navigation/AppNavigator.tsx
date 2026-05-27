import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Types
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  OnboardingGoal: undefined;
  OnboardingTarget: undefined;
  PlacementTest: undefined;
  PlacementResult: { score: number };
};

export type MainTabParamList = {
  Home: undefined;
  VocabBank: undefined;
  Camera: undefined;
  Learn: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder screens — sẽ được thay thế dần
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { OnboardingGoalScreen } from '../screens/auth/OnboardingGoalScreen';
import { OnboardingTargetScreen } from '../screens/auth/OnboardingTargetScreen';
import { PlacementTestScreen } from '../screens/auth/PlacementTestScreen';
import { PlacementResultScreen } from '../screens/auth/PlacementResultScreen';

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <AuthStack.Screen name="OnboardingTarget" component={OnboardingTargetScreen} />
      <AuthStack.Screen name="PlacementTest" component={PlacementTestScreen} />
      <AuthStack.Screen name="PlacementResult" component={PlacementResultScreen} />
    </AuthStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        {/* Main tab navigator sẽ được thêm sau khi có auth */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
