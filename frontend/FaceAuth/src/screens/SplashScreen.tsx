import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { YellowSenseLogo } from '../components/YellowSenseLogo';
import { NavigationProps } from '../types/navigation';

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProps>();
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);

  useEffect(() => {
    // Start animations
    fadeAnim.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
    
    scaleAnim.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) })
    );

    // Auto-navigate after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <View style={styles.shieldContainer}>
            <MaterialCommunityIcons
              name="shield-check"
              size={80}
              color={colors.textInverse}
            />
          </View>
          
          <Text style={styles.title}>Government of India</Text>
          <Text style={styles.subtitle}>Face Liveness Detection System</Text>
          
          <View style={styles.versionContainer}>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.secure}>Secure • Reliable • Fast</Text>
          </View>
        </Animated.View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ministry of Electronics & Information Technology
          </Text>
          <Text style={styles.copyright}>
            © 2026 Government of India. All rights reserved.
          </Text>
          
          {/* YellowSense Branding */}
          <View style={styles.brandingContainer}>
            <Text style={styles.brandingText}>Developed by</Text>
            <YellowSenseLogo size="medium" showText={true} variant="dark" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  shieldContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.overlay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    ...typography.h1,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.h3,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  versionContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  version: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.8,
  },
  secure: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    opacity: 0.8,
    textAlign: 'center',
  },
  copyright: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.6,
    textAlign: 'center',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.textInverse + '20',
  },
  brandingText: {
    ...typography.caption,
    color: colors.textInverse,
    opacity: 0.7,
  },
});