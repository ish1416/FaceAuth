import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { YellowSenseLogo } from './YellowSenseLogo';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface PoweredByProps {
  variant?: 'light' | 'dark' | 'government';
  position?: 'footer' | 'corner';
}

export const PoweredBy = ({ 
  variant = 'government',
  position = 'footer'
}: PoweredByProps) => {
  const isCorner = position === 'corner';

  return (
    <View style={[
      styles.container, 
      isCorner ? styles.corner : styles.footer
    ]}>
      <Text style={[
        styles.poweredText,
        { color: variant === 'dark' ? colors.textInverse : colors.textTertiary }
      ]}>
        Powered by
      </Text>
      <YellowSenseLogo 
        size={isCorner ? 'small' : 'medium'} 
        showText={!isCorner}
        variant={variant}
      />
      {isCorner && (
        <Text style={[
          styles.companyText,
          { color: variant === 'dark' ? colors.textInverse : colors.textTertiary }
        ]}>
          YS
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footer: {
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  corner: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface + 'E6', // Semi-transparent
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poweredText: {
    ...typography.caption,
    fontSize: 10,
  },
  companyText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
});