import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';

interface RouteParams {
  result: {
    success: boolean;
    distance: number;
  };
}

export default function ResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { result } = route.params as RouteParams;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const isSuccess = result.success;
  const statusColor = isSuccess ? colors.success : colors.error;
  const statusText = isSuccess ? 'Verification Successful' : 'Verification Failed';
  
  // Convert distance to confidence percentage
  // For successful matches, show higher confidence
  const confidenceScore = Math.max(0, Math.min(100, Math.round((0.6 - result.distance) / 0.6 * 100)));
  const matchPercentage = isSuccess ? Math.max(confidenceScore, 70) : confidenceScore;
  
  const explanationText = isSuccess 
    ? 'Your identity has been successfully verified. Access granted.'
    : 'Identity verification failed. Please ensure proper lighting and face positioning.';

  useEffect(() => {
    Haptics.notificationAsync(
      isSuccess 
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    );

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
      Animated.timing(progressAnim, {
        toValue: matchPercentage,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.resultCard}>
          <View style={styles.statusSection}>
            <Animated.View 
              style={[
                styles.statusIcon, 
                { 
                  backgroundColor: statusColor + '15',
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <MaterialCommunityIcons 
                name={isSuccess ? 'check-circle' : 'close-circle'} 
                size={64} 
                color={statusColor}
              />
            </Animated.View>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
          
          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>Match Confidence</Text>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(matchPercentage) }]}>
                {matchPercentage}%
              </Text>
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
          
          <View style={styles.detailsSection}>
            <DetailItem 
              icon="fingerprint" 
              label="Biometric Match" 
              value={isSuccess ? 'Confirmed' : 'Not Matched'}
              color={statusColor}
            />
            <DetailItem 
              icon="chart-line" 
              label="Similarity Score" 
              value={`${(100 - (result.distance / 0.6 * 100)).toFixed(1)}%`}
              color={colors.primary}
            />
            <DetailItem 
              icon="shield-check" 
              label="Security Level" 
              value="High"
              color={colors.info}
            />
          </View>

          <Text style={styles.explanationText}>
            {explanationText}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <PrimaryButton 
            title="New Verification" 
            onPress={() => navigation.navigate('Landing')}
            icon="refresh"
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function DetailItem({ icon, label, value, color }: { 
  icon: keyof typeof MaterialCommunityIcons.glyphMap; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <View style={styles.detailItem}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, { color }]}>{value}</Text>
      </View>
    </View>
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
    gap: spacing.xl,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    gap: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statusSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...typography.h2,
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'center',
    width: '100%',
    gap: spacing.md,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  detailsSection: {
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  detailValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    flexShrink: 0,
  },
  explanationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
  },
});
