import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { BrandBanner } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandBannerCarouselProps {
  banners: BrandBanner[];
}

export default function BrandBannerCarousel({ banners }: BrandBannerCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - spacing.screen * 2, 524);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={banners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={[styles.banner, { width: cardWidth }]} imageStyle={styles.image}>
            <View style={styles.tint} />
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </ImageBackground>
        )}
      />
      <View style={styles.dots}>
        {banners.map((item, index) => (
          <View key={item.id} style={[styles.dot, index === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 132,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginRight: spacing.md,
    borderRadius: radius.lg,
  },
  image: {
    borderRadius: radius.lg,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  copy: {
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    maxWidth: 260,
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.semibold,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.gold,
  },
});
