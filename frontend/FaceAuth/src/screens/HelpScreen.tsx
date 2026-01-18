import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GovButton } from '../components/GovButton';
import { GovCard } from '../components/GovCard';
import { GovHeader } from '../components/GovHeader';
import { PoweredBy } from '../components/PoweredBy';
import { NavigationProps } from '../types/navigation';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'security' | 'troubleshooting';
}

export default function HelpScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      category: 'general',
      question: 'What is face liveness detection?',
      answer: 'Face liveness detection is a security technology that verifies a live human face is present during authentication, preventing spoofing attacks using photos, videos, or masks.'
    },
    {
      id: '2',
      category: 'general',
      question: 'How does the verification process work?',
      answer: 'The system guides you through 5 steps: positioning your face, blinking, turning left, turning right, and smiling. Each step verifies you are a live person, not a photo or video.'
    },
    {
      id: '3',
      category: 'technical',
      question: 'What are the camera requirements?',
      answer: 'You need a front-facing camera with at least 2MP resolution. Ensure good lighting and keep your device steady during verification.'
    },
    {
      id: '4',
      category: 'security',
      question: 'Is my biometric data stored?',
      answer: 'No, your biometric data is processed locally on your device and is never stored or transmitted to external servers. All processing happens in real-time.'
    },
    {
      id: '5',
      category: 'troubleshooting',
      question: 'Why did my verification fail?',
      answer: 'Common reasons include poor lighting, incorrect positioning, moving too fast during steps, or camera obstruction. Follow the on-screen instructions carefully.'
    },
    {
      id: '6',
      category: 'technical',
      question: 'What is a good liveness score?',
      answer: 'Scores above 85% are acceptable, 90-94% are very good, and 95%+ are excellent. Higher scores indicate stronger confidence in liveness detection.'
    },
    {
      id: '7',
      category: 'troubleshooting',
      question: 'Can I wear glasses during verification?',
      answer: 'While possible, removing glasses improves accuracy. If you must wear them, ensure they don\'t create glare and your eyes are clearly visible.'
    },
    {
      id: '8',
      category: 'security',
      question: 'How secure is this system?',
      answer: 'The system uses bank-grade security with advanced anti-spoofing technology. It can detect and prevent various attack methods including photos, videos, and 3D masks.'
    }
  ];

  const categories = [
    { key: 'general', label: 'General', icon: 'information' as const },
    { key: 'technical', label: 'Technical', icon: 'cog' as const },
    { key: 'security', label: 'Security', icon: 'shield-check' as const },
    { key: 'troubleshooting', label: 'Troubleshooting', icon: 'wrench' as const }
  ];

  const supportOptions = [
    {
      title: 'Email Support',
      subtitle: 'Get help via email',
      icon: 'email' as const,
      action: () => Linking.openURL('mailto:support@gov.in?subject=Face Liveness Detection Help')
    },
    {
      title: 'Phone Support',
      subtitle: 'Call our helpline',
      icon: 'phone' as const,
      action: () => Linking.openURL('tel:1800-XXX-XXXX')
    },
    {
      title: 'Online Portal',
      subtitle: 'Visit support website',
      icon: 'web' as const,
      action: () => Linking.openURL('https://support.gov.in')
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const renderFAQItem = (item: FAQItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <MaterialCommunityIcons
          name={expandedFAQ === item.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </View>
      {expandedFAQ === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GovHeader
        title="Help & Support"
        subtitle="FAQ and assistance"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <GovButton
              onPress={() => navigation.navigate('FaceInstructions')}
              variant="outline"
              icon="book-open"
              size="medium"
            >
              View Instructions
            </GovButton>
            <GovButton
              onPress={() => navigation.navigate('FaceLivenessCamera')}
              variant="outline"
              icon="face-recognition"
              size="medium"
            >
              Try Demo
            </GovButton>
          </View>
        </View>

        {/* System Info */}
        <View style={styles.systemSection}>
          <GovCard
            title="System Information"
            icon="information"
            iconColor={colors.info}
            variant="outlined"
          >
            <View style={styles.systemInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version:</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Security Level:</Text>
                <Text style={[styles.infoValue, { color: colors.success }]}>High</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Compliance:</Text>
                <Text style={styles.infoValue}>Government Standards</Text>
              </View>
            </View>
          </GovCard>
        </View>

        {/* FAQ Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const categoryFAQs = faqData.filter(faq => faq.category === category.key);
              return (
                <GovCard
                  key={category.key}
                  title={category.label}
                  subtitle={`${categoryFAQs.length} questions`}
                  icon={category.icon}
                  iconColor={colors.primary}
                  variant="default"
                />
              );
            })}
          </View>
        </View>

        {/* FAQ List */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {faqData.map(renderFAQItem)}
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <Text style={styles.supportDescription}>
            Need additional help? Our support team is available to assist you.
          </Text>
          <View style={styles.supportOptions}>
            {supportOptions.map((option, index) => (
              <GovCard
                key={index}
                title={option.title}
                subtitle={option.subtitle}
                icon={option.icon}
                iconColor={colors.success}
                onPress={option.action}
                variant="elevated"
              />
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <GovCard
            title="Emergency Support"
            icon="phone-alert"
            iconColor={colors.error}
            variant="outlined"
          >
            <Text style={styles.emergencyText}>
              For urgent technical issues or security concerns, contact our 24/7 emergency helpline:
            </Text>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={() => Linking.openURL('tel:1800-XXX-EMERGENCY')}
            >
              <MaterialCommunityIcons
                name="phone"
                size={20}
                color={colors.error}
              />
              <Text style={styles.emergencyNumber}>1800-XXX-EMERGENCY</Text>
            </TouchableOpacity>
          </GovCard>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Government of India - Ministry of Electronics & Information Technology
          </Text>
          <Text style={styles.footerCopyright}>
            © 2026 All rights reserved
          </Text>
          
          {/* YellowSense Branding */}
          <View style={styles.brandingSection}>
            <PoweredBy variant="government" position="footer" />
          </View>
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
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  quickActions: {
    gap: spacing.md,
  },
  systemSection: {
    marginBottom: spacing.xl,
  },
  systemInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  categoriesSection: {
    marginBottom: spacing.xl,
  },
  categoriesGrid: {
    gap: spacing.md,
  },
  faqSection: {
    marginBottom: spacing.xl,
  },
  faqList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  faqQuestion: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 0,
  },
  faqAnswerText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  supportSection: {
    marginBottom: spacing.xl,
  },
  supportDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  supportOptions: {
    gap: spacing.md,
  },
  emergencySection: {
    marginBottom: spacing.xl,
  },
  emergencyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.error + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emergencyNumber: {
    ...typography.bodyMedium,
    color: colors.error,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerCopyright: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  brandingSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignItems: 'center',
  },
});