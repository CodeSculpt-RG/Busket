import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CreatorCampaign } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import CampaignStatsStrip from './CampaignStatsStrip';

interface CampaignListCardProps {
  campaign: CreatorCampaign;
  onPress: (campaignId: string) => void;
}

function CampaignListCard({ campaign, onPress }: CampaignListCardProps) {
  const progress = Math.min(campaign.applied / campaign.totalSlots, 1);
  const handlePress = React.useCallback(() => {
    onPress(campaign.id);
  }, [campaign.id, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.84} accessibilityRole="button" onPress={handlePress} style={styles.card}>
      <Image source={campaign.image} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>{campaign.name}</Text>
          <Text numberOfLines={1} style={styles.brand}>By {campaign.brand}</Text>
          <Text numberOfLines={1} style={styles.payout}>{campaign.payout}</Text>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Creators Applied</Text>
            <Text style={styles.progressValue}>{campaign.applied}/{campaign.totalSlots}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <CampaignStatsStrip stats={campaign.stats} />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(CampaignListCard);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    minHeight: 148,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  thumbnail: {
    width: 118,
    height: 148,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 9,
  },
  copy: {
    paddingHorizontal: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.bold,
  },
  brand: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  payout: {
    marginTop: 3,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  progressBlock: {
    backgroundColor: colors.goldSoft,
    marginTop: 5,
    paddingHorizontal: spacing.sm,
    paddingTop: 5,
    paddingBottom: 6,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  progressValue: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  progressTrack: {
    height: 4,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.16)',
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
});
