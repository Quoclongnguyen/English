import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface BadgeProps {
  label: string;
  icon?: string | React.ReactNode;
  color?: 'green' | 'orange' | 'purple' | 'blue' | 'yellow' | 'pink' | 'teal' | 'gray';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge = ({ label, icon, color = 'green', style, textStyle }: BadgeProps) => {
  const { colors, theme } = useThemeStore();

  const getColors = () => {
    const isDark = theme === 'dark';
    switch (color) {
      case 'green': return { bg: isDark ? 'rgba(0,214,143,0.12)' : 'rgba(0,214,143,0.15)', text: colors.primary, border: 'rgba(0,214,143,0.25)' };
      case 'orange': return { bg: isDark ? 'rgba(255,107,53,0.12)' : 'rgba(255,107,53,0.15)', text: colors.warning, border: 'rgba(255,107,53,0.25)' };
      case 'purple': return { bg: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.15)', text: colors.accent, border: 'rgba(139,92,246,0.25)' };
      case 'blue': return { bg: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.15)', text: colors.secondary, border: 'rgba(59,130,246,0.25)' };
      case 'yellow': return { bg: isDark ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.15)', text: colors.xp, border: 'rgba(251,191,36,0.25)' };
      case 'pink': return { bg: isDark ? 'rgba(244,114,182,0.12)' : 'rgba(244,114,182,0.15)', text: colors.badge, border: 'rgba(244,114,182,0.25)' };
      case 'teal': return { bg: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(20,184,166,0.15)', text: '#14B8A6', border: 'rgba(20,184,166,0.25)' };
      case 'gray': return { bg: colors.surface, text: colors.text, border: colors.border };
      default: return { bg: isDark ? 'rgba(0,214,143,0.12)' : 'rgba(0,214,143,0.15)', text: colors.primary, border: 'rgba(0,214,143,0.25)' };
    }
  };

  const c = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      {icon && (
        typeof icon === 'string' ? <Text style={[styles.icon, { color: c.text }]}>{icon}</Text> : icon
      )}
      <Text style={[styles.text, { color: c.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20, // Pill shape
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  icon: {
    fontSize: 10,
  },
  text: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
