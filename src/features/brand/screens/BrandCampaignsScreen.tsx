import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandCampaignFlowCampaign, BrandStackParamList } from '../../../app/navigation/types';
import BrandCampaignCard, { type BrandCampaignCardData } from '../components/BrandCampaignCard';
import { brandCampaigns } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { getResponsivePadding, maxContentWidth, tabBarHeight } from '../../../shared/theme/responsive';
import { fontWeight, typography } from '../../../shared/theme/typography';

type Status = BrandCampaignFlowCampaign['status'];

const statusChips: Array<{ label: string; value: Status }> = [
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
];

const initialCampaigns: BrandCampaignCardData[] = [
  ...brandCampaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    category: campaign.category,
    brief: `${campaign.name} campaign brief for creator collaboration.`,
    payout: 'Upto 3000 INR / video',
    startDate: '25/04/2026',
    endDate: '15/05/2026',
    productLink: 'https://example.com',
    status: campaign.status.toLowerCase() as Status,
    brandName: campaign.brand,
    image: campaign.image,
    applicants: campaign.applicants,
    totalSlots: 500,
    stats: { reel: 1, story: 2, post: 0 },
  })),
  {
    id: 'camp-active-fallback',
    name: 'Creator Desk Essentials',
    category: 'Lifestyle',
    brief: 'Workspace creator campaign for desk accessories and setup reels.',
    payout: 'Upto 3000 INR / video',
    startDate: '26/04/2026',
    endDate: '18/05/2026',
    productLink: 'https://example.com/desk',
    status: 'active',
    brandName: 'Layer Story',
    applicants: 122,
    totalSlots: 500,
    stats: { reel: 1, story: 2, post: 0 },
  },
];

export default function BrandCampaignsScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'BrandCampaigns'>>();
  const { width } = useWindowDimensions();
  const [activeStatus, setActiveStatus] = useState<Status>('active');
  const [campaigns, setCampaigns] = useState<BrandCampaignCardData[]>(initialCampaigns);

  const screenPadding = Math.max(20, getResponsivePadding(width));
  const contentWidth = Math.min(width - screenPadding * 2, maxContentWidth);
  const compact = contentWidth < 360;

  useEffect(() => {
    const createdCampaign = route.params?.createdCampaign;

    if (!createdCampaign) {
      return;
    }

    const campaignWithCardData: BrandCampaignCardData = {
      ...createdCampaign,
      applicants: 0,
      totalSlots: 500,
      stats: { reel: 1, story: 2, post: 0 },
    };

    setCampaigns((current) => {
      if (current.some((campaign) => campaign.id === createdCampaign.id)) {
        return current;
      }

      return [campaignWithCardData, ...current];
    });
    setActiveStatus(createdCampaign.status);
    navigation.setParams({ createdCampaign: undefined });
  }, [navigation, route.params?.createdCampaign]);

  const filteredCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.status === activeStatus),
    [activeStatus, campaigns],
  );

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BrandTabs');
  }, [navigation]);

  const handleCreatePress = useCallback(() => {
    navigation.navigate('CreateCampaign');
  }, [navigation]);

  const handleCampaignPress = useCallback((campaign: BrandCampaignCardData) => {
    try {
      navigation.navigate('BrandCampaignDetails', { campaignId: campaign.id });
    } catch {
      Alert.alert('Campaign details', 'Campaign details screen is not available yet.');
    }
  }, [navigation]);

  const renderCampaign = useCallback(
    ({ item }: { item: BrandCampaignCardData }) => (
      <View style={[styles.contentFrame, { width: contentWidth }]}>
        <BrandCampaignCard campaign={item} onPress={() => handleCampaignPress(item)} variant="management" />
      </View>
    ),
    [contentWidth, handleCampaignPress],
  );

  const listHeader = useMemo(
    () => (
      <View style={[styles.contentFrame, { width: contentWidth }]}>
        <View style={[styles.banner, compact && styles.bannerCompact]}>
          <View style={[styles.bannerIcon, compact && styles.bannerIconCompact]}>
            <MaterialCommunityIcons name="bullhorn" size={compact ? 60 : 76} color="#5CD7F7" />
          </View>
          <View style={styles.bannerCopy}>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.bannerTitle}>
              Ready to Collaborate?
            </Text>
            <Text numberOfLines={2} style={styles.bannerSubtitle}>
              Create a campaign and start connecting with influencers.
            </Text>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.86} onPress={handleCreatePress} style={styles.createButton}>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.createButtonText}>
                Create Campaign
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Campaign</Text>

        <View style={styles.chipRow}>
          {statusChips.map((chip) => {
            const selected = activeStatus === chip.value;

            return (
              <TouchableOpacity
                key={chip.value}
                accessibilityRole="button"
                activeOpacity={0.82}
                onPress={() => setActiveStatus(chip.value)}
                style={[styles.chip, selected && styles.chipActive]}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.9} style={styles.chipText}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={21} color={colors.black} />
          <Text style={styles.infoText}>Below shown are all the campaigns created by you, active, pending, completed ones and drafts.</Text>
        </View>
      </View>
    ),
    [activeStatus, compact, contentWidth, handleCreatePress],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.78} onPress={handleBackPress} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={colors.black} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>Campaign Management</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaign}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={styles.cardGap} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: screenPadding,
            paddingBottom: tabBarHeight + 28,
          },
        ]}
        ListEmptyComponent={
          <View style={[styles.emptyState, { width: contentWidth }]}>
            <Text style={styles.emptyTitle}>No {activeStatus} campaigns</Text>
            <Text style={styles.emptyText}>Create a campaign or switch filters to view more.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 36,
    height: 40,
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
    width: 36,
  },
  listContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 8,
  },
  contentFrame: {
    maxWidth: maxContentWidth,
  },
  banner: {
    height: 190,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#6F5AD8',
    paddingHorizontal: 18,
  },
  bannerCompact: {
    height: 184,
    paddingHorizontal: 12,
  },
  bannerIcon: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIconCompact: {
    width: 88,
  },
  bannerCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  bannerSubtitle: {
    alignSelf: 'stretch',
    marginTop: 8,
    color: colors.white,
    fontSize: typography.small,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    opacity: 0.88,
  },
  createButton: {
    alignSelf: 'stretch',
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.white,
    marginTop: 14,
    paddingHorizontal: 14,
  },
  createButtonText: {
    color: colors.black,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: fontWeight.heavy,
  },
  sectionTitle: {
    marginTop: 17,
    color: colors.black,
    fontSize: typography.bodyLarge,
    lineHeight: 21,
    fontWeight: fontWeight.heavy,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 9,
  },
  chip: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: '#F5D235',
  },
  chipText: {
    color: colors.black,
    fontSize: typography.bodyLarge,
    lineHeight: 20,
    fontWeight: fontWeight.bold,
  },
  infoBox: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderWidth: 1,
    borderColor: '#A7A7A7',
    borderRadius: 4,
    backgroundColor: colors.white,
    marginTop: 17,
    marginBottom: 20,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  infoText: {
    flex: 1,
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
  },
  cardGap: {
    height: 18,
  },
  emptyState: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 24,
  },
  emptyTitle: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  emptyText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: typography.small,
    textAlign: 'center',
  },
});
