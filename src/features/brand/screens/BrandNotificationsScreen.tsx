import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { getResponsivePadding, maxContentWidth, tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type NotificationType = 'applicant' | 'campaign' | 'payment' | 'creator';

type BrandNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: NotificationType;
};

const mockNotifications: BrandNotification[] = [
  {
    id: '1',
    title: 'New Applicant',
    message: 'Rahul Nair applied to your campaign.',
    time: '2m ago',
    unread: true,
    type: 'applicant',
  },
  {
    id: '2',
    title: 'Campaign Approved',
    message: 'Your campaign is now live.',
    time: '1h ago',
    unread: true,
    type: 'campaign',
  },
  {
    id: '3',
    title: 'Payment Reminder',
    message: 'Complete billing details to continue campaigns.',
    time: '4h ago',
    unread: false,
    type: 'payment',
  },
  {
    id: '4',
    title: 'Creator Saved',
    message: 'Creator profile added to your saved list.',
    time: '1d ago',
    unread: false,
    type: 'creator',
  },
];

const notificationIcons: Record<NotificationType, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  applicant: 'account-plus-outline',
  campaign: 'check-decagram-outline',
  payment: 'credit-card-clock-outline',
  creator: 'bookmark-check-outline',
};

function BrandNotificationsScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const { width } = useWindowDimensions();
  const [notifications, setNotifications] = useState<BrandNotification[]>(mockNotifications);

  const horizontalPadding = Math.max(20, getResponsivePadding(width));
  const contentWidth = Math.min(width - horizontalPadding * 2, maxContentWidth);
  const hasNotifications = notifications.length > 0;

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BrandTabs');
  }, [navigation]);

  const markRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    );
  }, []);

  const handleNotificationPress = useCallback(
    (notification: BrandNotification) => {
      markRead(notification.id);

      if (notification.type === 'applicant') {
        try {
          navigation.navigate('CampaignApplicants', {
            campaignId: 'camp-1',
            campaignName: 'Morning Skincare Launch',
            applicantCount: 122,
          });
        } catch {
          Alert.alert(notification.title, notification.message);
        }
        return;
      }

      if (notification.type === 'campaign') {
        navigation.navigate('BrandCampaigns');
        return;
      }

      if (notification.type === 'creator') {
        try {
          navigation.navigate('CreatorProfilePreview', {
            creatorId: 'creator-1',
            creatorName: 'Rahul Nair',
            creatorHandle: '@rahulcreates',
            categories: ['Lifestyle', 'UGC'],
            followers: '24K',
            rating: '4.8',
          });
        } catch {
          Alert.alert('Creator Saved', 'Open creator profile');
        }
        return;
      }

      Alert.alert(notification.title, notification.message);
    },
    [markRead, navigation],
  );

  const renderNotification = useCallback(
    ({ item }: { item: BrandNotification }) => (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.84}
        onPress={() => handleNotificationPress(item)}
        style={[styles.card, item.unread && styles.unreadCard, { width: contentWidth }]}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={notificationIcons[item.type]} size={23} color={colors.black} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.timeWrap}>
              <Text numberOfLines={1} style={styles.timeText}>{item.time}</Text>
              {item.unread ? <View style={styles.unreadDot} /> : null}
            </View>
          </View>
          <Text numberOfLines={2} style={styles.messageText}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    ),
    [contentWidth, handleNotificationPress],
  );

  const emptyState = useMemo(
    () => (
      <View style={[styles.emptyState, { width: contentWidth }]}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons name="bell-outline" size={34} color={colors.black} />
        </View>
        <Text style={styles.emptyTitle}>No notifications yet</Text>
        <Text style={styles.emptySubtitle}>Updates about your campaigns and creators will appear here.</Text>
      </View>
    ),
    [contentWidth],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.8} onPress={handleBackPress} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={29} color={colors.black} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        style={styles.list}
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
        ListEmptyComponent={emptyState}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: tabBarHeight + spacing.xxl,
            flexGrow: hasNotifications ? undefined : 1,
          },
        ]}
      />
    </SafeAreaView>
  );
}

export default BrandNotificationsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: colors.black,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  card: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  unreadCard: {
    borderColor: colors.goldSoft,
    backgroundColor: '#FFF8E5',
  },
  iconCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    minWidth: 0,
    color: colors.black,
    fontSize: typography.bodyLarge,
    lineHeight: 21,
    fontWeight: fontWeight.heavy,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  timeText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: fontWeight.bold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  messageText: {
    marginTop: spacing.xs,
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
  cardGap: {
    height: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    color: colors.black,
    fontSize: typography.title,
    lineHeight: 25,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  emptySubtitle: {
    maxWidth: 320,
    marginTop: spacing.sm,
    color: colors.mutedDark,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
