import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { useThemeStore } from '../stores/themeStore';
import { Typography } from '../constants/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.warning : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.warning }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  error: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 6,
  },
});
