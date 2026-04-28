import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignMultiSelectProps {
  label: string;
  values: string[];
  options: readonly string[];
  errorText?: string;
  onChange: (values: string[]) => void;
}

export default function CampaignMultiSelect({ label, values, options, errorText, onChange }: CampaignMultiSelectProps) {
  const toggle = (option: string) => {
    onChange(values.includes(option) ? values.filter((item) => item !== option) : [...values, option]);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.wrap, errorText && styles.errorBox]}>
        {options.map((option) => {
          const selected = values.includes(option);

          return (
            <TouchableOpacity
              key={option}
              accessibilityRole="button"
              activeOpacity={0.78}
              onPress={() => toggle(option)}
              style={[styles.chip, selected && styles.activeChip]}
            >
              <Text style={[styles.chipText, selected && styles.activeText]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: spacing.md },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    padding: spacing.sm,
  },
  errorBox: {
    borderColor: colors.error,
  },
  chip: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
  },
  activeChip: {
    backgroundColor: colors.gold,
  },
  chipText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  activeText: {
    color: colors.black,
    fontWeight: fontWeight.heavy,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
  },
});
