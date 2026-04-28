import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CreatorBrand } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandListItemProps {
  brand: CreatorBrand;
  onPress?: (brandName: string) => void;
}

export default function BrandListItem({ brand, onPress }: BrandListItemProps) {
  const handlePress = React.useCallback(() => {
    onPress?.(brand.name);
  }, [brand.name, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.84} accessibilityRole="button" onPress={handlePress} style={styles.item}>
      <Image source={brand.image} style={styles.logo} />
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>{brand.name}</Text>
        <Text numberOfLines={1} style={styles.subtitle}>{brand.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

export const MemoizedBrandListItem = React.memo(BrandListItem);

const styles = StyleSheet.create({
  item: {
    width: '100%',
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.mutedDark,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
});
