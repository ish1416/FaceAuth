import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
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
      setIsLoading(false);
    }
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
            disabled={isLoading}
          />
        </View>
      </ScrollView>
      
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