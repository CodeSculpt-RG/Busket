import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, type ImageSourcePropType, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export type BrandCampaignCardData = {
  id: string;
  name: string;
  category: string;
  payout: string;
  status?: string;
  brandName?: string;
  brand?: string;
  brief?: string;
  startDate?: string;
  endDate?: string;
  productLink?: string;
  image?: ImageSourcePropType;
  applicants?: number;
  totalSlots?: number;
  stats?: {
    reel: number;
    story: number;
    post: number;
  };
};

interface BrandCampaignCardProps {
  campaign: BrandCampaignCardData;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'management';
}

function BrandCampaignCard({ campaign, onPress, style, variant = 'default' }: BrandCampaignCardProps) {
  const { width } = useWindowDimensions();
  const applicants = campaign.applicants ?? 24;
  const totalSlots = campaign.totalSlots ?? 100;
  const progress = Math.min(100, Math.round((applicants / Math.max(totalSlots, 1)) * 100));
  const stats = campaign.stats ?? { reel: 1, story: 2, post: 0 };
  const image = campaign.image ?? { uri: `https://picsum.photos/seed/${campaign.id}/400/400` };
  const managementImageWidth = width < 380 ? 126 : 140;

  if (variant === 'management') {
    return (
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={onPress} style={[styles.managementCard, style]}>
        <Image source={image} resizeMode="cover" style={[styles.managementImage, { width: managementImageWidth }]} />
        <View style={styles.managementContent}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.managementName}>
            {campaign.name}
          </Text>
          <Text numberOfLines={1} style={styles.managementBrand}>{campaign.brandName ?? campaign.brand ?? 'By Brand Name'}</Text>
          <View style={styles.managementPayoutRow}>
            <View style={styles.payoutCheck}>
              <MaterialCommunityIcons name="check" size={10} color={colors.white} />
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.managementPayout}>
              {campaign.payout || 'Upto 3000 INR / video'}
            </Text>
          </View>

          <View style={styles.managementAppliedBox}>
            <View style={styles.managementAppliedHeader}>
              <Text numberOfLines={1} style={styles.managementAppliedLabel}>Creators Applied</Text>
              <Text numberOfLines={1} style={styles.managementAppliedCount}>{applicants}/{totalSlots}</Text>
            </View>
            <View style={styles.managementProgressTrack}>
              <View style={[styles.managementProgressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <View style={styles.managementStatsStrip}>
            <ManagementStat label="Reel" value={stats.reel} />
            <View style={styles.managementDivider} />
            <ManagementStat label="Story" value={stats.story} />
            <View style={styles.managementDivider} />
            <ManagementStat label="Post" value={stats.post} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={onPress} style={[styles.card, style]}>
      <Image source={image} resizeMode="cover" style={styles.image} />
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>{campaign.name}</Text>
        <Text numberOfLines={1} style={styles.brand}>{campaign.brandName ?? campaign.brand ?? 'Busket Brand'}</Text>
        <Text numberOfLines={1} style={styles.payout}>{campaign.payout}</Text>

        <View style={styles.appliedBox}>
          <View style={styles.appliedHeader}>
            <Text style={styles.appliedLabel}>Creators Applied</Text>
            <Text style={styles.appliedCount}>{applicants}/{totalSlots}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.statsStrip}>
          <Stat icon="movie-open-play-outline" label="Reel" value={stats.reel} />
          <Stat icon="progress-clock" label="Story" value={stats.story} />
          <Stat icon="image-outline" label="Post" value={stats.post} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(BrandCampaignCard);

function ManagementStat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.managementStat}>
      <Text numberOfLines={1} style={styles.managementStatLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.managementStatValue}>{value}</Text>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: number;
}) {
  return (
    <View style={styles.stat}>
      <MaterialCommunityIcons name={icon} size={12} color={colors.white} />
      <Text numberOfLines={1} style={styles.statText}>{label}: {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  managementCard: {
    height: 180,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 7,
    backgroundColor: '#D9D9D9',
    padding: 9,
  },
  managementImage: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.surfaceMuted,
  },
  managementContent: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 7,
  },
  managementName: {
    color: colors.black,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: fontWeight.heavy,
  },
  managementBrand: {
    color: colors.black,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.regular,
  },
  managementPayoutRow: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payoutCheck: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: colors.gold,
  },
  managementPayout: {
    flex: 1,
    minWidth: 0,
    color: colors.black,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: fontWeight.heavy,
  },
  managementAppliedBox: {
    height: 36,
    justifyContent: 'center',
    backgroundColor: '#FF9F00',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  managementAppliedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 7,
  },
  managementAppliedLabel: {
    flex: 1,
    color: colors.black,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: fontWeight.heavy,
  },
  managementAppliedCount: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: fontWeight.heavy,
  },
  managementProgressTrack: {
    height: 4,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: '#FFDFA4',
    marginTop: 4,
  },
  managementProgressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: '#00A7B3',
  },
  managementStatsStrip: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#30AEEF',
    marginTop: 6,
  },
  managementStat: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  managementStatLabel: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: fontWeight.heavy,
  },
  managementStatValue: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 28,
    fontWeight: fontWeight.heavy,
  },
  managementDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.white,
    opacity: 0.9,
  },
  card: {
    minHeight: 176,
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#EFEFEF',
    padding: spacing.md,
  },
  image: {
    width: 112,
    height: 148,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  brand: {
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
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
  statsStrip: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#269FE8',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  statText: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: fontWeight.heavy,
  },
});
