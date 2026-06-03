import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  color?: 'green' | 'purple' | 'orange' | 'blue' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  color = 'green',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const { colors, theme } = useThemeStore();

  const getBackgroundColor = () => {
    if (variant === 'outline' || variant === 'ghost') return 'transparent';
    if (color === 'green') return colors.primary;
    if (color === 'purple') return colors.accent;
    if (color === 'orange') return colors.warning;
    if (color === 'blue') return colors.secondary;
    if (color === 'light') return theme === 'dark' ? colors.text : colors.surface;
    if (color === 'dark') return theme === 'dark' ? colors.surface : colors.text;
    return colors.primary;
  };

  const getTextColor = () => {
    if (variant === 'primary') {
      if (color === 'green') return '#082014'; // Dark text on green for contrast
      if (color === 'light') return theme === 'dark' ? colors.background : colors.text;
      if (color === 'dark') return theme === 'dark' ? colors.text : colors.background;
      return '#FFFFFF';
    }
    
    // Outline / Ghost variants use the color itself for text
    if (color === 'green') return colors.primary;
    if (color === 'purple') return colors.accent;
    if (color === 'orange') return colors.warning;
    if (color === 'blue') return colors.secondary;
    return colors.text;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return getTextColor();
    if (variant === 'primary' && color === 'light' && theme === 'light') return colors.border;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[size],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' || (color === 'light' && theme === 'light') ? 1.5 : 0,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text style={[
            styles.text,
            styles[`text_${size}` as keyof typeof styles],
            { color: getTextColor() },
            textStyle,
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16, // --rsm
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sm: { paddingVertical: 10, paddingHorizontal: 16 },
  md: { paddingVertical: 15, paddingHorizontal: 24 },
  lg: { paddingVertical: 18, paddingHorizontal: 32 },
  text: {
    fontFamily: Typography.fontFamily.bold,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  text_sm: { fontSize: 14 },
  text_md: { fontSize: 16 },
  text_lg: { fontSize: 18 },
});
