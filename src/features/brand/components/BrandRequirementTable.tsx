import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BrandRequirement } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandRequirementTableProps {
  rows: BrandRequirement[];
}

export default function BrandRequirementTable({ rows }: BrandRequirementTableProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Creator Requirements</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: '#F3D89D',
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  row: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.16)',
  },
  label: {
    width: 96,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
});
