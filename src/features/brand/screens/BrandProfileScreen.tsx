import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import { clearAuthSession } from '../../../app/store/auth.store';
import { useBrandProfile } from '../../../app/store/brand.store';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { getResponsivePadding, maxContentWidth, tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  danger?: boolean;
};

const supportEmail = 'support@busket.in';

export default function BrandProfileScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const { signOut } = useAuth();
  const brandProfile = useBrandProfile();
  const { width } = useWindowDimensions();
  const horizontalPadding = getResponsivePadding(width);

  const businessName = brandProfile?.businessName?.trim();
  const category = brandProfile?.businessCategory?.trim();
  const contactLine = brandProfile?.businessEmail?.trim() || brandProfile?.website?.trim();
  const initials = (businessName?.[0] ?? 'B').toUpperCase();

  const menuItems: MenuItem[] = [
    {
      id: 'edit',
      title: 'Edit Business Details',
      subtitle: 'Update your business profile',
      icon: 'store-edit-outline',
    },
    {
      id: 'category',
      title: 'Business Category',
      subtitle: category || 'Choose your category',
      icon: 'shape-outline',
    },
    {
      id: 'campaigns',
      title: 'Campaign Management',
      subtitle: 'View and manage your campaigns',
      icon: 'briefcase-search-outline',
    },
    {
      id: 'billing',
      title: 'Payment & Billing',
      subtitle: 'Manage wallet, invoices, and payouts',
      icon: 'wallet-outline',
    },
    {
      id: 'applicants',
      title: 'Applicants',
      subtitle: 'Review creator applications',
      icon: 'account-multiple-check-outline',
    },
    {
      id: 'faq',
      title: "FAQ's",
      subtitle: 'Frequently asked questions',
      icon: 'frequently-asked-questions',
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: supportEmail,
      icon: 'lifebuoy',
    },
    {
      id: 'about',
      title: 'About App',
      subtitle: 'Busket for brands and creators',
      icon: 'information-outline',
    },
    {
      id: 'logout',
      title: 'Log out',
      subtitle: 'Sign out from this device',
      icon: 'logout',
      danger: true,
    },
  ];

  const openSupport = useCallback(() => {
    const mailUrl = `mailto:${supportEmail}?subject=Busket%20Brand%20Support`;

    Linking.canOpenURL(mailUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailUrl);
        }

        Alert.alert('Help & Support', `Please contact us at ${supportEmail}.`);
        return undefined;
      })
      .catch(() => Alert.alert('Help & Support', `Please contact us at ${supportEmail}.`));
  }, []);

  const handleLogout = useCallback(() => {
    const doLogout = () => {
      void signOut()
        .catch(() => Alert.alert('Log out failed', 'Please try again.'))
        .finally(clearAuthSession);
    };

    if (Platform.OS === 'web') {
      doLogout();
      return;
    }

    Alert.alert('Log out', 'Are you sure you want to log out of Busket?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: doLogout },
    ]);
  }, [signOut]);

  const handleRowPress = useCallback(
    (id: string) => {
      switch (id) {
        case 'edit':
        case 'category':
          navigation.navigate('BrandOnboarding');
          break;
        case 'campaigns':
          navigation.navigate('BrandCampaigns');
          break;
        case 'billing':
          navigation.navigate('Payments');
          break;
        case 'applicants':
          navigation.navigate('CampaignApplicants', {
            campaignId: 'all-applicants',
            campaignName: 'All Campaigns',
            applicantCount: 122,
          });
          break;
        case 'faq':
          Alert.alert(
            "FAQ's",
            'Brand FAQ is coming soon. For now, you can manage campaigns, review applicants, and contact support from this page.',
          );
          break;
        case 'support':
          openSupport();
          break;
        case 'about':
          Alert.alert('About Busket', 'Busket helps brands discover trained creators, launch campaigns, and manage collaborations.');
          break;
        case 'logout':
          handleLogout();
          break;
        default:
          break;
      }
    },
    [handleLogout, navigation, openSupport],
  );

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: tabBarHeight + spacing.xl,
          },
        ]}
      >
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          <View style={styles.summaryCard}>
            <View style={styles.logoFrame}>
              {brandProfile?.logoUri ? (
                <Image source={{ uri: brandProfile.logoUri }} style={styles.logoImage} />
              ) : (
                <Text style={styles.logoText}>{initials}</Text>
              )}
            </View>

            <View style={styles.summaryCopy}>
              {businessName ? (
                <>
                  <View style={styles.nameRow}>
                    <Text numberOfLines={1} style={styles.businessName}>
                      {businessName}
                    </Text>
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons name="check-decagram" size={15} color={colors.black} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.categoryText}>
                    {category || 'Business profile'}
                  </Text>
                  {contactLine ? (
                    <Text numberOfLines={1} style={styles.contactText}>
                      {contactLine}
                    </Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.businessName}>Complete your business profile</Text>
                  <Text style={styles.contactText}>Add brand details to unlock campaign tools.</Text>
                  <PrimaryButton
                    title="Complete Profile"
                    tone="gold"
                    onPress={() => navigation.navigate('BrandOnboarding')}
                    style={styles.completeButton}
                  />
                </>
              )}
            </View>
          </View>

          {brandProfile ? (
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>POC</Text>
                <Text numberOfLines={1} style={styles.detailValue}>
                  {brandProfile.pocName || 'Not added'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>State</Text>
                <Text numberOfLines={1} style={styles.detailValue}>
                  {brandProfile.state || 'Not added'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>GSTIN</Text>
                <Text numberOfLines={1} style={styles.detailValue}>
                  {brandProfile.gstin || 'Not added'}
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <ProfileMenuRow
                key={item.id}
                item={item}
                isLast={index === menuItems.length - 1}
                onPress={() => handleRowPress(item.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function ProfileMenuRow({ item, isLast, onPress }: { item: MenuItem; isLast: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, !isLast && styles.menuRowBorder, pressed && styles.pressedRow]}
    >
      <View style={[styles.menuIcon, item.danger && styles.dangerIcon]}>
        <MaterialCommunityIcons name={item.icon} size={21} color={item.danger ? colors.error : colors.black} />
      </View>
      <View style={styles.menuCopy}>
        <Text numberOfLines={1} style={[styles.menuTitle, item.danger && styles.dangerText]}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text numberOfLines={1} style={styles.menuSubtitle}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={23} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  scrollContent: {
    alignItems: 'center',
  },
  content: {
    width: '100%',
    gap: spacing.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  logoFrame: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.black,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoText: {
    color: colors.gold,
    fontSize: 30,
    fontWeight: fontWeight.heavy,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  businessName: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  verifiedText: {
    color: colors.black,
    fontSize: typography.tiny,
    fontWeight: fontWeight.bold,
  },
  categoryText: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  contactText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  completeButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    minHeight: 42,
    borderRadius: radius.pill,
  },
  detailsCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    padding: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  detailLabel: {
    color: colors.gold,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  menuCard: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressedRow: {
    backgroundColor: colors.surfaceMuted,
  },
  menuIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
  },
  dangerIcon: {
    backgroundColor: '#FDECEC',
  },
  menuCopy: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  dangerText: {
    color: colors.error,
  },
  menuSubtitle: {
    marginTop: 3,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
});
