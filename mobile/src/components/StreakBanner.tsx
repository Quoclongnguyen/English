import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface StreakBannerProps {
  streak: number;
}

export const StreakBanner = ({ streak }: StreakBannerProps) => {
  const { colors } = useThemeStore();
  const streakLabel = streak > 0 ? `${streak} day streak` : 'Start your streak';

  return (
    <View style={[styles.container, { backgroundColor: colors.warning }]}>
      <View style={styles.iconBox}>
        <Ionicons name="flame" size={28} color="#FFFFFF" />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{streakLabel}</Text>
        <Text style={styles.description}>Learn a little today to keep the fire going.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 14,
    padding: 18,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  label: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.bold,
    fontSize: 22,
  },
  description: {
    color: 'rgba(255,255,255,0.86)',
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
});
