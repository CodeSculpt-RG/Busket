import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { BrandBanner, BrandCampaign, BrandContentIdea, BrandShortcut } from '../../../shared/constants/mockBrandData';
import type { BrandStackParamList } from '../../../app/navigation/types';
import { useBrandProfile } from '../../../app/store/brand.store';
import BrandCampaignCard from '../components/BrandCampaignCard';
import BrandContentIdeaCard from '../components/BrandContentIdeaCard';
import BrandSectionHeader from '../components/BrandSectionHeader';
import BrandShortcutCard from '../components/BrandShortcutCard';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { brandBanners, brandCampaigns, brandContentIdeas, brandShortcuts } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { getResponsivePadding, maxContentWidth, tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const shortcutIconNames: Record<BrandShortcut['id'], React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  inspiration: 'filmstrip',
  creators: 'account-search-outline',
  wallet: 'wallet-outline',
};

export default function BrandDashboardScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const brandProfile = useBrandProfile();
  const { width } = useWindowDimensions();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerListRef = useRef<FlatList<BrandBanner>>(null);

  const horizontalPadding = getResponsivePadding(width);
  const contentWidth = Math.min(width - horizontalPadding * 2, maxContentWidth);
  const bannerWidth = Math.max(280, contentWidth);
  const shortcutWidth = Math.max(106, Math.floor((contentWidth - spacing.sm * 2) / 3));
  const campaignWidth = Math.min(308, Math.max(264, contentWidth * 0.78));
  const ideaWidth = Math.min(252, Math.max(220, contentWidth * 0.68));
  const brandName = brandProfile?.businessName?.trim() || 'Busket Business';

  const activeCampaigns = useMemo(
    () => brandCampaigns.filter((campaign) => campaign.status === 'Active'),
    [],
  );

  const handleShortcutPress = useCallback(
    (item: BrandShortcut) => {
      if (item.id === 'creators') {
        navigation.navigate('CreatorDiscovery');
        return;
      }

      if (item.id === 'wallet') {
        navigation.navigate('Payments');
        return;
      }

      navigation.navigate('BrandTrendFinder');
    },
    [navigation],
  );

  const handleBannerMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
      setActiveBannerIndex(Math.min(Math.max(nextIndex, 0), brandBanners.length - 1));
    },
    [bannerWidth],
  );

  const handleDotPress = useCallback(
    (index: number) => {
      setActiveBannerIndex(index);
      bannerListRef.current?.scrollToOffset({ offset: index * bannerWidth, animated: true });
    },
    [bannerWidth],
  );

  const renderBanner = useCallback(
    ({ item }: { item: BrandBanner }) => (
      <ImageBackground source={item.image} resizeMode="cover" style={[styles.banner, { width: bannerWidth }]} imageStyle={styles.bannerImage}>
        <View style={styles.bannerTint} />
        <View style={styles.bannerCopy}>
          <Text numberOfLines={2} style={styles.bannerTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.bannerSubtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
    ),
    [bannerWidth],
  );

  const renderCampaign = useCallback(
    ({ item }: { item: BrandCampaign }) => (
      <BrandCampaignCard
        campaign={item}
        onPress={() => navigation.navigate('BrandCampaignDetails', { campaignId: item.id })}
        style={{ width: campaignWidth }}
      />
    ),
    [campaignWidth, navigation],
  );

  const renderIdea = useCallback(
    ({ item }: { item: BrandContentIdea }) => (
      <BrandContentIdeaCard idea={item} onPress={() => navigation.navigate('BrandTrendFinder')} style={{ width: ideaWidth }} />
    ),
    [ideaWidth, navigation],
  );

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.kicker}>Welcome Back!</Text>
              <Text numberOfLines={1} style={styles.brandName}>{brandName}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                accessibilityLabel="Search creators"
                accessibilityRole="button"
                activeOpacity={0.78}
                onPress={() => navigation.navigate('CreatorDiscovery')}
                style={styles.iconButton}
              >
                <MaterialCommunityIcons name="magnify" size={22} color={colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel="Open notifications"
                accessibilityRole="button"
                activeOpacity={0.78}
                onPress={() => navigation.navigate('BrandNotifications')}
                style={styles.iconButton}
              >
                <MaterialCommunityIcons name="bell-outline" size={21} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bannerWrap}>
            <FlatList
              ref={bannerListRef}
              horizontal
              pagingEnabled
              data={brandBanners}
              keyExtractor={(item) => item.id}
              renderItem={renderBanner}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              decelerationRate="fast"
              snapToInterval={bannerWidth}
              onMomentumScrollEnd={handleBannerMomentumEnd}
              getItemLayout={(_, index) => ({ length: bannerWidth, offset: bannerWidth * index, index })}
            />
            <View style={styles.dots}>
              {brandBanners.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Show banner ${index + 1}`}
                  activeOpacity={0.7}
                  onPress={() => handleDotPress(index)}
                  style={[styles.dot, index === activeBannerIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          <View style={styles.shortcuts}>
            {brandShortcuts.map((item) => (
              <BrandShortcutCard
                key={item.id}
                title={item.title}
                icon={shortcutIconNames[item.id]}
                accentColor={item.accentColor}
                onPress={() => handleShortcutPress(item)}
                style={{ width: shortcutWidth }}
              />
            ))}
          </View>

          <View style={styles.section}>
            <BrandSectionHeader title="Active Campaigns" actionLabel="View All" onActionPress={() => navigation.navigate('BrandCampaigns')} />
            <FlatList
              horizontal
              data={activeCampaigns}
              keyExtractor={(item) => item.id}
              renderItem={renderCampaign}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={styles.listGap} />}
            />
          </View>

          <View style={styles.section}>
            <BrandSectionHeader title="Trending Content Ideas" actionLabel="View All" onActionPress={() => navigation.navigate('BrandTrendFinder')} />
            <FlatList
              horizontal
              data={brandContentIdeas}
              keyExtractor={(item) => item.id}
              renderItem={renderIdea}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={styles.listGap} />}
            />
          </View>

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
    backgroundColor: colors.white,
  },
  scroll: {
    paddingBottom: tabBarHeight + spacing.xxl,
  },
  header: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerCopy: {
    flex: 1,
  },
  kicker: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.semibold,
  },
  brandName: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.heading,
    lineHeight: 29,
    fontWeight: fontWeight.heavy,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  bannerWrap: {
    overflow: 'hidden',
  },
  banner: {
    height: 164,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  bannerImage: {
    borderRadius: radius.md,
  },
  bannerTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  bannerCopy: {
    padding: spacing.lg,
  },
  bannerTitle: {
    maxWidth: 360,
    color: colors.white,
    fontSize: typography.heading,
    lineHeight: 29,
    fontWeight: fontWeight.heavy,
  },
  bannerSubtitle: {
    maxWidth: 340,
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.gold,
  },
  shortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  section: {
    marginTop: spacing.xxl,
  },
  horizontalList: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  listGap: {
    width: spacing.md,
  },
  promo: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  promoTitle: {
    color: colors.text,
    fontSize: typography.title,
    lineHeight: 25,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  promoSubtitle: {
    marginTop: spacing.xs,
    color: colors.mutedDark,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
