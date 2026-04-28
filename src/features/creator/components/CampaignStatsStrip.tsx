import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignStatsStripProps {
  stats: {
    reel: number;
    story: number;
    post: number;
  };
}

export default function CampaignStatsStrip({ stats }: CampaignStatsStripProps) {
  return (
    <View style={styles.row}>
      <Stat label="Reel" value={stats.reel} />
      <Stat label="Story" value={stats.story} />
      <Stat label="Post" value={stats.post} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.blue,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  value: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    lineHeight: 20,
  },
});
