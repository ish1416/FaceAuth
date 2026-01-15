import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
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
  const explanationText = isSuccess 
    ? 'Your identity has been successfully verified. Access granted.'
    : 'Identity verification failed. Please ensure proper lighting and face positioning.';

  const handleRestart = () => {
    navigation.navigate('Landing' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GlassCard>
          <View style={styles.resultContainer}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
            
            <Text style={styles.distanceText}>
              Distance: {result.distance.toFixed(3)}
            </Text>
            
            <Text style={styles.explanationText}>
              {explanationText}
            </Text>
          </View>
        </GlassCard>
        
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title="Restart" 
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
    paddingVertical: spacing.lg,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  distanceText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  explanationText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});