import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import type { CreatorPreview } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import StatsPill from './StatsPill';

interface CreatorPreviewCardProps {
  creator: CreatorPreview;
}

export default function CreatorPreviewCard({ creator }: CreatorPreviewCardProps) {
  return (
    <View style={styles.card}>
      <ImageBackground source={creator.avatar} style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.tint} />
        <View style={styles.identity}>
          <Text style={styles.name}>{creator.name}</Text>
          <Text style={styles.meta}>{creator.handle} · {creator.age} · {creator.city}</Text>
        </View>
      </ImageBackground>
      <View style={styles.stats}>
        <StatsPill label="Followers" value={creator.followers} />
        <StatsPill label="Engage" value={creator.engagement} />
        <StatsPill label="Commercial" value={creator.commercials} />
      </View>
      <Text style={styles.niche}>{creator.niche}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.black,
  },
  image: {
    height: 430,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  identity: {
    padding: spacing.lg,
  },
  name: {
    color: colors.white,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  meta: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    padding: spacing.md,
  },
  niche: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
});
