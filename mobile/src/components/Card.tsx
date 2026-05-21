import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../stores/themeStore';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'surface' | 'surface2' | 'surface3' | 'outlined';
}

export const Card = ({ children, style, variant = 'surface' }: CardProps) => {
  const { colors } = useThemeStore();

  const getBackgroundColor = () => {
    if (variant === 'surface') return colors.surface;
    if (variant === 'surface2') return colors.surface2; 
    if (variant === 'surface3') return '#2A2A3A'; 
    if (variant === 'outlined') return 'transparent';
    return colors.surface;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: colors.border,
          borderWidth: 1, // Most cards in the design have a subtle 1px border
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24, // --r from Figma
    padding: 20,
    overflow: 'hidden',
  },
});
