import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface RequirementRow {
  label: string;
  value: string;
}

interface RequirementsTableProps {
  rows: RequirementRow[];
}

export default function RequirementsTable({ rows }: RequirementsTableProps) {
  return (
    <View style={styles.table}>
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
  table: {
    marginTop: spacing.md,
    backgroundColor: '#FFE6B7',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  title: {
    marginBottom: spacing.sm,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.black,
    minHeight: 30,
  },
  label: {
    width: '38%',
    textAlignVertical: 'center',
    paddingHorizontal: 7,
    paddingVertical: 6,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  value: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: colors.black,
    paddingHorizontal: 7,
    paddingVertical: 6,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
});
