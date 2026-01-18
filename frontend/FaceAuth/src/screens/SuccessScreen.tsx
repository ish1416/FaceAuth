import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GovButton } from '../components/GovButton';
import { GovCard } from '../components/GovCard';
import { PoweredBy } from '../components/PoweredBy';
import { RootStackParamList, NavigationProps } from '../types/navigation';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'Success'>;

export default function SuccessScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<SuccessScreenRouteProp>();
  const { livenessScore } = route.params;

  const scaleAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Haptic feedback for success
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Success animation sequence
    scaleAnim.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 200 })
    );

    fadeAnim.value = withDelay(200, withTiming(1, { duration: 500 }));
    slideAnim.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnim.value }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const getScoreColor = (score: number) => {
    if (score >= 95) return colors.success;
    if (score >= 85) return colors.accent;
    return colors.warning;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 90) return 'Very Good';
    if (score >= 85) return 'Good';
    return 'Acceptable';
  };

  const verificationDetails = [
    {
      label: 'Liveness Score',
      value: `${livenessScore}%`,
      icon: 'chart-line' as const,
      color: getScoreColor(livenessScore)
    },
    {
      label: 'Verification Status',
      value: 'Verified',
      icon: 'check-circle' as const,
      color: colors.success
    },
    {
      label: 'Security Level',
      value: 'High',
      icon: 'shield-check' as const,
      color: colors.success
    },
    {
      label: 'Processing Time',
      value: '2.3 seconds',
      icon: 'clock-fast' as const,
      color: colors.info
    }
  ];

  const handleContinue = () => {
    navigation.navigate('Dashboard');
  };

  const handleNewCheck = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Animated.View style={[styles.checkmarkContainer, checkmarkStyle]}>
            <MaterialCommunityIcons
              name="check-circle"
              size={100}
              color={colors.success}
            />
          </Animated.View>
          
          <Text style={styles.title}>Verification Successful</Text>
          <Text style={styles.subtitle}>
            Your identity has been successfully verified
          </Text>
        </View>

        <Animated.View style={[styles.scoreSection, contentStyle]}>
          <GovCard
            title="Liveness Score"
            icon="chart-donut"
            iconColor={getScoreColor(livenessScore)}
            variant="elevated"
          >
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(livenessScore) }]}>
                {livenessScore}%
              </Text>
              <Text style={styles.scoreLabel}>
                {getScoreLabel(livenessScore)}
              </Text>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreProgress, 
                    { 
                      width: `${livenessScore}%`,
                      backgroundColor: getScoreColor(livenessScore)
                    }
                  ]} 
                />
              </View>
            </View>
          </GovCard>
        </Animated.View>

        <Animated.View style={[styles.detailsSection, contentStyle]}>
          <Text style={styles.sectionTitle}>Verification Details</Text>
          <View style={styles.detailsGrid}>
            {verificationDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: detail.color + '15' }]}>
                  <MaterialCommunityIcons
                    name={detail.icon}
                    size={20}
                    color={detail.color}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={[styles.detailValue, { color: detail.color }]}>
                    {detail.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.securitySection, contentStyle]}>
          <GovCard
            title="Security Confirmation"
            icon="shield-check"
            iconColor={colors.success}
            variant="outlined"
          >
            <View style={styles.securityContent}>
              <Text style={styles.securityText}>
                ✓ Live human face detected{'\n'}
                ✓ No spoofing attempts found{'\n'}
                ✓ All liveness checks passed{'\n'}
                ✓ Biometric data processed securely
              </Text>
              <View style={styles.timestamp}>
                <MaterialCommunityIcons
                  name="clock"
                  size={14}
                  color={colors.textTertiary}
                />
                <Text style={styles.timestampText}>
                  Verified on {new Date().toLocaleString()}
                </Text>
              </View>
            </View>
          </GovCard>
        </Animated.View>

        <Animated.View style={[styles.actions, contentStyle]}>
          <GovButton
            onPress={handleContinue}
            icon="view-dashboard"
          >
            Go to Dashboard
          </GovButton>
          
          <GovButton
            onPress={handleNewCheck}
            variant="outline"
            icon="refresh"
          >
            New Liveness Check
          </GovButton>
        </Animated.View>

        {/* YellowSense Branding */}
        <Animated.View style={[styles.brandingSection, contentStyle]}>
          <PoweredBy variant="government" position="footer" />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkmarkContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  scoreSection: {
    marginBottom: spacing.xl,
  },
  scoreContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreValue: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  detailsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  detailsGrid: {
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  securitySection: {
    marginBottom: spacing.xl,
  },
  securityContent: {
    gap: spacing.md,
  },
  securityText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  timestampText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  actions: {
    gap: spacing.md,
  },
  brandingSection: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: spacing.lg,
  },
});