import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GovButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: 'small' | 'medium' | 'large';
}

export const GovButton = ({ 
  onPress, 
  children, 
  variant = 'primary', 
  fullWidth = true,
  loading = false,
  disabled = false,
  icon,
  size = 'large'
}: GovButtonProps) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyles: ViewStyle[] = [styles.button];
    
    // Add size style
    if (size === 'small') baseStyles.push(styles.small);
    else if (size === 'medium') baseStyles.push(styles.medium);
    else baseStyles.push(styles.large);
    
    // Add width style
    if (fullWidth) baseStyles.push(styles.fullWidth);
    
    // Add variant and state styles
    if (disabled || loading) {
      baseStyles.push(styles.disabled);
    } else {
      if (variant === 'secondary') baseStyles.push(styles.secondary);
      else if (variant === 'outline') baseStyles.push(styles.outline);
      else baseStyles.push(styles.primary);
    }
    
    return baseStyles;
  };

  const getTextColor = () => {
    if (disabled || loading) return colors.textTertiary;
    switch (variant) {
      case 'secondary':
      case 'outline':
        return colors.primary;
      default:
        return colors.textInverse;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={children}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size={size === 'small' ? 'small' : 'large'} 
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.buttonText, { color: getTextColor() }]}>
            {children}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  small: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  medium: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: {
    marginRight: -4,
  },
  buttonText: {
    ...typography.button,
    textAlign: 'center',
  },
});