import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface StatsPillProps {
  label: string;
  value: string;
}

export default function StatsPill({ label, value }: StatsPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minWidth: 78,
    alignItems: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  label: {
    color: colors.muted,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
  },
});
