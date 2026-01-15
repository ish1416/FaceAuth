import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';

interface RouteParams {
  result: {
    success: boolean;
    distance: number;
  };
}

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { result } = route.params as RouteParams;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scoreCountAnim = useRef(new Animated.Value(0)).current;

  const isSuccess = result.success;
  const statusColor = isSuccess ? colors.success : colors.error;
  const statusText = isSuccess ? 'Verification Successful' : 'Verification Failed';
  
  // Convert distance to percentage score (lower distance = higher confidence)
  const confidenceScore = Math.max(0, Math.min(100, Math.round((1 - result.distance) * 100)));
  const matchPercentage = isSuccess ? confidenceScore : Math.max(0, confidenceScore - 20);
  
  const explanationText = isSuccess 
    ? 'Your identity has been successfully verified. Access granted.'
    : 'Identity verification failed. Please ensure proper lighting and face positioning.';

  useEffect(() => {
    // Trigger haptic feedback based on result
    Haptics.notificationAsync(
      isSuccess 
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Progress bar animation after entrance
      Animated.timing(progressAnim, {
        toValue: matchPercentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
      
      // Score counting animation
      Animated.timing(scoreCountAnim, {
        toValue: matchPercentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return '#FF9500'; // Orange
    return colors.error;
  };

  const handleRestart = () => {
    navigation.navigate('Landing' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <GlassCard>
          <View style={styles.resultContainer}>
            <View style={styles.statusSection}>
              <Animated.View 
                style={[
                  styles.statusIcon, 
                  { 
                    backgroundColor: statusColor,
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              >
                <IconButton 
                  icon={isSuccess ? 'check' : 'close'} 
                  size={32} 
                  iconColor={colors.surface}
                />
              </Animated.View>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
            
            <View style={styles.scoreSection}>
              <Text style={styles.scoreLabel}>Match Confidence</Text>
              <View style={styles.scoreContainer}>
                <Animated.Text style={[styles.scoreValue, { color: getScoreColor(matchPercentage) }]}>
                  {Math.round(scoreCountAnim._value)}%
                </Animated.Text>
                <View style={styles.scoreBar}>
                  <Animated.View 
                    style={[
                      styles.scoreProgress, 
                      { 
                        width: progressAnim.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                          extrapolate: 'clamp',
                        }),
                        backgroundColor: getScoreColor(matchPercentage)
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
            
            <Text style={styles.explanationText}>
              {explanationText}
            </Text>
          </View>
        </GlassCard>
        
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title="Start New Verification" 
            onPress={handleRestart}
          />
        </View>
      </Animated.View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.surface,
  },
  statusText: {
    ...typography.title,
    textAlign: 'center',
  },
  scoreSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreLabel: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scoreContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  scoreBar: {
    width: '80%',
    height: 8,
    backgroundColor: colors.textSecondary + '20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  explanationText: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});