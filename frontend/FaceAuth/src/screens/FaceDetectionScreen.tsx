import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';

export default function FaceDetectionScreen() {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faces, setFaces] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const captureAndDetect = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      
      // Capture photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo?.uri) {
        setCapturedImage(photo.uri);
        
        // Send to backend for face detection
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'detection.jpg',
        } as any);
        
        const response = await fetch('http://192.168.137.83:3000/detect-faces', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const result = await response.json();
        if (result.faces) {
          setFaces(result.faces);
        }
      }
    } catch (error) {
      console.error('Capture and detect error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setFaces([]);
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
            Camera access is required for face detection
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
          <Text style={styles.title}>Face Detection</Text>
          <Text style={styles.subtitle}>
            {capturedImage ? 'Tap Reset to capture again' : 'Tap Capture to detect faces'}
          </Text>
        </View>

        <View style={styles.cameraContainer}>
          {!capturedImage ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
            />
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
              
              {/* Face overlay boxes */}
              {faces.map((face, index) => (
                <View
                  key={index}
                  style={[
                    styles.faceBox,
                    {
                      left: face.x,
                      top: face.y,
                      width: face.width,
                      height: face.height,
                    }
                  ]}
                />
              ))}
            </View>
          )}
          
          {isProcessing && (
            <View style={styles.processingIndicator}>
              <Text style={styles.processingText}>Detecting faces...</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Text style={styles.infoText}>
            Faces detected: {faces.length}
          </Text>
          
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <PrimaryButton
                title={capturedImage ? "Reset" : "Capture"}
                onPress={capturedImage ? resetCapture : captureAndDetect}
                loading={isProcessing}
                icon={capturedImage ? "refresh" : "camera"}
              />
            </View>
            <View style={styles.buttonHalf}>
              <PrimaryButton
                title="Back"
                onPress={() => navigation.goBack()}
                variant="outline"
              />
            </View>
          </View>
        </View>
      </View>
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
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  processingIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  processingText: {
    ...typography.caption,
    color: colors.textInverse,
  },
  actions: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  buttonHalf: {
    flex: 1,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
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