import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppInput from '../../../shared/components/AppInput';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import FilterChip from './FilterChip';

interface SearchHeaderProps {
  mode: 'Brand' | 'Campaign';
  query: string;
  filterPanelVisible: boolean;
  sortDescending: boolean;
  onBackPress: () => void;
  onQueryChange: (value: string) => void;
  onBrandPress: () => void;
  onCampaignPress: () => void;
  onFilterPress: () => void;
  onSortPress: () => void;
}

export default function SearchHeader({
  mode,
  query,
  filterPanelVisible,
  sortDescending,
  onBackPress,
  onQueryChange,
  onBrandPress,
  onCampaignPress,
  onFilterPress,
  onSortPress,
}: SearchHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={onBackPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Toggle filters"
            activeOpacity={0.82}
            onPress={onFilterPress}
            style={[styles.iconButton, filterPanelVisible && styles.activeIconButton]}
          >
            <MaterialCommunityIcons name="tune-variant" size={20} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Toggle sort"
            activeOpacity={0.82}
            onPress={onSortPress}
            style={[styles.iconButton, sortDescending && styles.activeIconButton]}
          >
            <MaterialCommunityIcons name={sortDescending ? 'sort-descending' : 'sort-ascending'} size={20} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <AppInput
        value={query}
        onChangeText={onQueryChange}
        placeholder="Search category, ideas, topics, anything..."
        autoCorrect={false}
        returnKeyType="search"
        left={<MaterialCommunityIcons name="magnify" size={19} color={colors.muted} style={styles.searchIcon} />}
        containerStyle={styles.searchInput}
      />

      <View style={styles.chips}>
        <FilterChip label="Brand" active={mode === 'Brand'} onPress={onBrandPress} />
        <FilterChip label="Campaign" active={mode === 'Campaign'} onPress={onCampaignPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  topRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  activeIconButton: {
    backgroundColor: colors.goldSoft,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
