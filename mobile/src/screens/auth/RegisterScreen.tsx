import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
  const { colors, theme } = useThemeStore();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSocialRegister = (provider: 'Google' | 'Apple') => {
    Alert.alert(`${provider} Sign Up`, `Đăng ký ${provider} sẽ hoạt động sau khi cấu hình OAuth.`);
  };

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
      <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}>
        <View style={styles.hero}>
          <View style={styles.heroPurple} />
          <View style={styles.heroTeal} />
          <View style={styles.heroOrbLeft} />
          <View style={styles.heroOrbRight} />
          <View style={styles.heroContent}>
            <Text style={styles.logo}>LEXIS</Text>
            <Text style={styles.heroText}>Học từ vựng qua ngữ cảnh thực tế</Text>
            <Text style={styles.heroText}>AI giải thích theo cách bạn hiểu</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Tạo tài khoản</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Bắt đầu lộ trình tiếng Anh của bạn</Text>
          </View>

          {!showEmailForm ? (
            <View style={styles.authOptions}>
              <TouchableOpacity
                onPress={() => handleSocialRegister('Apple')}
                activeOpacity={0.82}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme === 'dark' ? '#ECE9F7' : '#1B1733',
                    borderColor: theme === 'dark' ? '#ECE9F7' : '#1B1733',
                  },
                ]}
              >
                <FontAwesome name="apple" size={20} color={theme === 'dark' ? '#1B1733' : '#FFFFFF'} />
                <Text style={[styles.socialButtonText, { color: theme === 'dark' ? '#1B1733' : '#FFFFFF' }]}>
                  Tiếp tục với Apple
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSocialRegister('Google')}
                activeOpacity={0.82}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <FontAwesome name="google" size={18} color="#4285F4" />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Tiếp tục với Google</Text>
              </TouchableOpacity>
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textMuted }]}>hoặc</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>
              <Button
                title="Đăng ký bằng Email"
                onPress={() => setShowEmailForm(true)}
                icon={<FontAwesome name="envelope" size={18} color="#082014" />}
              />
            </View>
          ) : (
            <>
              <Input
                label="Full Name"
                placeholder="Nhập tên của bạn"
                autoCapitalize="words"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
              />
              <Input
                label="Email"
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
              />
              <Input
                label="Password"
                placeholder="Tạo mật khẩu"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                error={error}
              />

              <Button title="Đăng ký" onPress={handleRegister} loading={isLoading} style={styles.registerButton} />
              <Button
                title="Quay lại lựa chọn"
                onPress={() => setShowEmailForm(false)}
                variant="ghost"
                color="dark"
              />
            </>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>Đã có tài khoản? </Text>
            <Text
              style={[styles.footerLink, { color: colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              Đăng nhập
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
  },
  hero: {
    height: 420,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 28,
  },
  heroPurple: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#7C5CF6',
  },
  heroTeal: {
    bottom: 0,
    height: 210,
    position: 'absolute',
    right: -40,
    transform: [{ rotate: '-18deg' }],
    width: 230,
    backgroundColor: '#00D68F',
    opacity: 0.86,
  },
  heroOrbLeft: {
    position: 'absolute',
    top: -26,
    left: -18,
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroOrbRight: {
    position: 'absolute',
    top: 44,
    right: 18,
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroContent: {
    marginBottom: 22,
  },
  header: {
    marginBottom: 22,
  },
  logo: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.bold,
    fontSize: 60,
    letterSpacing: 0,
    marginBottom: 10,
  },
  heroText: {
    color: '#FFFFFF',
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.92,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  authOptions: {
    gap: 12,
  },
  socialButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 20,
  },
  socialButtonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 16,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 13,
  },
  registerButton: {
    marginTop: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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
