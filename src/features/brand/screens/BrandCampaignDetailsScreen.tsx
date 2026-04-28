import React, { useCallback, useMemo, useRef } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { brandCampaigns, brandProducts } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const requirements = [
  { label: 'Gender', value: 'Male' },
  { label: 'Age', value: '18-24 Yr' },
  { label: 'Category', value: 'Fashion, Lifestyle' },
  { label: 'Language', value: 'English, Tamil' },
  { label: 'Follower Size', value: '10k-100k' },
];

const briefGuidelines = [
  'Use the coupon code on the website and select products that fit your content style.',
  'Create your own script and share it with the team for approval.',
  'Shoot clean raw content with clear product visibility and natural lighting.',
  'Post the approved final video on your collaboration account and keep it live.',
  'The brand may reuse approved content for paid promotions and campaign reports.',
];

type DetailCampaign = {
  id: string;
  name: string;
  brandName: string;
  category: string;
  payout: string;
  imageUri: string;
  applicants: number;
  totalSlots: number;
  stats: {
    reel: number;
    story: number;
    post: number;
  };
};

export default function BrandCampaignDetailsScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'BrandCampaignDetails'>>();
  const productsRef = useRef<ScrollView>(null);
  const productOffsetRef = useRef(0);

  const campaign = useMemo<DetailCampaign>(() => {
    const matched = brandCampaigns.find((item) => item.id === route.params?.campaignId) ?? brandCampaigns[0];

    return {
      id: route.params?.campaignId ?? matched.id,
      name: matched.name,
      brandName: matched.brand,
      category: matched.category,
      payout: 'Upto 3000 INR / video',
      imageUri: typeof matched.image === 'object' && 'uri' in matched.image ? matched.image.uri ?? '' : '',
      applicants: matched.applicants || 122,
      totalSlots: 500,
      stats: { reel: 1, story: 2, post: 0 },
    };
  }, [route.params?.campaignId]);

  const progress = Math.min(100, Math.round((campaign.applicants / campaign.totalSlots) * 100));

  const handleShare = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        const webNavigator = (globalThis as { navigator?: { share?: (data: { title: string; text: string }) => Promise<void> } }).navigator;

        if (webNavigator?.share) {
          await webNavigator.share({
            title: campaign.name,
            text: `${campaign.name} by ${campaign.brandName} - ${campaign.payout}`,
          });
          return;
        }

        Alert.alert('Share campaign', `${campaign.name}\n${campaign.payout}`);
        return;
      }

      await Share.share({
        title: campaign.name,
        message: `${campaign.name} by ${campaign.brandName}\n${campaign.payout}`,
      });
    } catch {
      Alert.alert('Share unavailable', 'Could not open sharing on this device.');
    }
  }, [campaign]);

  const handleProductArrow = useCallback(() => {
    productOffsetRef.current += 128;
    productsRef.current?.scrollTo({ x: productOffsetRef.current, animated: true });
  }, []);

  const handleProductPress = useCallback((name: string) => {
    Alert.alert('Campaign Product', name);
  }, []);

  const handleApplicantsPress = useCallback(() => {
    navigation.navigate('CampaignApplicants', {
      campaignId: campaign.id,
      campaignName: campaign.name,
      applicantCount: campaign.applicants,
    });
  }, [campaign.applicants, campaign.id, campaign.name, navigation]);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Details</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Share campaign" activeOpacity={0.82} onPress={handleShare} style={styles.iconButton}>
          <MaterialCommunityIcons name="share-variant-outline" size={21} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ResponsiveContainer maxWidth={680}>
          <View style={styles.summaryCard}>
            <Image source={{ uri: campaign.imageUri || `https://picsum.photos/seed/${campaign.id}/500/500` }} style={styles.summaryImage} />
            <View style={styles.summaryContent}>
              <Text numberOfLines={2} style={styles.campaignName}>{campaign.name}</Text>
              <Text numberOfLines={1} style={styles.brandName}>{campaign.brandName}</Text>
              <Text numberOfLines={1} style={styles.payout}>{campaign.payout}</Text>

              <View style={styles.appliedBox}>
                <View style={styles.appliedHeader}>
                  <Text style={styles.appliedLabel}>Creators Applied</Text>
                  <Text style={styles.appliedCount}>{campaign.applicants}/{campaign.totalSlots}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
              </View>

              <View style={styles.statsStrip}>
                <Stat label="Reel" value={campaign.stats.reel} />
                <Stat label="Story" value={campaign.stats.story} />
                <Stat label="Post" value={campaign.stats.post} />
              </View>
            </View>
          </View>

          <Section title="Creator Requirements">
            <View style={styles.table}>
              {requirements.map((item, index) => (
                <View key={item.label} style={[styles.tableRow, index === requirements.length - 1 && styles.lastTableRow]}>
                  <Text style={styles.tableLabel}>{item.label}</Text>
                  <Text style={styles.tableValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Campaign Products">
            <View style={styles.productsRow}>
              <ScrollView ref={productsRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productList}>
                {brandProducts.map((product) => (
                  <TouchableOpacity key={product.id} accessibilityRole="button" activeOpacity={0.82} onPress={() => handleProductPress(product.name)}>
                    <Image source={product.image} style={styles.productImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Show more products" activeOpacity={0.82} onPress={handleProductArrow} style={styles.productArrow}>
                <MaterialCommunityIcons name="chevron-right" size={26} color={colors.black} />
              </TouchableOpacity>
            </View>
          </Section>

          <Section title="Campaign Brief">
            <Text style={styles.briefText}>
              Creators should build a clear, conversion-friendly campaign story around the product. Keep the tone natural, show the product early, and explain why it fits your daily routine.
            </Text>
            <View style={styles.briefMetaBox}>
              <Text style={styles.briefMetaLabel}>Coupon Code</Text>
              <Text style={styles.briefMetaValue}>LSCREATOR2K</Text>
              <Text style={styles.briefMetaLabel}>Website</Text>
              <Text style={styles.briefMetaValue}>www.layerstory.com</Text>
            </View>
            <View style={styles.guidelines}>
              {briefGuidelines.map((item) => (
                <View key={item} style={styles.guidelineRow}>
                  <MaterialCommunityIcons name="check-circle" size={15} color={colors.black} />
                  <Text style={styles.guidelineText}>{item}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.86} onPress={handleApplicantsPress} style={styles.applicantButton}>
              <Text style={styles.applicantButtonText}>Check Applicants</Text>
              <View style={styles.applicantCountBox}>
                <Text style={styles.applicantCountText}>{campaign.applicants}</Text>
              </View>
            </TouchableOpacity>
          </Section>
        </ResponsiveContainer>
      </ScrollView>
    </AppScreen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statColumn}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
  scroll: {
    paddingBottom: tabBarHeight + spacing.xxl,
  },
  summaryCard: {
    minHeight: 184,
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#EFEFEF',
    padding: spacing.md,
  },
  summaryImage: {
    width: 116,
    height: 156,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  summaryContent: {
    flex: 1,
    minWidth: 0,
  },
  campaignName: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: fontWeight.heavy,
  },
  brandName: {
    marginTop: spacing.xs,
    color: colors.mutedDark,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  payout: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  appliedBox: {
    borderRadius: radius.md,
    backgroundColor: '#F7A23B',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  appliedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  appliedLabel: {
    color: colors.black,
    fontSize: typography.tiny,
    fontWeight: fontWeight.heavy,
  },
  appliedCount: {
    color: colors.black,
    fontSize: typography.tiny,
    fontWeight: fontWeight.heavy,
  },
  progressTrack: {
    height: 7,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.58)',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
  statsStrip: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: '#269FE8',
    marginTop: spacing.sm,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: fontWeight.heavy,
  },
  statValue: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  section: {
    borderRadius: radius.lg,
    backgroundColor: '#F7E8C7',
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.md,
  },
  table: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.sm,
  },
  tableRow: {
    minHeight: 42,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    width: '43%',
    borderRightWidth: 1,
    borderRightColor: colors.black,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
    padding: spacing.sm,
  },
  tableValue: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    padding: spacing.sm,
  },
  productsRow: {
    minHeight: 106,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productList: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  productImage: {
    width: 92,
    height: 92,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  productArrow: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.black,
    marginLeft: spacing.sm,
  },
  briefText: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
  },
  briefMetaBox: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  briefMetaLabel: {
    color: colors.mutedDark,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
    textTransform: 'uppercase',
  },
  briefMetaValue: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  guidelines: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  guidelineText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
  },
  applicantButton: {
    minHeight: 48,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: '#F7A23B',
    marginTop: spacing.lg,
  },
  applicantButtonText: {
    flex: 1,
    alignSelf: 'center',
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  applicantCountBox: {
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E47F18',
  },
  applicantCountText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
});
