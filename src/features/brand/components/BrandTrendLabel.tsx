import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandTrendLabelProps {
  label: string;
  style?: ViewStyle;
}

export default function BrandTrendLabel({ label, style }: BrandTrendLabelProps) {
  return (
    <View style={[styles.label, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
});
