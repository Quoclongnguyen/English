import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface DailyGoalRingProps {
  completed: number;
  target: number;
}

export const DailyGoalRing = ({ completed, target }: DailyGoalRingProps) => {
  const { colors } = useThemeStore();
  const safeTarget = Math.max(target, 1);
  const progress = Math.min(completed / safeTarget, 1);
  const percent = Math.round(progress * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>Daily goal</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {completed}/{safeTarget} words today
        </Text>
      </View>

      <View style={[styles.ring, { borderColor: 'rgba(0,214,143,0.18)' }]}>
        <View style={[styles.ringFill, { borderColor: colors.primary, opacity: progress > 0 ? 1 : 0.35 }]}>
          <Text style={[styles.percent, { color: colors.text }]}>{percent}%</Text>
        </View>
      </View>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.bar, { backgroundColor: colors.primary, width: `${percent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  copy: {
    gap: 4,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
  },
  ring: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 58,
    borderWidth: 10,
    height: 116,
    justifyContent: 'center',
    marginTop: 18,
    width: 116,
  },
  ringFill: {
    alignItems: 'center',
    borderRadius: 46,
    borderWidth: 6,
    height: 92,
    justifyContent: 'center',
    width: 92,
  },
  percent: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
  },
  track: {
    borderRadius: 999,
    height: 8,
    marginTop: 18,
    overflow: 'hidden',
  },
  bar: {
    borderRadius: 999,
    height: '100%',
  },
});
