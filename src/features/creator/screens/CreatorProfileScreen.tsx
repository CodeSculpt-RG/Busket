import React, { useCallback, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { CreatorStackParamList, RootStackParamList } from '../../../app/navigation/types';
import { clearAuthSession, useAuthState } from '../../../app/store/auth.store';
import { useCreatorProfile } from '../../../app/store/creator.store';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type ProfileNavigation = NavigationProp<CreatorStackParamList>;

type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const MAIN_MENU: MenuItem[] = [
  { id: 'edit', title: 'Edit Creator Profile', subtitle: 'Update your creator details', icon: 'account-edit-outline' },
  { id: 'category', title: 'Change Content Category', subtitle: 'Update your content interests', icon: 'shape-outline' },
  { id: 'faq', title: "FAQ's", subtitle: 'Frequently asked questions', icon: 'frequently-asked-questions' },
  { id: 'payment', title: 'Payment', subtitle: 'View your payout and payment details', icon: 'wallet-outline' },
  { id: 'logout', title: 'Log out', subtitle: 'Securely sign out of your account', icon: 'logout' },
];

const MORE_MENU: MenuItem[] = [
  { id: 'support', title: 'Help & Support', subtitle: 'Contact support@busket.app', icon: 'lifebuoy' },
  { id: 'about', title: 'About App', subtitle: 'Busket creator collaboration platform', icon: 'information-outline' },
];

function getInitials(name?: string) {
  if (!name) {
    return 'C';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function CreatorProfileScreen() {
  const navigation = useNavigation<ProfileNavigation>();
  const { signOut } = useAuth();
  const authState = useAuthState();
  const creatorProfile = useCreatorProfile();
  const [aboutVisible, setAboutVisible] = useState(false);
  const rootNavigation = navigation.getParent<NavigationProp<RootStackParamList>>();
  const isCreatorAuthenticated = authState.isAuthenticated && authState.role === 'creator';
  const isCompleteProfile = Boolean(isCreatorAuthenticated && creatorProfile);

  const profileMeta = useMemo(() => {
    if (!creatorProfile) {
      return 'Creator profile not completed';
    }

    const category = creatorProfile.categories.join(', ');
    const location = [creatorProfile.city, creatorProfile.state].filter(Boolean).join(', ');
    return [category, location].filter(Boolean).join(' - ');
  }, [creatorProfile]);

  const handleLoginPress = useCallback(() => {
    rootNavigation?.navigate('Auth', { screen: 'CreatorSignIn' });
  }, [rootNavigation]);

  const handleCreateAccountPress = useCallback(() => {
    rootNavigation?.navigate('Auth', { screen: 'RoleSelection' });
  }, [rootNavigation]);

  const handleLogout = useCallback(() => {
    void signOut()
      .catch(() => Alert.alert('Log out failed', 'Please try again.'))
      .finally(clearAuthSession);
  }, [signOut]);

  const handleContinueSetup = useCallback(() => {
    navigation.navigate('CreatorKyc');
  }, [navigation]);

  const handleSupport = useCallback(async () => {
    try {
      await Linking.openURL('mailto:support@busket.app?subject=Creator%20Support');
    } catch {
      Alert.alert('Help & Support', 'Reach us at support@busket.app');
    }
  }, []);

  const handleMenuPress = useCallback(
    (id: string) => {
      switch (id) {
        case 'edit':
        case 'category':
          navigation.navigate('CreatorEditProfile');
          break;
        case 'faq':
          navigation.navigate('CreatorFaq');
          break;
        case 'payment':
          navigation.navigate('Earnings');
          break;
        case 'logout':
          handleLogout();
          break;
        case 'support':
          handleSupport();
          break;
        case 'about':
          setAboutVisible(true);
          break;
        default:
          break;
      }
    },
    [handleLogout, handleSupport, navigation],
  );

  return (
    <AppScreen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ResponsiveContainer>
          <Text style={styles.screenTitle}>Profile</Text>

          {!isCreatorAuthenticated ? (
            <View style={styles.guestCard}>
              <View style={styles.guestIcon}>
                <MaterialCommunityIcons name="account-circle-outline" size={48} color={colors.black} />
              </View>
              <Text style={styles.guestTitle}>You are not logged in</Text>
              <Text style={styles.guestCopy}>Login or create an account to manage your creator profile.</Text>
              <PrimaryButton title="Login" onPress={handleLoginPress} style={styles.guestButton} />
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={handleCreateAccountPress} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {isCreatorAuthenticated && !creatorProfile ? (
            <View style={styles.guestCard}>
              <View style={styles.guestIcon}>
                <MaterialCommunityIcons name="clipboard-account-outline" size={44} color={colors.black} />
              </View>
              <Text style={styles.guestTitle}>Complete your profile</Text>
              <Text style={styles.guestCopy}>Finish Creator KYC to unlock campaigns, payouts, and profile tools.</Text>
              <PrimaryButton title="Continue Setup" onPress={handleContinueSetup} style={styles.guestButton} />
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={handleLogout} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Log out</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {isCompleteProfile && creatorProfile ? (
            <>
              <View style={styles.summary}>
                {creatorProfile.avatarUri ? (
                  <Image source={{ uri: creatorProfile.avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.initialsAvatar}>
                    <Text style={styles.initials}>{getInitials(creatorProfile.fullName)}</Text>
                  </View>
                )}
                <View style={styles.summaryCopy}>
                  <Text numberOfLines={1} style={styles.name}>{creatorProfile.fullName}</Text>
                  <Text numberOfLines={1} style={styles.contact}>{creatorProfile.email}</Text>
                  <Text numberOfLines={1} style={styles.meta}>{profileMeta}</Text>
                </View>
              </View>

              <MenuSection items={MAIN_MENU} onPress={handleMenuPress} />
              <MenuSection items={MORE_MENU} onPress={handleMenuPress} style={styles.moreSection} />
            </>
          ) : null}
        </ResponsiveContainer>
      </ScrollView>

      <Modal visible={aboutVisible} transparent animationType="fade" onRequestClose={() => setAboutVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.aboutCard}>
            <MaterialCommunityIcons name="basket-outline" size={34} color={colors.gold} />
            <Text style={styles.aboutTitle}>About Busket</Text>
            <Text style={styles.aboutCopy}>Busket helps creators discover campaigns, submit applications, and collaborate with brands from one creator-first workspace.</Text>
            <PrimaryButton title="Close" onPress={() => setAboutVisible(false)} style={styles.aboutButton} />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

interface MenuSectionProps {
  items: MenuItem[];
  onPress: (id: string) => void;
  style?: object;
}

function MenuSection({ items, onPress, style }: MenuSectionProps) {
  const renderRows = useMemo(
    () =>
      items.map((item, index) => (
        <MenuRow key={item.id} item={item} last={index === items.length - 1} onPress={onPress} />
      )),
    [items, onPress],
  );

  return (
    <View style={[styles.card, style]}>
      {renderRows}
    </View>
  );
}

interface MenuRowProps {
  item: MenuItem;
  last: boolean;
  onPress: (id: string) => void;
}

const MenuRow = React.memo(function MenuRow({ item, last, onPress }: MenuRowProps) {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.76} accessibilityRole="button" onPress={handlePress} style={[styles.row, last && styles.lastRow]}>
      <View style={styles.rowIcon}>
        <MaterialCommunityIcons name={item.icon} size={20} color={colors.black} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowText}>{item.title}</Text>
        <Text numberOfLines={1} style={styles.rowSubtitle}>{item.subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  screenTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.md,
  },
  summary: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceMuted,
  },
  initialsAvatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: colors.goldSoft,
  },
  initials: {
    color: colors.black,
    fontSize: typography.heading,
    fontWeight: fontWeight.heavy,
  },
  summaryCopy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  contact: {
    marginTop: 3,
    color: colors.mutedDark,
    fontSize: typography.small,
    fontWeight: fontWeight.semibold,
  },
  meta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  card: {
    marginTop: spacing.lg,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  moreSection: {
    marginTop: spacing.md,
  },
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  rowCopy: {
    flex: 1,
  },
  rowText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  rowSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  guestCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  guestIcon: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: colors.goldSoft,
  },
  guestTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  guestCopy: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    lineHeight: 19,
    textAlign: 'center',
  },
  guestButton: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    padding: spacing.screen,
  },
  aboutCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  aboutTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  aboutCopy: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  aboutButton: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
