import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface ScanningOverlayProps {
  isScanning: boolean;
  height: number;
}

export default function ScanningOverlay({ isScanning, height }: ScanningOverlayProps) {
  const scanLinePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isScanning) {
      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLinePosition, {
            toValue: height - 4,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(scanLinePosition, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      scanAnimation.start();
      return () => scanAnimation.stop();
    } else {
      scanLinePosition.setValue(0);
    }
  }, [isScanning, height]);

  if (!isScanning) return null;

  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      <Animated.View 
        style={[
          styles.scanLine,
          {
            transform: [{ translateY: scanLinePosition }],
          },
        ]} 
      />
      <View style={styles.scanGradient} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scanLine: {
    height: 4,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  scanGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 115, 232, 0.1)',
  },
});