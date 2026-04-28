import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppInput from '../../../shared/components/AppInput';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search category, ideas, topics, anything...',
  showFilters = true,
}: SearchBarProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.back}>{'<'}</Text>
        <Text style={styles.title}>Search</Text>
        {showFilters ? <Text style={styles.filter}>▼ ▼</Text> : null}
      </View>
      <AppInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        left={<Text style={styles.searchIcon}>⌕</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  back: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.bold,
    marginRight: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  filter: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  searchIcon: {
    marginRight: 8,
    color: colors.muted,
  },
});
