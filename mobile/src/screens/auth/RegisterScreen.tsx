import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { useThemeStore } from '../../../src/stores/themeStore';
import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { Typography } from '../../../src/constants/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../src/navigation/AuthNavigator';
import { useNavigation } from '@react-navigation/native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');

    try {
      await register({ name, email, password });
      // On success, root navigator switches to AppNavigator
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Start your English journey today</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your name"
            autoCapitalize="words"
            value={name}
            onChangeText={(text) => { setName(text); setError(''); }}
          />
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
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            error={error}
          />

          <Button
            title="Sign Up"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text }]}>Already have an account? </Text>
            <Text
              style={[styles.footerLink, { color: colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              Log In
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
  registerButton: {
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

export default RegisterScreen;
