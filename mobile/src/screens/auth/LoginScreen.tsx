import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { Typography } from '../../../src/constants/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../src/navigation/AuthNavigator';
import { useNavigation } from '@react-navigation/native';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');

    try {
      await login({ email, password });
      // On success, the root navigator will automatically switch to AppNavigator
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(''); }}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            error={error}
          />

          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>Don't have an account? </Text>
            <Text
              style={[styles.footerLink, { color: colors.primary }]}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
  },
  form: {
    gap: 8,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 14,
  },
  footerLink: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
  },
});

export default LoginScreen;
