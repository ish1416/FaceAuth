import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';

export default function LandingScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name="face-recognition" 
              size={64} 
              color={colors.primary} 
            />
          </View>
          
          <Text style={styles.title}>FaceAuth</Text>
          <Text style={styles.subtitle}>
            Secure Biometric Authentication System
          </Text>
          <Text style={styles.description}>
            Advanced facial recognition technology for secure identity verification and access control
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons 
              name="shield-check" 
              size={24} 
              color={colors.success} 
            />
            <Text style={styles.featureText}>Bank-grade Security</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons 
              name="lightning-bolt" 
              size={24} 
              color={colors.warning} 
            />
            <Text style={styles.featureText}>Instant Verification</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons 
              name="fingerprint" 
              size={24} 
              color={colors.info} 
            />
            <Text style={styles.featureText}>Biometric Precision</Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton
            title="Start Face Enrollment"
            onPress={() => navigation.navigate('Enroll')}
            icon="account-plus"
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  features: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featureItem: {
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
  featureText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  actions: {
    gap: spacing.md,
  },
  bottom: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
