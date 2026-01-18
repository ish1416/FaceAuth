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
import { RootStackParamList, NavigationProps } from '../types/navigation';

type FailureScreenRouteProp = RouteProp<RootStackParamList, 'Failure'>;

export default function FailureScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<FailureScreenRouteProp>();
  const { reason } = route.params;

  const scaleAnim = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  useEffect(() => {
    // Haptic feedback for error
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Error animation sequence
    scaleAnim.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(1, { duration: 200 })
    );

    fadeAnim.value = withDelay(200, withTiming(1, { duration: 500 }));
    slideAnim.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }));
  }, []);

  const errorIconStyle = useAnimatedStyle(() => {
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

  const troubleshootingTips = [
    {
      icon: 'lightbulb-on' as const,
      title: 'Improve Lighting',
      description: 'Ensure your face is well-lit and clearly visible'
    },
    {
      icon: 'glasses' as const,
      title: 'Remove Accessories',
      description: 'Remove glasses, hats, or masks if possible'
    },
    {
      icon: 'face-recognition' as const,
      title: 'Position Correctly',
      description: 'Keep your face centered in the oval guide'
    },
    {
      icon: 'motion-sensor' as const,
      title: 'Follow Instructions',
      description: 'Complete all liveness steps slowly and naturally'
    }
  ];

  const commonIssues = [
    'Poor lighting conditions',
    'Face not properly positioned',
    'Movement too fast during steps',
    'Camera obstruction or blur',
    'Network connectivity issues'
  ];

  const handleRetry = () => {
    navigation.navigate('FaceInstructions');
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  const handleGetHelp = () => {
    navigation.navigate('Help');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Animated.View style={[styles.errorContainer, errorIconStyle]}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={100}
              color={colors.error}
            />
          </Animated.View>
          
          <Text style={styles.title}>Verification Failed</Text>
          <Text style={styles.subtitle}>
            We couldn't verify your liveness. Please try again.
          </Text>
        </View>

        <Animated.View style={[styles.reasonSection, contentStyle]}>
          <GovCard
            title="What went wrong?"
            icon="information"
            iconColor={colors.error}
            variant="outlined"
          >
            <Text style={styles.reasonText}>{reason}</Text>
          </GovCard>
        </Animated.View>

        <Animated.View style={[styles.tipsSection, contentStyle]}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>
          <View style={styles.tipsGrid}>
            {troubleshootingTips.map((tip, index) => (
              <GovCard
                key={index}
                title={tip.title}
                subtitle={tip.description}
                icon={tip.icon}
                iconColor={colors.info}
                variant="default"
              />
            ))}
          </View>
        </Animated.View>

        <Animated.View style={[styles.issuesSection, contentStyle]}>
          <GovCard
            title="Common Issues"
            icon="help-circle"
            iconColor={colors.warning}
            variant="outlined"
          >
            <View style={styles.issuesList}>
              {commonIssues.map((issue, index) => (
                <View key={index} style={styles.issueItem}>
                  <MaterialCommunityIcons
                    name="circle-small"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.issueText}>{issue}</Text>
                </View>
              ))}
            </View>
          </GovCard>
        </Animated.View>

        <Animated.View style={[styles.supportSection, contentStyle]}>
          <GovCard
            title="Need Additional Help?"
            icon="headset"
            iconColor={colors.primary}
            variant="elevated"
          >
            <Text style={styles.supportText}>
              If you continue to experience issues, our support team is here to help. 
              Check our FAQ section or contact technical support.
            </Text>
          </GovCard>
        </Animated.View>

        <Animated.View style={[styles.actions, contentStyle]}>
          <GovButton
            onPress={handleRetry}
            icon="refresh"
          >
            Try Again
          </GovButton>
          
          <View style={styles.secondaryActions}>
            <GovButton
              onPress={handleGetHelp}
              variant="outline"
              icon="help-circle"
              size="medium"
            >
              Get Help
            </GovButton>
            
            <GovButton
              onPress={handleGoHome}
              variant="outline"
              icon="home"
              size="medium"
            >
              Go Home
            </GovButton>
          </View>
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
  errorContainer: {
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
  reasonSection: {
    marginBottom: spacing.xl,
  },
  reasonText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tipsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipsGrid: {
    gap: spacing.md,
  },
  issuesSection: {
    marginBottom: spacing.xl,
  },
  issuesList: {
    gap: spacing.sm,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  issueText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  supportSection: {
    marginBottom: spacing.xl,
  },
  supportText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});