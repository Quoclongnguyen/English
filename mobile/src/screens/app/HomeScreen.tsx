import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../../stores/authStore';
import { useThemeStore } from '../../../stores/themeStore';
import { Button } from '../../../components/Button';
import { Typography } from '../../../constants/typography';

const HomeScreen = () => {
  const { user, logout } = useAuthStore();
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome, {user?.name || 'User'}!</Text>
      <Text style={[styles.subtitle, { color: colors.text2 }]}>This is the placeholder Home Screen.</Text>
      
      <Button 
        title="Log Out" 
        onPress={logout} 
        variant="outline"
        color="dark"
        style={styles.logoutBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    marginBottom: 32,
  },
  logoutBtn: {
    minWidth: 200,
  },
});

export default HomeScreen;
