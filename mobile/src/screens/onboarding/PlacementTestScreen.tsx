import React, { useMemo, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Typography } from '../../constants/typography';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useThemeStore } from '../../stores/themeStore';
import { PlacementLevel, PlacementQuestion } from '../../types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'PlacementTest'>;

const QUESTIONS: PlacementQuestion[] = [
  {
    id: 'q1',
    question: 'I ___ a student.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am',
  },
  {
    id: 'q2',
    question: 'She usually ___ coffee in the morning.',
    options: ['drink', 'drinks', 'drinking', 'drank'],
    correctAnswer: 'drinks',
  },
  {
    id: 'q3',
    question: 'We have lived here ___ 2022.',
    options: ['for', 'since', 'during', 'from'],
    correctAnswer: 'since',
  },
  {
    id: 'q4',
    question: 'If I had more time, I ___ a new language.',
    options: ['learn', 'will learn', 'would learn', 'learned'],
    correctAnswer: 'would learn',
  },
  {
    id: 'q5',
    question: 'The proposal was approved, ___ several concerns were raised.',
    options: ['because', 'although', 'unless', 'therefore'],
    correctAnswer: 'although',
  },
];

const getLevelFromScore = (score: number): PlacementLevel => {
  if (score <= 1) return 'A1';
  if (score === 2) return 'A2';
  if (score <= 4) return 'B1';
  return 'B2';
};

const PlacementTestScreen = ({ navigation }: Props) => {
  const { colors } = useThemeStore();
  const { setLevel } = useOnboardingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = QUESTIONS[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const score = useMemo(() => {
    return QUESTIONS.reduce((total, question) => {
      return answers[question.id] === question.correctAnswer ? total + 1 : total;
    }, 0);
  }, [answers]);

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      setLevel(getLevelFromScore(score));
      navigation.navigate('PlacementResult');
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Badge label={`Step 3 of 4 - ${currentIndex + 1}/${QUESTIONS.length}`} color="orange" />
      <Text style={[styles.title, { color: colors.text }]}>Placement Test</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Chon dap an dung nhat. Cau hoi se kho dan de uoc tinh trinh do ban dau.
      </Text>

      <Card style={styles.questionCard}>
        <Text style={[styles.question, { color: colors.text }]}>{currentQuestion.question}</Text>
      </Card>

      <View style={styles.options}>
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.85}
              onPress={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option }))}
            >
              <Card
                style={[
                  styles.answerCard,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? 'rgba(0,214,143,0.12)' : colors.surface,
                  },
                ]}
              >
                <Text style={[styles.answer, { color: colors.text }]}>{option}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Button
          title="Quay lai"
          onPress={() => {
            if (currentIndex === 0) navigation.goBack();
            else setCurrentIndex((index) => index - 1);
          }}
          variant="outline"
          color="light"
        />
        <Button title={isLastQuestion ? 'Xem ket qua' : 'Tiep tuc'} onPress={handleNext} disabled={!selectedAnswer} />
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
  questionCard: {
    marginTop: 28,
    minHeight: 120,
    justifyContent: 'center',
  },
  question: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  options: {
    gap: 12,
    marginTop: 20,
  },
  answerCard: {
    paddingVertical: 16,
  },
  answer: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 17,
  },
  actions: {
    gap: 12,
    marginTop: 'auto',
    paddingTop: 24,
  },
});

export default PlacementTestScreen;
