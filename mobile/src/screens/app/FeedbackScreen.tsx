import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Typography } from '../../constants/typography';
import { useFeedbackStore } from '../../stores/feedbackStore';
import { useThemeStore } from '../../stores/themeStore';
import { FeedbackModule } from '../../types';

const MODULES: Array<{ id: FeedbackModule; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'vocabulary', label: 'Vocabulary' },
  { id: 'camera', label: 'Camera' },
  { id: 'listening', label: 'Listening' },
  { id: 'reading', label: 'Reading' },
  { id: 'grammar', label: 'Grammar' },
];

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { isSubmitting, submitFeedback } = useFeedbackStore();
  const [module, setModule] = useState<FeedbackModule>('general');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const remaining = useMemo(() => 2000 - message.length, [message.length]);
  const canSubmit = message.trim().length >= 5 && remaining >= 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Thiếu nội dung', 'Bạn hãy nhập feedback ít nhất 5 ký tự nhé.');
      return;
    }

    try {
      await submitFeedback({
        module,
        rating,
        message: message.trim(),
        platform: Platform.OS,
      });
      setSubmitted(true);
    } catch (error) {
      Alert.alert(
        'Không thể gửi feedback',
        error instanceof Error ? error.message : 'Vui lòng thử lại.',
      );
    }
  };

  if (submitted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View style={[styles.thankCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="heart-circle" size={58} color={colors.primary} />
          <Text style={[styles.thankTitle, { color: colors.text }]}>Cảm ơn bạn!</Text>
          <Text style={[styles.thankText, { color: colors.textMuted }]}>
            Feedback đã được lưu cho beta test. Những ghi chú kiểu này giúp LEXIS tốt lên rất nhanh.
          </Text>
          <Button title="Quay lại Home" color="green" onPress={() => navigation.goBack()} />
          <Button
            title="Gửi thêm feedback"
            variant="ghost"
            color="purple"
            onPress={() => {
              setSubmitted(false);
              setMessage('');
              setRating(5);
              setModule('general');
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={27} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Beta Feedback</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>REAL USER TEST</Text>
          <Text style={[styles.title, { color: colors.text }]}>Gửi góp ý nhanh</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Ghi lại chỗ bạn thấy khó dùng, lỗi, hoặc điều bạn muốn app làm tốt hơn.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={[styles.label, { color: colors.text }]}>Module</Text>
          <View style={styles.chips}>
            {MODULES.map(item => {
              const selected = module === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  onPress={() => setModule(item.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selected ? colors.accent : colors.surface,
                      borderColor: selected ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : colors.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(value => (
              <TouchableOpacity key={value} onPress={() => setRating(value)} activeOpacity={0.8}>
                <Ionicons
                  name={value <= rating ? 'star' : 'star-outline'}
                  size={34}
                  color={colors.xp}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <View style={styles.messageHeader}>
            <Text style={[styles.label, { color: colors.text }]}>Feedback</Text>
            <Text style={[styles.counter, { color: remaining < 0 ? colors.warning : colors.textMuted }]}>
              {remaining}
            </Text>
          </View>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            placeholder="Ví dụ: Mình không hiểu nút này để làm gì, hoặc phần nghe bị khó bấm..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.textArea,
              {
                backgroundColor: colors.surface,
                borderColor: remaining < 0 ? colors.warning : colors.border,
                color: colors.text,
              },
            ]}
          />
        </View>

        <Button
          title="Gửi feedback"
          color="green"
          loading={isSubmitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 14,
    paddingHorizontal: 18,
    paddingTop: 52,
  },
  headerButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 20,
  },
  headerSpacer: { width: 38 },
  content: {
    gap: 20,
    padding: 22,
    paddingBottom: 42,
  },
  hero: { gap: 8 },
  eyebrow: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 31,
    lineHeight: 37,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  block: { gap: 10 },
  label: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  messageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counter: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: 12,
  },
  textArea: {
    borderRadius: 18,
    borderWidth: 1,
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    minHeight: 170,
    padding: 16,
    lineHeight: 22,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  thankCard: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    padding: 22,
    width: '100%',
  },
  thankTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 25,
  },
  thankText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default FeedbackScreen;
