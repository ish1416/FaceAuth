import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  primaryButton: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
  };
}

export default function CustomModal({
  visible,
  title,
  message,
  type,
  primaryButton,
  secondaryButton,
}: CustomModalProps) {
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: '✓', color: colors.success };
      case 'error':
        return { icon: '✗', color: colors.error };
      default:
        return { icon: 'i', color: colors.primary };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={50} style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
            
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {secondaryButton && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={secondaryButton.onPress}
                >
                  <Text style={styles.secondaryButtonText}>
                    {secondaryButton.text}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { backgroundColor: color }]}
                onPress={primaryButton.onPress}
              >
                <Text style={styles.primaryButtonText}>
                  {primaryButton.text}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.surface,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minWidth: 100,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.surface,
    textAlign: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});