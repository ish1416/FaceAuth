import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function ProcessingScreen() {
  const rotateAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);
  const fadeAnim = useSharedValue(0.5);

  useEffect(() => {
    // Rotation animation
    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );

    // Scale animation
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Fade animation
    fadeAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateAnim.value}deg` }],
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const processingSteps = [
    'Analyzing facial features...',
    'Detecting liveness signals...',
    'Verifying authenticity...',
    'Calculating confidence score...',
    'Finalizing results...'
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.iconContainer, scaleStyle]}>
            <Animated.View style={rotateStyle}>
              <MaterialCommunityIcons
                name="shield-sync"
                size={80}
                color={colors.accent}
              />
            </Animated.View>
          </Animated.View>
          
          <Text style={styles.title}>Processing Verification</Text>
          <Text style={styles.subtitle}>
            Analyzing your liveness data with advanced AI
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, fadeStyle]} />
            </View>
          </View>
          
          <Animated.Text style={[styles.progressText, fadeStyle]}>
            Please wait while we verify your identity...
          </Animated.Text>
        </View>

        <View style={styles.stepsContainer}>
          {processingSteps.map((step, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.stepItem,
                fadeStyle,
                { 
                  opacity: fadeAnim.value * (0.3 + (index * 0.15))
                }
              ]}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color={colors.success}
              />
              <Text style={styles.stepText}>{step}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.securityNotice}>
          <View style={styles.securityIcon}>
            <MaterialCommunityIcons
              name="shield-check"
              size={24}
              color={colors.success}
            />
          </View>
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityTitle}>Secure Processing</Text>
            <Text style={styles.securityText}>
              Your biometric data is processed locally and never stored or transmitted
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    ...typography.h1,
    color: colors.textInverse,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    paddingHorizontal: spacing.md,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressContainer: {
    width: '80%',
    height: 6,
  },
  progressTrack: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.overlayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  stepsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.overlayLight,
    padding: spacing.md,
    borderRadius: 12,
    width: '100%',
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  securityText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.8,
    lineHeight: 18,
  },
});