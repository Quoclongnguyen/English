import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { useThemeStore } from './src/stores/themeStore';
import { Button } from './src/components/Button';
import { Card } from './src/components/Card';
import { Badge } from './src/components/Badge';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { colors, theme, toggleTheme } = useThemeStore();

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
    return null; // Or a splash screen
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>LEXIS English</Text>
        <Text style={[styles.subtitle, { color: colors.text2 }]}>UI Components Showcase</Text>
        
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Typography & Badges</Text>
          <View style={styles.badgeRow}>
            <Badge label="B1 Intermediate" color="blue" />
            <Badge label="Mastered" color="green" icon="✓" />
            <Badge label="+15 XP" color="yellow" />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Buttons</Text>
          <View style={styles.buttonRow}>
            <Button title="Primary" onPress={() => {}} />
            <Button title="Outline" variant="outline" onPress={() => {}} />
            <Button title="Purple" color="purple" onPress={() => {}} />
          </View>
        </Card>

        <Button 
          title={`Toggle Theme (${theme})`} 
          variant="outline" 
          color="light" 
          onPress={toggleTheme} 
          style={{ marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonRow: {
    gap: 12,
  },
});
