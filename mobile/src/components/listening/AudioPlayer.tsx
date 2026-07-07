import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer as ExpoAudioPlayer, AudioStatus } from 'expo-audio';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';

interface AudioPlayerProps {
  player: ExpoAudioPlayer;
  status: AudioStatus;
  rate: number;
  onRateChange: () => void;
}

const formatTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${Math.floor(safeSeconds % 60).toString().padStart(2, '0')}`;
};

export const AudioPlayer = ({
  player,
  status,
  rate,
  onRateChange,
}: AudioPlayerProps) => {
  const { colors } = useThemeStore();
  const duration = status.duration || 0;
  const progress = duration > 0 ? Math.min(status.currentTime / duration, 1) : 0;

  const seekFromPress = (event: GestureResponderEvent) => {
    if (!duration) return;
    const { locationX } = event.nativeEvent;
    const width = 260;
    void player.seekTo(Math.max(0, Math.min(locationX / width, 1)) * duration);
  };

  const togglePlayback = () => {
    if (!status.isLoaded) return;
    if (status.didJustFinish) {
      void player.seekTo(0).then(() => player.play());
    } else if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seekBy = (offset: number) => {
    void player.seekTo(Math.max(0, Math.min(status.currentTime + offset, duration)));
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.controls}>
        <TouchableOpacity accessibilityLabel="Tua lại 10 giây" onPress={() => seekBy(-10)}>
          <Ionicons name="play-back" size={25} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel={status.playing ? 'Tạm dừng' : 'Phát'}
          onPress={togglePlayback}
          style={[styles.playButton, { backgroundColor: colors.secondary }]}
        >
          {status.isBuffering ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons
              name={status.playing ? 'pause' : 'play'}
              size={30}
              color="#FFFFFF"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Tua tới 10 giây" onPress={() => seekBy(10)}>
          <Ionicons name="play-forward" size={25} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={seekFromPress}
        style={[styles.track, { backgroundColor: colors.border }]}
      >
        <View
          style={[
            styles.progress,
            { backgroundColor: colors.secondary, width: `${progress * 100}%` },
          ]}
        />
      </TouchableOpacity>

      <View style={styles.meta}>
        <Text style={[styles.time, { color: colors.textMuted }]}>
          {formatTime(status.currentTime)} / {formatTime(duration)}
        </Text>
        <TouchableOpacity
          accessibilityLabel="Đổi tốc độ phát"
          onPress={onRateChange}
          style={[styles.rate, { borderColor: colors.secondary }]}
        >
          <Text style={[styles.rateText, { color: colors.secondary }]}>{rate}x</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 18 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 30 },
  playButton: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  track: { width: 260, height: 8, borderRadius: 4, alignSelf: 'center', overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { fontFamily: Typography.fontFamily.mono, fontSize: 11 },
  rate: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  rateText: { fontFamily: Typography.fontFamily.bold, fontSize: 12 },
});
