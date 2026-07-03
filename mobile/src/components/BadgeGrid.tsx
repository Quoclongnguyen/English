import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserBadge } from '../types';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface BadgeGridProps {
  badges: UserBadge[];
}

export const BadgeGrid = ({ badges }: BadgeGridProps) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.grid}>
      {badges.map((badge) => (
        <View key={badge.id} style={styles.item}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: badge.unlocked ? `${colors.badge}26` : colors.background,
                borderColor: badge.unlocked ? colors.badge : colors.border,
                opacity: badge.unlocked ? 1 : 0.55,
              },
            ]}
          >
            <Text style={styles.icon}>{badge.unlocked ? badge.icon : '🔒'}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
            {badge.name.replace(badge.icon, '').trim()}
          </Text>
          <Text style={[styles.progress, { color: colors.textMuted }]}>
            {Math.min(badge.currentProgress, badge.requirement.value)}/{badge.requirement.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  item: {
    width: '16.666%',
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 21,
  },
  name: {
    width: '94%',
    textAlign: 'center',
    fontFamily: Typography.fontFamily.bold,
    fontSize: 9,
  },
  progress: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 9,
  },
});
