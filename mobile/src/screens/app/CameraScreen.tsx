import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Typography } from '../../constants/typography';
import { useThemeStore } from '../../stores/themeStore';
import { useVocabStore } from '../../stores/vocabStore';

const CameraScreen = () => {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const { colors } = useThemeStore();
  const { isScanning, scanPhoto } = useVocabStore();

  const analyzeImage = async (uri: string, base64?: string | null, mimeType = 'image/jpeg') => {
    if (!base64) {
      Alert.alert('Không đọc được ảnh', 'Vui lòng chọn hoặc chụp lại ảnh.');
      return;
    }
    try {
      await scanPhoto(base64, mimeType, uri);
      navigation.navigate('CameraChecklistScreen');
    } catch (error) {
      Alert.alert('Không thể quét ảnh', error instanceof Error ? error.message : 'Vui lòng thử lại.');
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady || isScanning) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
    if (photo) await analyzeImage(photo.uri, photo.base64);
  };

  const chooseFromGallery = async () => {
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!galleryPermission.granted) {
      Alert.alert('Cần quyền truy cập ảnh', 'Hãy cho phép LEXIS truy cập thư viện ảnh.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      await analyzeImage(asset.uri, asset.base64, asset.mimeType || 'image/jpeg');
    }
  };

  if (!permission) {
    return <View style={[styles.screen, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permission, { backgroundColor: colors.background }]}>
        <View style={[styles.permissionIcon, { backgroundColor: `${colors.accent}26` }]}>
          <Ionicons name="camera-outline" size={46} color={colors.accent} />
        </View>
        <Text style={[styles.permissionTitle, { color: colors.text }]}>Mở camera để học từ thế giới thật</Text>
        <Text style={[styles.permissionText, { color: colors.textMuted }]}>
          Chụp đồ vật quanh bạn, LEXIS sẽ tìm các từ tiếng Anh hữu ích.
        </Text>
        <Button title="Cho phép camera" onPress={requestPermission} color="purple" />
        <Button title="Chọn ảnh từ thư viện" onPress={chooseFromGallery} variant="outline" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" onCameraReady={() => setCameraReady(true)} />
      <View style={styles.overlay}>
        <View style={styles.topCopy}>
          <Text style={styles.title}>Camera Vocabulary</Text>
          <Text style={styles.subtitle}>Đặt đồ vật vào trong khung</Text>
        </View>
        <View style={styles.focusFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            accessibilityLabel="Chọn ảnh từ thư viện"
            onPress={chooseFromGallery}
            disabled={isScanning}
            style={styles.sideButton}
          >
            <Ionicons name="images-outline" size={27} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel="Chụp ảnh"
            onPress={takePhoto}
            disabled={!cameraReady || isScanning}
            style={[styles.captureOuter, (!cameraReady || isScanning) && styles.disabled]}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <View style={styles.sidePlaceholder} />
        </View>
      </View>
      {isScanning ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00D68F" />
          <Text style={styles.loadingTitle}>Gemini đang nhìn bức ảnh...</Text>
          <Text style={styles.loadingText}>Đang tìm những từ hay nhất cho bạn</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F14' },
  permission: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32 },
  permissionIcon: { width: 88, height: 88, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  permissionTitle: { fontFamily: Typography.fontFamily.bold, fontSize: 25, textAlign: 'center' },
  permissionText: { fontFamily: Typography.fontFamily.regular, fontSize: 15, lineHeight: 23, textAlign: 'center', marginBottom: 8 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 24, paddingTop: 60, paddingBottom: 38, backgroundColor: 'rgba(0,0,0,0.2)' },
  topCopy: { alignItems: 'center', gap: 4 },
  title: { color: '#FFFFFF', fontFamily: Typography.fontFamily.bold, fontSize: 24 },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontFamily: Typography.fontFamily.regular, fontSize: 14 },
  focusFrame: { alignSelf: 'center', width: '88%', aspectRatio: 0.85 },
  corner: { position: 'absolute', width: 42, height: 42, borderColor: '#00D68F' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 18 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 18 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 18 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 18 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  sideButton: { width: 54, height: 54, borderRadius: 18, backgroundColor: 'rgba(15,15,20,0.65)', alignItems: 'center', justifyContent: 'center' },
  sidePlaceholder: { width: 54 },
  captureOuter: { width: 82, height: 82, borderRadius: 41, borderWidth: 5, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FFFFFF' },
  disabled: { opacity: 0.5 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,15,20,0.9)', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  loadingTitle: { color: '#FFFFFF', fontFamily: Typography.fontFamily.bold, fontSize: 21, marginTop: 8 },
  loadingText: { color: '#A1A1AA', fontFamily: Typography.fontFamily.regular, fontSize: 14 },
});

export default CameraScreen;
