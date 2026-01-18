import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GovButton } from '../components/GovButton';
import { GovCard } from '../components/GovCard';
import { GovHeader } from '../components/GovHeader';
import { NavigationProps } from '../types/navigation';

export default function FaceAuthInstructionsScreen() {
  const navigation = useNavigation<NavigationProps>();

  const instructions = [
    {
      step: 1,
      icon: 'face-recognition' as const,
      title: 'Position Your Face',
      description: 'Center your face within the oval guide on the screen',
      color: colors.primary
    },
    {
      step: 2,
      icon: 'eye' as const,
      title: 'Blink Naturally',
      description: 'Blink your eyes twice when prompted to prove liveness',
      color: colors.success
    },
    {
      step: 3,
      icon: 'arrow-left' as const,
      title: 'Turn Left',
      description: 'Slowly turn your head to the left when instructed',
      color: colors.accent
    },
    {
      step: 4,
      icon: 'arrow-right' as const,
      title: 'Turn Right',
      description: 'Slowly turn your head to the right when instructed',
      color: colors.info
    },
    {
      step: 5,
      icon: 'emoticon-happy' as const,
      title: 'Smile',
      description: 'Show a natural smile to complete the verification',
      color: colors.success
    }
  ];

  const tips = [
    'Ensure good lighting on your face',
    'Remove glasses if possible',
    'Keep your face clearly visible',
    'Follow instructions slowly and naturally',
    'Stay within the camera frame'
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GovHeader
        title="Liveness Instructions"
        subtitle="Follow these steps for verification"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Steps</Text>
          <Text style={styles.sectionDescription}>
            Complete these 5 steps in order to verify your liveness
          </Text>
          
          <View style={styles.steps}>
            {instructions.map((instruction) => (
              <View key={instruction.step} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNumber, { backgroundColor: instruction.color }]}>
                    <Text style={styles.stepNumberText}>{instruction.step}</Text>
                  </View>
                  
                  <View style={[styles.iconContainer, { backgroundColor: instruction.color + '15' }]}>
                    <MaterialCommunityIcons
                      name={instruction.icon}
                      size={24}
                      color={instruction.color}
                    />
                  </View>
                </View>
                
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{instruction.title}</Text>
                  <Text style={styles.stepDescription}>{instruction.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Tips</Text>
          <View style={styles.tips}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={colors.success}
                />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.warningSection}>
          <GovCard
            title="Security Notice"
            icon="shield-alert"
            iconColor={colors.warning}
            variant="outlined"
          >
            <Text style={styles.warningText}>
              This system uses advanced anti-spoofing technology. Photos, videos, 
              or masks will not work. Only live human faces can pass verification.
            </Text>
          </GovCard>
        </View>

        <View style={styles.actions}>
          <GovButton
            onPress={() => navigation.navigate('FaceLivenessCamera')}
            icon="camera"
          >
            Start Liveness Check
          </GovButton>
          
          <GovButton
            onPress={() => navigation.navigate('Help')}
            variant="outline"
            icon="help-circle"
          >
            Need Help?
          </GovButton>
        </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  steps: {
    gap: spacing.md,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    ...typography.bodyMedium,
    color: colors.textInverse,
    fontWeight: '700',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    paddingLeft: spacing.xs,
  },
  stepTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tips: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  warningSection: {
    marginBottom: spacing.xl,
  },
  warningText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.md,
  },
});