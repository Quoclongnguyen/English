import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WeeklyProgressDay } from '../types';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface WeeklyChartProps {
  data: WeeklyProgressDay[];
}

const MAX_BAR_HEIGHT = 108;

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const { colors } = useThemeStore();
  const maxXP = Math.max(...data.map((day) => day.xpEarned), 1);

  return (
    <View style={styles.chart}>
      {data.map((day) => {
        const height = day.xpEarned ? Math.max((day.xpEarned / maxXP) * MAX_BAR_HEIGHT, 10) : 4;
        return (
          <View key={`${day.dayName}-${day.date}`} style={styles.column}>
            <Text style={[styles.value, { color: day.studied ? colors.xp : colors.textMuted }]}>
              {day.xpEarned}
            </Text>
            <View style={[styles.track, { backgroundColor: colors.background }]}>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: day.studied ? colors.primary : colors.border,
                  },
                ]}
              />
            </View>
            <Text style={[styles.label, { color: colors.textMuted }]}>{day.dayName}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 154,
    paddingTop: 4,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
  },
  track: {
    width: 18,
    height: MAX_BAR_HEIGHT,
    borderRadius: 9,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 9,
  },
  label: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 11,
  },
});
