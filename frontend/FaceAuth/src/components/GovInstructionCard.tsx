import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GovInstructionCardProps {
  step: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isActive?: boolean;
  isCompleted?: boolean;
}

export const GovInstructionCard = ({
  step,
  title,
  description,
  icon,
  isActive = false,
  isCompleted = false
}: GovInstructionCardProps) => {
  const getStepColor = () => {
    if (isCompleted) return colors.success;
    if (isActive) return colors.accent;
    return colors.textTertiary;
  };

  const getCardStyle = () => {
    if (isActive) return [styles.card, styles.activeCard];
    if (isCompleted) return [styles.card, styles.completedCard];
    return styles.card;
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepNumber, { backgroundColor: getStepColor() }]}>
          {isCompleted ? (
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={colors.textInverse}
            />
          ) : (
            <Text style={styles.stepText}>{step}</Text>
          )}
        </View>
        
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={getStepColor()}
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.title,
          isActive && styles.activeTitle,
          isCompleted && styles.completedTitle
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.description,
          isActive && styles.activeDescription
        ]}>
          {description}
        </Text>
      </View>
      
      {isActive && (
        <View style={styles.activeBorder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activeCard: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '05',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  completedCard: {
    borderColor: colors.success,
    backgroundColor: colors.success + '05',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '700',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  activeTitle: {
    color: colors.primary,
    fontWeight: '600',
  },
  completedTitle: {
    color: colors.success,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  activeDescription: {
    color: colors.textPrimary,
  },
  activeBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});