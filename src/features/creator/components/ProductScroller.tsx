import React, { useCallback, useRef } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CreatorProduct } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface ProductScrollerProps {
  products: CreatorProduct[];
}

function ProductScroller({ products }: ProductScrollerProps) {
  const listRef = useRef<FlatList<CreatorProduct>>(null);
  const nextIndexRef = useRef(0);

  const handleNextPress = useCallback(() => {
    if (products.length === 0) {
      return;
    }

    nextIndexRef.current = (nextIndexRef.current + 1) % products.length;
    listRef.current?.scrollToIndex({ index: nextIndexRef.current, animated: true, viewPosition: 0.2 });
  }, [products.length]);

  const renderProduct = useCallback(
    ({ item }: { item: CreatorProduct }) => (
      <View style={styles.productCard}>
        <Image source={item.image} style={styles.product} />
      </View>
    ),
    [],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Campaign Products</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Next products" activeOpacity={0.82} onPress={handleNextPress} style={styles.arrowButton}>
          <MaterialCommunityIcons name="arrow-right" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        onScrollToIndexFailed={() => undefined}
      />
    </View>
  );
}

export default React.memo(ProductScroller);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#FFE6B7',
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  arrowButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  productCard: {
    width: 78,
    height: 78,
    overflow: 'hidden',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
  },
  product: {
    width: '100%',
    height: '100%',
  },
});
