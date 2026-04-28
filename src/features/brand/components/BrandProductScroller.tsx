import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import type { BrandProduct } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandProductScrollerProps {
  products: BrandProduct[];
}

export default function BrandProductScroller({ products }: BrandProductScrollerProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Campaign Products</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Image source={item.image} style={styles.image} />
            <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  product: {
    width: 86,
    marginRight: spacing.md,
  },
  image: {
    width: 86,
    height: 86,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  name: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
});
