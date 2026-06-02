import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import * as Font from 'expo-font';
import { useThemeStore } from './src/stores/themeStore';
import RootNavigator from './src/navigation';
import SplashScreen from './src/screens/auth/SplashScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { colors, theme } = useThemeStore();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Nunito-Regular': require('@expo-google-fonts/nunito/Nunito_400Regular.ttf'),
        'Nunito-SemiBold': require('@expo-google-fonts/nunito/Nunito_600SemiBold.ttf'),
        'Nunito-Bold': require('@expo-google-fonts/nunito/Nunito_700Bold.ttf'),
        'SpaceMono-Regular': require('@expo-google-fonts/space-mono/SpaceMono_400Regular.ttf'),
        'SpaceMono-Bold': require('@expo-google-fonts/space-mono/SpaceMono_700Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
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
