import React, { memo, useMemo } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { CreatorIdea } from '../../../shared/constants/mockCreatorData';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { creatorIdeas } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { getColumns } from '../../../shared/theme/responsive';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const FeedTile = memo(({ item }: { item: CreatorIdea }) => (
  <ImageBackground source={item.image} style={styles.tile} imageStyle={styles.tileImage}>
    <Text numberOfLines={2} style={styles.title}>
      {item.title}
    </Text>
  </ImageBackground>
));

export default function CreatorFeedScreen() {
  const { width } = useWindowDimensions();
  const columns = getColumns(width);
  const data = useMemo(() => [...creatorIdeas, ...creatorIdeas, ...creatorIdeas, ...creatorIdeas], []);

  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.container}>
        <FlatList
          data={data}
          key={columns}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={columns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.tileWrap}>
              <FeedTile item={item} />
            </View>
          )}
          initialNumToRender={9}
          maxToRenderPerBatch={9}
          windowSize={7}
          ListHeaderComponent={<Text style={styles.heading}>Feed</Text>}
        />
      </ResponsiveContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: 98,
  },
  row: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tileWrap: {
    flex: 1,
  },
  heading: {
    marginBottom: spacing.md,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  tile: {
    flex: 1,
    aspectRatio: 0.78,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  tileImage: {
    borderRadius: radius.sm,
  },
  title: {
    color: colors.white,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: fontWeight.bold,
    backgroundColor: colors.overlay,
    padding: 6,
  },
});
