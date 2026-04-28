import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import CampaignListCard from '../components/CampaignListCard';
import SearchFilterPanel from '../components/SearchFilterPanel';
import SearchHeader from '../components/SearchHeader';
import type { CreatorStackParamList, CreatorTabParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import { creatorCampaigns, type CreatorCampaign } from '../../../shared/constants/mockCreatorData';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type SearchCampaignNavigation = NavigationProp<CreatorStackParamList & CreatorTabParamList>;
type SearchCampaignRoute = RouteProp<CreatorStackParamList, 'SearchCampaign'> | RouteProp<CreatorTabParamList, 'CreatorCampaignTab'>;

const ALL = 'All';
const STATUS_OPTIONS = [ALL, 'live', 'active', 'closed'] as const;
const CONTENT_OPTIONS = [ALL, 'reel', 'story', 'post'] as const;

function matchesCampaignSearch(campaign: CreatorCampaign, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return (
    campaign.name.toLowerCase().includes(normalizedQuery) ||
    campaign.brand.toLowerCase().includes(normalizedQuery) ||
    campaign.categories.some((category) => category.toLowerCase().includes(normalizedQuery)) ||
    campaign.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
}

function hasContentType(campaign: CreatorCampaign, contentType: string) {
  if (contentType === ALL) {
    return true;
  }

  return campaign.stats[contentType as keyof CreatorCampaign['stats']] > 0 || campaign.tags.includes(contentType);
}

export default function SearchCampaignScreen() {
  const navigation = useNavigation<SearchCampaignNavigation>();
  const route = useRoute<SearchCampaignRoute>();
  const routeBrandName = 'params' in route ? route.params?.brandName : undefined;
  const [query, setQuery] = useState(routeBrandName ?? '');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [category, setCategory] = useState<string>(ALL);
  const [status, setStatus] = useState<string>(ALL);
  const [contentType, setContentType] = useState<string>(ALL);
  const [highPayoutFirst, setHighPayoutFirst] = useState(true);

  useEffect(() => {
    if (routeBrandName) {
      setQuery(routeBrandName);
    }
  }, [routeBrandName]);

  const categoryOptions = useMemo(
    () => [ALL, ...Array.from(new Set(creatorCampaigns.flatMap((campaign) => campaign.categories))).sort()],
    [],
  );

  const campaigns = useMemo(() => {
    const filtered = creatorCampaigns.filter(
      (campaign) =>
        matchesCampaignSearch(campaign, query) &&
        (category === ALL || campaign.categories.includes(category)) &&
        (status === ALL || campaign.status === status) &&
        hasContentType(campaign, contentType),
    );

    return filtered.sort((first, second) =>
      highPayoutFirst ? second.payoutAmount - first.payoutAmount : first.payoutAmount - second.payoutAmount,
    );
  }, [category, contentType, highPayoutFirst, query, status]);

  const handleCampaignPress = useCallback(
    (campaignId: string) => {
      navigation.navigate('CampaignDetails', { campaignId });
    },
    [navigation],
  );

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('CreatorHome');
  }, [navigation]);

  const handleBrandPress = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorExplore' });
  }, [navigation]);

  const handleCampaignPressNoop = useCallback(() => undefined, []);

  const handleFilterPress = useCallback(() => {
    setFiltersVisible((visible) => !visible);
  }, []);

  const handleSortPress = useCallback(() => {
    setHighPayoutFirst((current) => !current);
  }, []);

  const renderCampaign = useCallback(
    ({ item }: { item: CreatorCampaign }) => <CampaignListCard campaign={item} onPress={handleCampaignPress} />,
    [handleCampaignPress],
  );

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <SearchHeader
        mode="Campaign"
        query={query}
        filterPanelVisible={filtersVisible}
        sortDescending={highPayoutFirst}
        onBackPress={handleBackPress}
        onQueryChange={setQuery}
        onBrandPress={handleBrandPress}
        onCampaignPress={handleCampaignPressNoop}
        onFilterPress={handleFilterPress}
        onSortPress={handleSortPress}
      />

      {filtersVisible ? (
        <>
          <SearchFilterPanel title="Category" options={categoryOptions} activeOption={category} onSelect={setCategory} />
          <SearchFilterPanel title="Status" options={STATUS_OPTIONS} activeOption={status} onSelect={setStatus} />
          <SearchFilterPanel title="Content Type" options={CONTENT_OPTIONS} activeOption={contentType} onSelect={setContentType} />
        </>
      ) : null}

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaign}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No campaigns found</Text>
            <Text style={styles.emptyCopy}>Try another keyword or clear a filter.</Text>
          </View>
        }
      />

    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: tabBarHeight + spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  emptyCopy: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
