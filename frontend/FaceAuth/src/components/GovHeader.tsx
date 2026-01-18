import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface GovHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    accessibilityLabel: string;
  };
  variant?: 'default' | 'transparent';
}

export const GovHeader = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  variant = 'default'
}: GovHeaderProps) => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={variant === 'transparent' ? 'transparent' : colors.primary}
        translucent={variant === 'transparent'}
      />
      <SafeAreaView 
        style={[styles.container, variant === 'transparent' && styles.transparent]}
        edges={['top']}
      >
        <View style={styles.header}>
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackPress}
                accessible={true}
                accessibilityLabel="Go back"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color={colors.textInverse}
                />
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
            </View>
          </View>
          
          {rightAction && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={rightAction.onPress}
              accessible={true}
              accessibilityLabel={rightAction.accessibilityLabel}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={rightAction.icon}
                size={24}
                color={colors.textInverse}
              />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textInverse,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.8,
    marginTop: 2,
  },
  rightButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});