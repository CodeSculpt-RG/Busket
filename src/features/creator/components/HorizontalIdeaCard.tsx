import React from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import type { CreatorIdea } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface HorizontalIdeaCardProps {
  idea: CreatorIdea;
}

export default function HorizontalIdeaCard({ idea }: HorizontalIdeaCardProps) {
  return (
    <ImageBackground source={idea.image} style={styles.card} imageStyle={styles.image}>
      <Text style={styles.title}>{idea.title}</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 112,
    height: 118,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
  },
  image: {
    borderRadius: radius.sm,
  },
  title: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    backgroundColor: colors.overlay,
    padding: 6,
  },
});
