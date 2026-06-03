import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from '@expo-google-fonts/space-mono';
import * as Font from 'expo-font';
import { useThemeStore } from './src/stores/themeStore';
import RootNavigator from './src/navigation';
import SplashScreen from './src/screens/auth/SplashScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { colors, theme } = useThemeStore();

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Nunito-Regular': Nunito_400Regular,
          'Nunito-SemiBold': Nunito_600SemiBold,
          'Nunito-Bold': Nunito_700Bold,
          'SpaceMono-Regular': SpaceMono_400Regular,
          'SpaceMono-Bold': SpaceMono_700Bold,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.warn('Font load error:', error);
      } finally {
        setFontsLoaded(true); // Luôn thoát SplashScreen dù font lỗi
      }

    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
