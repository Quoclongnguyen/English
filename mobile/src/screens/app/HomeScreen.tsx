import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../src/stores/authStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Button } from '../../../src/components/Button';
import { Badge } from '../../../src/components/Badge';
import { DailyGoalRing } from '../../../src/components/DailyGoalRing';
import { ModuleCard } from '../../../src/components/ModuleCard';
import { StreakBanner } from '../../../src/components/StreakBanner';
import { Typography } from '../../../src/constants/typography';

const MODULES = [
  {
    title: 'Vocabulary',
    description: 'Daily words, flashcards and review queue.',
    icon: 'book-outline',
    color: 'green',
  },
  {
    title: 'Camera',
    description: 'Scan real objects and save useful words.',
    icon: 'camera-outline',
    color: 'purple',
  },
  {
    title: 'Listening',
    description: 'Practice audio with transcript support.',
    icon: 'headset-outline',
    color: 'blue',
  },
  {
    title: 'Reading',
    description: 'Read bilingual lessons with AI explain.',
    icon: 'newspaper-outline',
    color: 'teal',
  },
  {
    title: 'Grammar',
    description: 'Learn patterns and try quick exercises.',
    icon: 'school-outline',
    color: 'orange',
  },
] as const;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { colors } = useThemeStore();
  const dailyTarget = user?.dailyTarget ?? 7;
  const currentLevel = user?.level ?? 'A1';
  const currentGoal = user?.goal ?? 'daily';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>LEXIS ENGLISH</Text>
          <Text style={[styles.title, { color: colors.text }]}>Hi, {user?.name || 'Learner'}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Keep today simple: learn, review, and build your streak.
          </Text>
        </View>
        <View style={styles.badges}>
          <Badge label={currentLevel} color="purple" />
          <Badge label={currentGoal} color="green" />
        </View>
      </View>

      <StreakBanner streak={user?.streak ?? 0} />

      <DailyGoalRing completed={0} target={dailyTarget} />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Learn hub</Text>
        <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>Choose a module</Text>
      </View>

      <View style={styles.moduleGrid}>
        {MODULES.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
            color={module.color}
            onPress={() => {
              if (module.title === 'Vocabulary') {
                navigation.navigate('DailyVocabScreen');
              } else if (module.title === 'Camera') {
                navigation.navigate('Tabs', { screen: 'Camera' });
              } else if (module.title === 'Listening') {
                navigation.navigate('ListeningPlayerScreen');
              } else if (module.title === 'Reading') {
                navigation.navigate('ReadingScreen');
              }
            }}
          />
        ))}
      </View>

      <Button title="Log Out" onPress={logout} variant="outline" color="dark" style={styles.logoutBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    gap: 16,
  },
  headerText: {
    gap: 6,
  },
  eyebrow: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionHeader: {
    gap: 4,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
  },
  sectionCaption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  logoutBtn: {
    marginTop: 4,
  },
});

export default HomeScreen;
