import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Typography } from '../../constants/typography';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useThemeStore } from '../../stores/themeStore';
import { DailyTarget } from '../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingTarget'>;

const TARGETS: Array<{ value: DailyTarget; label: string; description: string }> = [
  { value: 5, label: '5 tu', description: 'Nhe nhang, de giu thoi quen moi ngay.' },
  { value: 7, label: '7 tu', description: 'Can bang giua toc do va do ben.' },
  { value: 10, label: '10 tu', description: 'Tang toc khi ban co nhieu thoi gian hon.' },
];

const OnboardingTargetScreen = ({ navigation }: Props) => {
  const { colors } = useThemeStore();
  const { dailyTarget, setDailyTarget } = useOnboardingStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Badge label="Step 2 of 4" color="green" />
      <Text style={[styles.title, { color: colors.text }]}>Moi ngay ban muon hoc bao nhieu tu?</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Muc tieu co the dieu chinh sau, hien tai dung de tao daily vocab.
      </Text>

      <View style={styles.options}>
        {TARGETS.map((item) => {
          const isSelected = dailyTarget === item.value;

          return (
            <TouchableOpacity key={item.value} activeOpacity={0.85} onPress={() => setDailyTarget(item.value)}>
              <Card
                style={[
                  styles.targetCard,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? 'rgba(0,214,143,0.12)' : colors.surface,
                  },
                ]}
              >
                <Text style={[styles.targetValue, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.targetDescription, { color: colors.textMuted }]}>{item.description}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button title="Quay lai" onPress={() => navigation.goBack()} variant="outline" color="light" />
        <Button
          title="Lam bai test"
          onPress={() => navigation.navigate('PlacementTest')}
          disabled={!dailyTarget}
        />
      </View>
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
  options: {
    gap: 14,
    marginTop: 28,
  },
  targetCard: {
    gap: 8,
  },
  targetValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
  },
  targetDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
    paddingTop: 24,
  },
});

export default OnboardingTargetScreen;
