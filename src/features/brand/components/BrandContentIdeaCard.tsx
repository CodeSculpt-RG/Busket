import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import type { BrandContentIdea } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandContentIdeaCardProps {
  idea: BrandContentIdea;
  onPress?: () => void;
  style?: ViewStyle;
}

function BrandContentIdeaCard({ idea, onPress, style }: BrandContentIdeaCardProps) {
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={onPress} style={[styles.card, style]}>
      <ImageBackground source={idea.image} resizeMode="cover" style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.tint} />
        <View style={styles.badge}>
          <MaterialCommunityIcons name={idea.icon} size={16} color={colors.black} />
          <Text numberOfLines={1} style={styles.badgeText}>{idea.format}</Text>
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.title}>{idea.title}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{idea.subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default React.memo(BrandContentIdeaCard);

const styles = StyleSheet.create({
  card: {
    width: 238,
    height: 154,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  imageRadius: {
    borderRadius: radius.md,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  badge: {
    alignSelf: 'flex-start',
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    color: colors.black,
    fontSize: typography.tiny,
    fontWeight: fontWeight.heavy,
    textTransform: 'uppercase',
  },
  copy: {
    position: 'relative',
  },
  title: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    lineHeight: 20,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.semibold,
  },
});
