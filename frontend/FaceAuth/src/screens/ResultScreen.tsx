import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
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

  const isSuccess = result.success;
  const statusColor = isSuccess ? colors.success : colors.error;
  const statusText = isSuccess ? 'Verification Successful' : 'Verification Failed';
  
  // Convert distance to percentage score (lower distance = higher confidence)
  const confidenceScore = Math.max(0, Math.min(100, Math.round((1 - result.distance) * 100)));
  const matchPercentage = isSuccess ? confidenceScore : Math.max(0, confidenceScore - 20);
  
  const explanationText = isSuccess 
    ? 'Your identity has been successfully verified. Access granted.'
    : 'Identity verification failed. Please ensure proper lighting and face positioning.';

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
      <View style={styles.content}>
        <GlassCard>
          <View style={styles.resultContainer}>
            <View style={styles.statusSection}>
              <View style={[styles.statusIcon, { backgroundColor: statusColor }]}>
                <Text style={styles.statusIconText}>
                  {isSuccess ? '✓' : '✗'}
                </Text>
              </View>
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
                  <View 
                    style={[
                      styles.scoreProgress, 
                      { 
                        width: `${matchPercentage}%`,
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