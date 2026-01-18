import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface YellowSenseLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'government';
}

export const YellowSenseLogo = ({ 
  size = 'medium', 
  showText = true,
  variant = 'government'
}: YellowSenseLogoProps) => {
  const dimensions = {
    small: { width: 24, height: 24, fontSize: 10 },
    medium: { width: 32, height: 32, fontSize: 12 },
    large: { width: 48, height: 48, fontSize: 14 }
  };

  const { width, height, fontSize } = dimensions[size];

  const getTextColor = () => {
    switch (variant) {
      case 'light':
        return colors.textPrimary;
      case 'dark':
        return colors.textInverse;
      case 'government':
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { opacity: 0.8 }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/yellowsense-logo.jpeg')}
          style={[styles.logoImage, { width, height }]}
          resizeMode="contain"
        />
      </View>
      
      {showText && (
        <Text style={[styles.text, { fontSize, color: getTextColor() }]}>
          YellowSense
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    borderRadius: 4,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});