import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { spacing } from '../theme/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
}

export default function GlassCard({ children, intensity = 80 }: GlassCardProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={intensity} style={styles.blurView}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  blurView: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});