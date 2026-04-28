import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BrandCampaignStatus } from '../../../app/store/brandCampaign.store';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const labels: Array<{ value: BrandCampaignStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
];

interface CampaignStatusChipsProps {
  value: BrandCampaignStatus;
  onChange: (status: BrandCampaignStatus) => void;
}

export default function CampaignStatusChips({ value, onChange }: CampaignStatusChipsProps) {
  return (
    <View style={styles.row}>
      {labels.map((item) => {
        const selected = item.value === value;

        return (
          <TouchableOpacity
            key={item.value}
            accessibilityRole="button"
            activeOpacity={0.82}
            onPress={() => onChange(item.value)}
            style={[styles.chip, selected && styles.activeChip]}
          >
            <Text style={[styles.text, selected && styles.activeText]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    minHeight: 38,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  activeChip: {
    backgroundColor: colors.gold,
  },
  text: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  activeText: {
    color: colors.black,
    fontWeight: fontWeight.heavy,
  },
});
