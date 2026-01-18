import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GovButton } from '../components/GovButton';
import { GovCard } from '../components/GovCard';
import { PoweredBy } from '../components/PoweredBy';
import { NavigationProps } from '../types/navigation';

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProps>();

  const features = [
    {
      icon: 'shield-check' as const,
      title: 'Bank-grade Security',
      description: 'Advanced encryption and secure processing'
    },
    {
      icon: 'lightning-bolt' as const,
      title: 'Real-time Detection',
      description: 'Instant liveness verification in seconds'
    },
    {
      icon: 'eye-check' as const,
      title: 'Anti-spoofing',
      description: 'Prevents photo and video attacks'
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons
              name="shield-check"
              size={64}
              color={colors.primary}
            />
          </View>
          
          <Text style={styles.title}>Face Liveness Detection</Text>
          <Text style={styles.subtitle}>Government of India</Text>
          <Text style={styles.description}>
            Secure biometric authentication system with advanced liveness detection 
            to prevent spoofing attacks and ensure genuine user verification.
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <GovCard
              key={index}
              title={feature.title}
              subtitle={feature.description}
              icon={feature.icon}
              iconColor={colors.success}
              variant="outlined"
            />
          ))}
        </View>

        <View style={styles.actions}>
          <GovButton
            onPress={() => navigation.navigate('FaceInstructions')}
            icon="face-recognition"
          >
            Start Face Liveness Check
          </GovButton>
          
          <GovButton
            onPress={() => navigation.navigate('Help')}
            variant="outline"
            icon="help-circle"
          >
            Help & Instructions
          </GovButton>
        </View>

        <View style={styles.footer}>
          <PoweredBy variant="government" position="footer" />
        </View>
      </ScrollView>
      
      {/* Corner Branding */}
      <PoweredBy variant="government" position="corner" />
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
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  features: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});