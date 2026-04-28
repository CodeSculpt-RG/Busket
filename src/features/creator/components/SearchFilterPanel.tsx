import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import FilterChip from './FilterChip';

interface SearchFilterPanelProps {
  title: string;
  options: readonly string[];
  activeOption: string;
  onSelect: (option: string) => void;
}

export default function SearchFilterPanel({ title, options, activeOption, onSelect }: SearchFilterPanelProps) {
  const handleSelect = React.useCallback((option: string) => onSelect(option), [onSelect]);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.options}>
        {options.map((option) => (
          <FilterOption key={option} option={option} active={option === activeOption} onSelect={handleSelect} />
        ))}
      </View>
    </View>
  );
}

interface FilterOptionProps {
  option: string;
  active: boolean;
  onSelect: (option: string) => void;
}

const FilterOption = React.memo(function FilterOption({ option, active, onSelect }: FilterOptionProps) {
  const handlePress = React.useCallback(() => {
    onSelect(option);
  }, [onSelect, option]);

  return <FilterChip label={option} active={active} onPress={handlePress} compact />;
});

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: spacing.screen,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
