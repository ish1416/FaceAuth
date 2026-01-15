import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import CameraView, { CameraViewRef } from '../components/CameraView';
import PrimaryButton from '../components/PrimaryButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { enrollFace } from '../services/api';

export default function EnrollScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef<CameraViewRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = async () => {
    try {
      // Start scanning animation
      cameraRef.current?.startScanning();
      setIsLoading(true);
      
      const photo = await cameraRef.current?.capturePhoto();
      if (!photo) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        return;
      }

      await enrollFace(photo.uri);
      
      Alert.alert(
        'Success!', 
        'Face enrolled successfully. You can now verify your identity.',
        [{ text: 'Continue', onPress: () => navigation.navigate('Verify' as never) }]
      );
    } catch (error) {
      Alert.alert(
        'Enrollment Failed',
        'Unable to enroll your face. Please ensure your face is clearly visible and try again.'
      );
    } finally {
      // Stop scanning animation
      cameraRef.current?.stopScanning();
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <LoadingOverlay 
        visible={isLoading} 
        message="Analyzing face..." 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  cameraSection: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    minHeight: 400,
  },
  buttonSection: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
});