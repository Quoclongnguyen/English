import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

const RootNavigator = () => {
  const { isAuthenticated, isInitializing, loadFromStorage } = useAuthStore();
  const {
    isCompleted: isOnboardingCompleted,
    isInitializing: isOnboardingInitializing,
    loadFromStorage: loadOnboardingFromStorage,
  } = useOnboardingStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOnboardingFromStorage();
    }
  }, [isAuthenticated, loadOnboardingFromStorage]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthNavigator />}
      {isAuthenticated && isOnboardingInitializing && <SplashScreen />}
      {isAuthenticated && !isOnboardingInitializing && !isOnboardingCompleted && <OnboardingNavigator />}
      {isAuthenticated && !isOnboardingInitializing && isOnboardingCompleted && <MainNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;

