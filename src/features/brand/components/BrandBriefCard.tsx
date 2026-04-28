import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function BrandBriefCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Campaign Brief</Text>
      <Text style={styles.body}>
        Create short-form content that shows the product in daily use. Keep the hook clear in the first three seconds,
        show one product benefit, and close with the campaign offer.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  body: {
    marginTop: spacing.sm,
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
  },
});
