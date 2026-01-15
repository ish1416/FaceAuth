import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import PrimaryButton from '../components/PrimaryButton';
import GlassCard from '../components/GlassCard';

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <GlassCard>
              <View style={styles.titleContainer}>
                <View style={styles.iconContainer}>
                  <IconButton 
                    icon="face-recognition" 
                    size={64} 
                    iconColor={colors.primary}
                  />
                </View>
                <Text style={styles.title}>FaceAuth</Text>
                <Text style={styles.subtitle}>Secure Face Authentication</Text>
                <Text style={styles.description}>
                  Advanced biometric security powered by AI face recognition technology
                </Text>
              </View>
            </GlassCard>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.feature}>
                <IconButton icon="shield-check" size={32} iconColor={colors.success} />
                <Text style={styles.featureText}>Secure</Text>
              </View>
              <View style={styles.feature}>
                <IconButton icon="lightning-bolt" size={32} iconColor={colors.warning} />
                <Text style={styles.featureText}>Fast</Text>
              </View>
              <View style={styles.feature}>
                <IconButton icon="fingerprint" size={32} iconColor={colors.accent} />
                <Text style={styles.featureText}>Accurate</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Get Started" 
              onPress={() => navigation.navigate('Enroll' as never)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  feature: {
    alignItems: 'center',
  },
  featureText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
});