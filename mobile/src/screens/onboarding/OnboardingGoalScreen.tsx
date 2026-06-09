import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Typography } from '../../constants/typography';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useThemeStore } from '../../stores/themeStore';
import { LearningGoal } from '../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingGoal'>;

const GOALS: Array<{
  value: LearningGoal;
  title: string;
  description: string;
  icon: string;
  color: 'green' | 'orange' | 'purple' | 'blue';
}> = [
  { value: 'ielts', title: 'IELTS', description: 'Hoc tu vung va ky nang cho muc tieu IELTS.', icon: '🎓', color: 'blue' },
  { value: 'toeic', title: 'TOEIC', description: 'Tap trung ngu canh cong viec va bai thi TOEIC.', icon: '💼', color: 'green' },
  { value: 'business', title: 'Business', description: 'Giao tiep tu tin trong moi truong cong viec.', icon: '📈', color: 'purple' },
  { value: 'daily', title: 'Giao tiep', description: 'Tu vung hang ngay de noi chuyen tu nhien hon.', icon: '💬', color: 'orange' },
];

const OnboardingGoalScreen = ({ navigation }: Props) => {
  const { colors } = useThemeStore();
  const { goal, setGoal } = useOnboardingStore();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Badge label="Step 1 of 4" color="purple" />
      <Text style={[styles.title, { color: colors.text }]}>Ban hoc tieng Anh de lam gi?</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        LEXIS se dung muc tieu nay de goi y tu vung va lo trinh phu hop.
      </Text>

      <View style={styles.options}>
        {GOALS.map((item) => {
          const isSelected = goal === item.value;

          return (
            <TouchableOpacity key={item.value} activeOpacity={0.85} onPress={() => setGoal(item.value)}>
              <Card
                style={[
                  styles.optionCard,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? 'rgba(0,214,143,0.12)' : colors.surface,
                  },
                ]}
              >
                <Text style={styles.optionIcon}>{item.icon}</Text>
                <View style={styles.optionContent}>
                  <Badge label={item.title} color={item.color} />
                  <Text style={[styles.optionText, { color: colors.textMuted }]}>{item.description}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title="Tiep tuc"
        onPress={() => navigation.navigate('OnboardingTarget')}
        disabled={!goal}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  optionCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    minHeight: 104,
  },
  optionIcon: {
    fontSize: 34,
  },
  optionContent: {
    flex: 1,
    gap: 10,
  },
  optionText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    marginTop: 28,
  },
});

export default OnboardingGoalScreen;
