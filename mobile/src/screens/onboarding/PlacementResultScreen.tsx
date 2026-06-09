import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Typography } from '../../constants/typography';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useThemeStore } from '../../stores/themeStore';

const LEVEL_COPY = {
  A1: 'Bat dau voi tu vung nen tang va cau giao tiep ngan.',
  A2: 'Cung co ngu phap co ban va mo rong tu vung quen thuoc.',
  B1: 'Xay dung do troi chay qua chu de hoc tap, cong viec va doi song.',
  B2: 'Tang do chinh xac, hoc cum tu va ngu canh nang cao hon.',
};

const PlacementResultScreen = () => {
  const { colors } = useThemeStore();
  const { goal, dailyTarget, level, completeOnboarding } = useOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentLevel = level ?? 'A1';

  const handleComplete = async () => {
    setErrorMessage('');
    setIsSaving(true);

    try {
      await completeOnboarding();
    } catch {
      setErrorMessage('Chua luu duoc ket qua. Vui long thu lai.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Badge label="Step 4 of 4" color="blue" />
      <Text style={[styles.title, { color: colors.text }]}>Lo trinh cua ban da san sang</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        LEXIS se bat dau tu trinh do hien tai va tao thoi quen hoc moi ngay.
      </Text>

      <Card style={styles.resultCard}>
        <Text style={[styles.levelLabel, { color: colors.textMuted }]}>Trinh do goi y</Text>
        <Text style={[styles.level, { color: colors.primary }]}>{currentLevel}</Text>
        <Text style={[styles.levelDescription, { color: colors.textMuted }]}>{LEVEL_COPY[currentLevel]}</Text>
      </Card>

      <View style={styles.summary}>
        <Badge label={`Goal: ${goal ?? 'daily'}`} color="purple" />
        <Badge label={`${dailyTarget ?? 5} words/day`} color="green" />
      </View>

      {errorMessage ? <Text style={[styles.error, { color: colors.warning }]}>{errorMessage}</Text> : null}

      <Button title="Bat dau hoc" onPress={handleComplete} loading={isSaving} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
    marginTop: 20,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  resultCard: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 36,
  },
  levelLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  level: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 64,
    lineHeight: 76,
    marginTop: 8,
  },
  levelDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  button: {
    marginTop: 'auto',
  },
  error: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default PlacementResultScreen;
