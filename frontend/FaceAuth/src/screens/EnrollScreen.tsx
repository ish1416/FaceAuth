import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import CameraView, { CameraViewRef } from '../components/CameraView';
import PrimaryButton from '../components/PrimaryButton';

export default function EnrollScreen() {
  const cameraRef = useRef<CameraViewRef>(null);

  const handleCapture = async () => {
    const photo = await cameraRef.current?.capturePhoto();
    // TODO: Add API logic
    console.log('Photo captured:', photo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Face Enrollment</Text>
          <Text style={styles.subtitle}>
            Position your face within the frame and capture a clear photo for enrollment
          </Text>
        </View>

        <View style={styles.cameraSection}>
          <CameraView ref={cameraRef} />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton 
            title="Capture & Enroll" 
            onPress={handleCapture}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  cameraSection: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  buttonSection: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
});