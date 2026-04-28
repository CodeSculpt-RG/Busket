import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { CreatorCampaign } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { fontWeight, typography } from '../../../shared/theme/typography';
import CampaignStatsStrip from './CampaignStatsStrip';

interface CampaignHeaderCardProps {
  campaign: CreatorCampaign;
}

function CampaignHeaderCard({ campaign }: CampaignHeaderCardProps) {
  const progress = Math.min(campaign.applied / campaign.totalSlots, 1);

  return (
    <View style={styles.card}>
      <Image source={campaign.image} style={styles.image} />
      <View style={styles.copy}>
        <View style={styles.textBlock}>
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
    </View>
  );
}

export default React.memo(CampaignHeaderCard);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    minHeight: 142,
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: '#E7E7E7',
  },
  image: {
    width: 118,
    height: 142,
    backgroundColor: colors.surfaceMuted,
  },
  copy: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  textBlock: {
    paddingHorizontal: 10,
  },
  title: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  brand: {
    color: colors.text,
    fontSize: typography.caption,
  },
  payout: {
    marginTop: 5,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  progressBlock: {
    backgroundColor: colors.gold,
    marginTop: 8,
    paddingHorizontal: 8,
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
