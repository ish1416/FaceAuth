import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface FaceDetectionOverlayProps {
  faces: Array<{ x: number; y: number; width: number; height: number }>;
  containerWidth: number;
  containerHeight: number;
}

export default function FaceDetectionOverlay({ faces, containerWidth, containerHeight }: FaceDetectionOverlayProps) {
  if (faces.length === 0) return null;

  return (
    <View style={[styles.overlay, { width: containerWidth, height: containerHeight }]}>
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
        >
          <Text style={styles.faceLabel}>Face {index + 1}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 119, 190, 0.1)',
  },
  faceLabel: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    top: -20,
    left: 0,
  },
});