import React, { useCallback } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type Applicant = {
  id: string;
  name: string;
  niche: string;
  followers: string;
  rating: string;
  avatar: string;
};

const applicants: Applicant[] = [
  {
    id: 'creator-1',
    name: 'Rohit Malik',
    niche: 'Fashion + Lifestyle',
    followers: '20K',
    rating: '4.8',
    avatar: 'https://picsum.photos/seed/applicant-rohit/300/300',
  },
  {
    id: 'creator-2',
    name: 'Aisha Khan',
    niche: 'Beauty + Skincare',
    followers: '46K',
    rating: '4.9',
    avatar: 'https://picsum.photos/seed/applicant-aisha/300/300',
  },
  {
    id: 'creator-3',
    name: 'Dev Shah',
    niche: 'Tech + Workspace',
    followers: '31K',
    rating: '4.7',
    avatar: 'https://picsum.photos/seed/applicant-dev/300/300',
  },
  {
    id: 'creator-4',
    name: 'Meera Iyer',
    niche: 'Food + Lifestyle',
    followers: '62K',
    rating: '4.8',
    avatar: 'https://picsum.photos/seed/applicant-meera/300/300',
  },
];

export default function CampaignApplicantsScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'CampaignApplicants'>>();

  const handleViewProfile = useCallback(
    (creatorId: string) => {
      try {
        navigation.navigate('CreatorProfilePreview', { creatorId });
      } catch {
        Alert.alert('Creator profile', 'Creator profile preview is not available yet.');
      }
    },
    [navigation],
  );

  const handleContact = useCallback((name: string) => {
    Alert.alert('Contact Creator', `Contact request sent to ${name}.`);
  }, []);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ResponsiveContainer style={styles.container}>
        <View style={styles.summary}>
          <Text numberOfLines={1} style={styles.campaignName}>{route.params?.campaignName ?? 'Campaign'}</Text>
          <Text style={styles.count}>{route.params?.applicantCount ?? applicants.length} creator applications</Text>
        </View>
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ApplicantCard applicant={item} onViewProfile={() => handleViewProfile(item.id)} onContact={() => handleContact(item.name)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
        />
      </ResponsiveContainer>
    </AppScreen>
  );
}

function ApplicantCard({
  applicant,
  onViewProfile,
  onContact,
}: {
  applicant: Applicant;
  onViewProfile: () => void;
  onContact: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: applicant.avatar }} style={styles.avatar} />
      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.name}>{applicant.name}</Text>
        <Text numberOfLines={1} style={styles.niche}>{applicant.niche}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{applicant.followers} followers</Text>
          <Text style={styles.meta}>Rating {applicant.rating}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={onViewProfile} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={onContact} style={styles.primaryButton}>
            <Text style={styles.primaryText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: { width: 38 },
  container: { flex: 1 },
  summary: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  campaignName: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  count: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: tabBarHeight + spacing.xxl,
  },
  gap: { height: spacing.md },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  niche: {
    marginTop: spacing.xs,
    color: colors.mutedDark,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  secondaryButton: {
    minHeight: 34,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.black,
  },
  primaryButton: {
    minHeight: 34,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
  secondaryText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  primaryText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
});
