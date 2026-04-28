import React, { useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { CreatorBanner } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { maxContentWidth } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BannerCarouselProps {
  banners: CreatorBanner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = Math.min(width - spacing.screen * 2, maxContentWidth);

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={banners}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={[styles.banner, { width: cardWidth }]} imageStyle={styles.image}>
            <View style={styles.scrim}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </ImageBackground>
        )}
      />

      <View style={styles.dots}>
        {banners.map((item, index) => (
          <View key={item.id} style={[styles.dot, index === activeIndex && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 134,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.charcoal,
  },
  image: {
    borderRadius: radius.md,
  },
  scrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: 3,
    color: colors.surfaceMuted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.muted,
  },
  activeDot: {
    backgroundColor: colors.gold,
  },
});
