import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl } from 'react-native';
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

interface VerificationRecord {
  id: string;
  date: string;
  time: string;
  score: number;
  status: 'success' | 'failed';
  duration: string;
}

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in real app, this would come from API/storage
  const [verificationHistory] = useState<VerificationRecord[]>([
    {
      id: '1',
      date: 'Today',
      time: '2:30 PM',
      score: 96,
      status: 'success',
      duration: '2.1s'
    },
    {
      id: '2',
      date: 'Yesterday',
      time: '10:15 AM',
      score: 94,
      status: 'success',
      duration: '2.3s'
    },
    {
      id: '3',
      date: 'Jan 16',
      time: '4:45 PM',
      score: 0,
      status: 'failed',
      duration: '1.8s'
    },
    {
      id: '4',
      date: 'Jan 15',
      time: '11:20 AM',
      score: 98,
      status: 'success',
      duration: '1.9s'
    },
    {
      id: '5',
      date: 'Jan 14',
      time: '3:10 PM',
      score: 92,
      status: 'success',
      duration: '2.4s'
    }
  ]);

  const stats = {
    totalChecks: verificationHistory.length,
    successRate: Math.round((verificationHistory.filter((v: VerificationRecord) => v.status === 'success').length / verificationHistory.length) * 100),
    averageScore: Math.round(verificationHistory.filter((v: VerificationRecord) => v.status === 'success').reduce((sum: number, v: VerificationRecord) => sum + v.score, 0) / verificationHistory.filter((v: VerificationRecord) => v.status === 'success').length),
    lastCheck: verificationHistory[0]?.date || 'Never'
  };

  const quickActions = [
    {
      title: 'New Liveness Check',
      subtitle: 'Start face verification',
      icon: 'face-recognition' as const,
      color: colors.primary,
      onPress: () => navigation.navigate('FaceInstructions')
    },
    {
      title: 'View Instructions',
      subtitle: 'Learn how it works',
      icon: 'book-open' as const,
      color: colors.info,
      onPress: () => navigation.navigate('FaceInstructions')
    },
    {
      title: 'Get Help',
      subtitle: 'FAQ and support',
      icon: 'help-circle' as const,
      color: colors.success,
      onPress: () => navigation.navigate('Help')
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? colors.success : colors.error;
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return colors.success;
    if (score >= 85) return colors.accent;
    return colors.warning;
  };

  const renderHistoryItem = ({ item }: { item: VerificationRecord }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <View style={styles.historyInfo}>
          <Text style={styles.historyDate}>{item.date}</Text>
          <Text style={styles.historyTime}>{item.time}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <MaterialCommunityIcons
            name={item.status === 'success' ? 'check-circle' : 'alert-circle'}
            size={16}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === 'success' ? 'Verified' : 'Failed'}
          </Text>
        </View>
      </View>
      
      <View style={styles.historyDetails}>
        {item.status === 'success' && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score:</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(item.score) }]}>
              {item.score}%
            </Text>
          </View>
        )}
        <View style={styles.durationContainer}>
          <MaterialCommunityIcons
            name="clock-fast"
            size={14}
            color={colors.textTertiary}
          />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GovHeader
        title="Dashboard"
        subtitle="Face Liveness Detection"
        rightAction={{
          icon: 'cog',
          onPress: () => navigation.navigate('Help'),
          accessibilityLabel: 'Settings'
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.statValue}>{stats.totalChecks}</Text>
              <Text style={styles.statLabel}>Total Checks</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color={colors.success}
              />
              <Text style={styles.statValue}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color={colors.accent}
              />
              <Text style={styles.statValue}>{stats.averageScore}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <GovCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                iconColor={action.color}
                onPress={action.onPress}
                variant="elevated"
              />
            ))}
          </View>
        </View>

        {/* Recent History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeaderContainer}>
            <Text style={styles.sectionTitle}>Recent Verifications</Text>
            <Text style={styles.historyCount}>
              {verificationHistory.length} records
            </Text>
          </View>
          
          <View style={styles.historyList}>
            <FlatList
              data={verificationHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>

        {/* New Check Button */}
        <View style={styles.newCheckSection}>
          <GovButton
            onPress={() => navigation.navigate('FaceInstructions')}
            icon="plus-circle"
          >
            Start New Liveness Check
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
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    gap: spacing.md,
  },
  historySection: {
    marginBottom: spacing.xl,
  },
  historyHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  historyCount: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  historyList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  historyItem: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  historyTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scoreValue: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  durationText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
  newCheckSection: {
    marginTop: spacing.lg,
  },
});