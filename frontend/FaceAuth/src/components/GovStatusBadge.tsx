import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GovStatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending';
  text: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export const GovStatusBadge = ({ 
  status, 
  text, 
  size = 'medium',
  showIcon = true 
}: GovStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          backgroundColor: colors.success + '15',
          textColor: colors.success,
          icon: 'check-circle' as const
        };
      case 'error':
        return {
          backgroundColor: colors.error + '15',
          textColor: colors.error,
          icon: 'alert-circle' as const
        };
      case 'warning':
        return {
          backgroundColor: colors.warning + '15',
          textColor: colors.warning,
          icon: 'alert' as const
        };
      case 'info':
        return {
          backgroundColor: colors.info + '15',
          textColor: colors.info,
          icon: 'information' as const
        };
      case 'pending':
        return {
          backgroundColor: colors.accent + '15',
          textColor: colors.accent,
          icon: 'clock' as const
        };
      default:
        return {
          backgroundColor: colors.borderLight,
          textColor: colors.textSecondary,
          icon: 'circle' as const
        };
    }
  };

  const config = getStatusConfig();
  const iconSize = size === 'small' ? 12 : size === 'medium' ? 16 : 20;

  return (
    <View style={[
      styles.badge,
      styles[size],
      { backgroundColor: config.backgroundColor }
    ]}>
      {showIcon && (
        <MaterialCommunityIcons
          name={config.icon}
          size={iconSize}
          color={config.textColor}
        />
      )}
      <Text style={[
        styles.text,
        styles[`text${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
        { color: config.textColor }
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  text: {
    fontWeight: '600',
  },
  textSmall: {
    ...typography.caption,
  },
  textMedium: {
    ...typography.bodySmall,
  },
  textLarge: {
    ...typography.body,
  },
});