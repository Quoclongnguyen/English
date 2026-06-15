import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

type ModuleColor = 'green' | 'purple' | 'blue' | 'teal' | 'orange';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: ModuleColor;
  onPress: () => void;
}

const ACCENTS: Record<ModuleColor, { bg: string; border: string; text: string }> = {
  green: { bg: 'rgba(0,214,143,0.12)', border: 'rgba(0,214,143,0.25)', text: '#00D68F' },
  purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#8B5CF6' },
  blue: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#3B82F6' },
  teal: { bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)', text: '#14B8A6' },
  orange: { bg: 'rgba(255,107,53,0.12)', border: 'rgba(255,107,53,0.25)', text: '#FF6B35' },
};

export const ModuleCard = ({ title, description, icon, color, onPress }: ModuleCardProps) => {
  const { colors } = useThemeStore();
  const accent = ACCENTS[color];

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.iconBox, { backgroundColor: accent.bg, borderColor: accent.border }]}>
        <Ionicons name={icon} size={24} color={accent.text} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.description, { color: colors.textMuted }]} numberOfLines={2}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    gap: 10,
    minHeight: 164,
    padding: 16,
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 17,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
});
