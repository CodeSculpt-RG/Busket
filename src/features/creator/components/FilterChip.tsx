import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  compact?: boolean;
}

function FilterChip({ label, active, onPress, compact = false }: FilterChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.78}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, compact && styles.compactChip, active && styles.activeChip]}
    >
      <Text style={[styles.label, compact && styles.compactLabel, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(FilterChip);

const styles = StyleSheet.create({
  chip: {
    minWidth: 98,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
  },
  activeChip: {
    backgroundColor: colors.gold,
  },
  compactChip: {
    minWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  label: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.medium,
  },
  compactLabel: {
    fontSize: typography.caption,
  },
  activeLabel: {
    fontWeight: fontWeight.bold,
  },
});
