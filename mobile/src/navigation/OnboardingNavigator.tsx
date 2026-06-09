import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingGoalScreen from '../screens/onboarding/OnboardingGoalScreen';
import OnboardingTargetScreen from '../screens/onboarding/OnboardingTargetScreen';
import PlacementTestScreen from '../screens/onboarding/PlacementTestScreen';
import PlacementResultScreen from '../screens/onboarding/PlacementResultScreen';

export type OnboardingStackParamList = {
  OnboardingGoal: undefined;
  OnboardingTarget: undefined;
  PlacementTest: undefined;
  PlacementResult: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <Stack.Screen name="OnboardingTarget" component={OnboardingTargetScreen} />
      <Stack.Screen name="PlacementTest" component={PlacementTestScreen} />
      <Stack.Screen name="PlacementResult" component={PlacementResultScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
