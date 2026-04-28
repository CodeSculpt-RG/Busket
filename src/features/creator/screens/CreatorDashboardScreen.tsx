import React, { useCallback, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import BannerCarousel from '../components/BannerCarousel';
import CreatorHeader from '../components/CreatorHeader';
import HorizontalCampaignCard from '../components/HorizontalCampaignCard';
import HorizontalIdeaCard from '../components/HorizontalIdeaCard';
import SectionHeader from '../components/SectionHeader';
import ShortcutActionCard from '../components/ShortcutActionCard';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import { useCreatorProfile } from '../../../app/store/creator.store';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import {
  creatorBanners,
  creatorCampaigns,
  creatorIdeas,
  shortcutActions,
  type CreatorCampaign,
  type CreatorIdea,
  type ShortcutAction,
} from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

function getCategoryScore(itemCategories: string[], creatorCategories: string[]) {
  if (creatorCategories.length === 0) {
    return 0;
  }

  const normalizedCreatorCategories = creatorCategories.map((category) => category.toLowerCase());
  return itemCategories.reduce(
    (score, category) => score + (normalizedCreatorCategories.includes(category.toLowerCase()) ? 1 : 0),
    0,
  );
}

function personalizeByCategories<T extends { categories: string[] }>(items: T[], creatorCategories: string[]) {
  return [...items].sort(
    (first, second) =>
      getCategoryScore(second.categories, creatorCategories) - getCategoryScore(first.categories, creatorCategories),
  );
}

export default function CreatorDashboardScreen() {
  const navigation = useNavigation<NavigationProp<CreatorStackParamList>>();
  const creatorProfile = useCreatorProfile();

  const creatorName = creatorProfile?.fullName.trim() ?? '';
  const profileImage = creatorProfile?.avatarUri ? { uri: creatorProfile.avatarUri } : undefined;
  const creatorCategories = creatorProfile?.categories ?? [];
  const personalizedCampaigns = useMemo(
    () => personalizeByCategories(creatorCampaigns, creatorCategories),
    [creatorCategories],
  );
  const personalizedIdeas = useMemo(
    () => personalizeByCategories(creatorIdeas, creatorCategories),
    [creatorCategories],
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorCampaignTab' });
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorProfileTab' });
  }, [navigation]);

  const handleCampaignPress = useCallback(
    (campaignId: string) => {
      navigation.navigate('CampaignDetails', { campaignId });
    },
    [navigation],
  );

  const handleViewCampaigns = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorCampaignTab' });
  }, [navigation]);

  const handleViewIdeas = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorFeed' });
  }, [navigation]);

  const handleShortcutPress = useCallback(
    (id: string) => {
      if (id === 'campaigns') {
        navigation.navigate('CreatorTabs', { screen: 'CreatorCampaignTab' });
        return;
      }

      if (id === 'earnings') {
        navigation.navigate('Earnings');
        return;
      }

      if (id === 'learn') {
        navigation.navigate('LearnToEarn');
        return;
      }

      navigation.navigate('CreatorTabs', { screen: 'CreatorFeed' });
    },
    [navigation],
  );

  const renderCampaign = useCallback(
    ({ item }: { item: CreatorCampaign }) => <HorizontalCampaignCard campaign={item} onPress={handleCampaignPress} />,
    [handleCampaignPress],
  );

  const renderIdea = useCallback(({ item }: { item: CreatorIdea }) => <HorizontalIdeaCard idea={item} />, []);
  const renderShortcut = useCallback(
    ({ item }: { item: ShortcutAction }) => (
      <ShortcutActionCard id={item.id} title={item.title} icon={item.icon} onPress={handleShortcutPress} />
    ),
    [handleShortcutPress],
  );

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <CreatorHeader
        name={creatorName}
        profileImage={profileImage}
        onSearchPress={handleSearchPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ResponsiveContainer>
          <BannerCarousel banners={creatorBanners} />

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={shortcutActions}
            keyExtractor={(item) => item.id}
            renderItem={renderShortcut}
            contentContainerStyle={styles.shortcuts}
          />

          <SectionHeader title="Active Campaigns" actionLabel="View all campaigns" onActionPress={handleViewCampaigns} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={personalizedCampaigns}
            keyExtractor={(item) => item.id}
            renderItem={renderCampaign}
            style={styles.horizontalList}
          />

          <SectionHeader title="Trending Content Ideas" actionLabel="View all content ideas" onActionPress={handleViewIdeas} />
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={personalizedIdeas}
            keyExtractor={(item) => item.id}
            renderItem={renderIdea}
            style={styles.horizontalList}
          />

          <View style={styles.promo}>
            <Text style={styles.promoTitle}>Find Trained & Verified Creators only!</Text>
            <Text style={styles.promoSubtitle}>Backed By Creator Navigator!</Text>
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 98,
  },
  shortcuts: {
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  horizontalList: {
    marginBottom: 22,
  },
  promo: {
    marginTop: 4,
    paddingBottom: 24,
  },
  promoTitle: {
    color: colors.mutedDark,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: fontWeight.heavy,
  },
  promoSubtitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
});
