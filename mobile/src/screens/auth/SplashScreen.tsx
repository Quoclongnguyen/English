import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useThemeStore } from '../../stores/themeStore';

const SplashScreen = () => {
  const { colors } = useThemeStore();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.logoText, { color: colors.primary }]}>LEXIS</Text>
        <Text style={[styles.subtitle, { color: colors.text2 }]}>Master English Faster</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 48,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
});

export default SplashScreen;
