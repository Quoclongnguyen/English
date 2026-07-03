import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgeGrid } from '../../components/BadgeGrid';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { WeeklyChart } from '../../components/WeeklyChart';
import { Typography } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useUserStore } from '../../stores/userStore';

const XP_PER_LEVEL = 500;
const FREEZE_COST = 150;

const ProfileScreen = () => {
  const { user } = useAuthStore();
  const { colors } = useThemeStore();
  const {
    stats,
    loading,
    refreshing,
    buyingFreeze,
    error,
    loadUserStats,
    refreshUserData,
    buyStreakFreeze,
  } = useUserStore();

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  const handleBuyFreeze = useCallback(async () => {
    try {
      const message = await buyStreakFreeze();
      Alert.alert('Streak đã an toàn!', message);
    } catch (purchaseError) {
      Alert.alert(
        'Chưa thể mua Streak Freeze',
        purchaseError instanceof Error ? purchaseError.message : 'Vui lòng thử lại.',
      );
    }
  }, [buyStreakFreeze]);

  if (loading && !stats) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="cloud-offline-outline" size={52} color={colors.warning} />
        <Text style={[styles.errorTitle, { color: colors.text }]}>Không tải được hồ sơ</Text>
        <Text style={[styles.errorMessage, { color: colors.textMuted }]}>{error}</Text>
        <Button title="Thử lại" onPress={loadUserStats} />
      </View>
    );
  }

  const levelXP = stats.totalXP % XP_PER_LEVEL;
  const xpProgress = Math.min(levelXP / XP_PER_LEVEL, 1);
  const unlockedBadges = stats.badges.filter((badge) => badge.unlocked).length;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshUserData}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: `${colors.accent}26` }]}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {(user?.name || 'L').trim().charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.profileCopy}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>HỒ SƠ HỌC TẬP</Text>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'LEXIS Learner'}</Text>
          <View style={[styles.levelPill, { backgroundColor: `${colors.accent}26` }]}>
            <Ionicons name="sparkles" size={13} color={colors.accent} />
            <Text style={[styles.levelText, { color: colors.accent }]}>LEVEL {stats.level}</Text>
          </View>
        </View>
      </View>

      {error ? (
        <View style={[styles.inlineError, { backgroundColor: `${colors.warning}1F` }]}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
          <Text style={[styles.inlineErrorText, { color: colors.warning }]}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.statRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>{stats.currentStreak}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>ngày streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>🧊</Text>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{stats.streakFreezes}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>freeze</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statEmoji}>📚</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.vocabulary.total}</Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>từ đã học</Text>
        </Card>
      </View>

      <Card>
        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tiến độ XP</Text>
            <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>
              {levelXP}/{XP_PER_LEVEL} XP đến Level {stats.level + 1}
            </Text>
          </View>
          <Text style={[styles.totalXP, { color: colors.xp }]}>{stats.totalXP} XP</Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.background }]}>
          <View style={[styles.progressFill, { width: `${xpProgress * 100}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.mastered, { color: colors.textMuted }]}>
          Đã thành thạo {stats.vocabulary.mastered}/{stats.vocabulary.total} từ
        </Text>
      </Card>

      <Card>
        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tuần này</Text>
            <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>XP từ Thứ 2 đến Chủ nhật</Text>
          </View>
          <Ionicons name="stats-chart" size={24} color={colors.secondary} />
        </View>
        <WeeklyChart data={stats.weeklyProgress} />
      </Card>

      <Card>
        <View style={styles.sectionHeading}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Huy hiệu</Text>
            <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>Mỗi cột mốc đều đáng nhớ</Text>
          </View>
          <Text style={[styles.badgeCount, { color: colors.badge }]}>
            {unlockedBadges}/{stats.badges.length}
          </Text>
        </View>
        <BadgeGrid badges={stats.badges} />
      </Card>

      <Card style={[styles.shopCard, { borderColor: `${colors.secondary}66` }]}>
        <View style={styles.shopTop}>
          <View style={[styles.shopIcon, { backgroundColor: `${colors.secondary}26` }]}>
            <Text style={styles.shopEmoji}>🧊</Text>
          </View>
          <View style={styles.shopCopy}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Streak Freeze</Text>
            <Text style={[styles.sectionCaption, { color: colors.textMuted }]}>
              Bảo vệ chuỗi học khi bạn lỡ nghỉ một ngày.
            </Text>
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>XP có thể dùng</Text>
          <Text style={[styles.balanceValue, { color: colors.xp }]}>{stats.availableXP} XP</Text>
        </View>
        <Button
          title={`Mua với ${FREEZE_COST} XP`}
          onPress={handleBuyFreeze}
          color="blue"
          loading={buyingFreeze}
          disabled={stats.availableXP < FREEZE_COST}
          icon={<Ionicons name="shield-checkmark-outline" size={19} color="#FFFFFF" />}
        />
        {stats.availableXP < FREEZE_COST ? (
          <Text style={[styles.shopHint, { color: colors.warning }]}>
            Cần thêm {FREEZE_COST - stats.availableXP} XP để mua.
          </Text>
        ) : null}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: 16, padding: 20, paddingTop: 24, paddingBottom: 36 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 32 },
  loadingText: { fontFamily: Typography.fontFamily.regular, fontSize: 15 },
  errorTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 22 },
  errorMessage: { fontFamily: Typography.fontFamily.regular, fontSize: 15, textAlign: 'center' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: { width: 78, height: 78, borderRadius: 26, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  avatarText: { color: '#FFFFFF', fontFamily: Typography.fontFamily.bold, fontSize: 34 },
  profileCopy: { flex: 1, alignItems: 'flex-start', gap: 4 },
  eyebrow: { fontFamily: Typography.fontFamily.mono, fontSize: 11, letterSpacing: 1 },
  name: { fontFamily: Typography.fontFamily.bold, fontSize: 27 },
  levelPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  levelText: { fontFamily: Typography.fontFamily.mono, fontSize: 11 },
  inlineError: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14 },
  inlineErrorText: { flex: 1, fontFamily: Typography.fontFamily.regular, fontSize: 13 },
  statRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, alignItems: 'center', paddingHorizontal: 6, paddingVertical: 14 },
  statEmoji: { fontSize: 23 },
  statValue: { fontFamily: Typography.fontFamily.bold, fontSize: 24 },
  statLabel: { fontFamily: Typography.fontFamily.regular, fontSize: 11, textAlign: 'center' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 },
  sectionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 19 },
  sectionCaption: { fontFamily: Typography.fontFamily.regular, fontSize: 12, lineHeight: 18 },
  totalXP: { fontFamily: Typography.fontFamily.mono, fontSize: 14 },
  progressTrack: { height: 12, borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  mastered: { marginTop: 10, fontFamily: Typography.fontFamily.regular, fontSize: 12 },
  badgeCount: { fontFamily: Typography.fontFamily.mono, fontSize: 14 },
  shopCard: { gap: 14 },
  shopTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shopIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  shopEmoji: { fontSize: 27 },
  shopCopy: { flex: 1 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceLabel: { fontFamily: Typography.fontFamily.regular, fontSize: 13 },
  balanceValue: { fontFamily: Typography.fontFamily.mono, fontSize: 14 },
  shopHint: { fontFamily: Typography.fontFamily.regular, fontSize: 12, textAlign: 'center' },
});

export default ProfileScreen;
