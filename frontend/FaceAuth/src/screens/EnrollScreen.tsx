import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';
import CameraViewComponent from '../components/CameraView';
import LoadingOverlay from '../components/LoadingOverlay';
import CustomModal from '../components/CustomModal';
import { enrollFace } from '../services/api';

export default function EnrollScreen() {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });

  const showModal = (title: string, message: string, type: 'success' | 'error') => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      
      if (photo?.uri) {
        await enrollFace(photo.uri);
        showModal(
          'Enrollment Successful',
          'Your face has been successfully enrolled.',
          'success'
        );
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Verify');
        }, 1500);
      }
    } catch (error) {
      showModal(
        'Enrollment Failed',
        'Unable to enroll face. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setLoading(true);
        await enrollFace(result.assets[0].uri);
        showModal(
          'Enrollment Successful',
          'Your face has been successfully enrolled.',
          'success'
        );
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Verify');
        }, 1500);
      } catch (error) {
        showModal(
          'Enrollment Failed',
          'Unable to enroll face. Please try again.',
          'error'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.textTertiary} />
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.error} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            Camera access is required for face enrollment
          </Text>
          <PrimaryButton title="Grant Permission" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Face Enrollment</Text>
        </View>

        <CameraViewComponent cameraRef={cameraRef} facing="front" />

        <View style={styles.actions}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <PrimaryButton
                title="Capture"
                onPress={handleCapture}
                loading={loading}
                icon="camera"
              />
            </View>
            <View style={styles.buttonHalf}>
              <PrimaryButton
                title="Gallery"
                onPress={handleGallery}
                variant="secondary"
                icon="image"
              />
            </View>
          </View>
          <PrimaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </View>

      <LoadingOverlay visible={loading} message="Enrolling face..." />
      <CustomModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonHalf: {
    flex: 1,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  permissionMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  permissionText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
