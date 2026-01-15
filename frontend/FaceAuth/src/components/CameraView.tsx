import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import GlassCard from './GlassCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface CameraViewRef {
  capturePhoto: () => Promise<any>;
}

interface CameraViewProps {
  // Add any additional props if needed
}

const CameraView = forwardRef<CameraViewRef, CameraViewProps>((props, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<ExpoCameraView | null>(null);

  useImperativeHandle(ref, () => ({
    capturePhoto: async () => {
      if (cameraRef) {
        return await cameraRef.takePictureAsync();
      }
      return null;
    },
  }));

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <GlassCard>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Loading camera...</Text>
        </View>
      </GlassCard>
    );
  }

  if (!permission.granted) {
    return (
      <GlassCard>
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Camera permission required</Text>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <View style={styles.cameraContainer}>
        <ExpoCameraView
          ref={setCameraRef}
          style={styles.camera}
          facing="front"
        />
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  cameraContainer: {
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  camera: {
    flex: 1,
  },
  messageContainer: {
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default CameraView;