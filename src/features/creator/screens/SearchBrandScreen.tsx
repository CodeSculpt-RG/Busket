import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { MemoizedBrandListItem } from '../components/BrandListItem';
import type { CreatorStackParamList, CreatorTabParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import { creatorBrands, type CreatorBrand } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { getResponsivePadding, maxContentWidth, tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type SearchBrandNavigation = NavigationProp<CreatorStackParamList & CreatorTabParamList>;
type SortMode = 'A-Z' | 'Z-A';

const ALL = 'All';
const categoryOptions = [
  ALL,
  'Premium Stationary',
  'Corporate Gifting',
  'Managed Office Spaces',
  'Media & Production House',
];
const sortOptions: SortMode[] = ['A-Z', 'Z-A'];

function matchesBrandSearch(brand: CreatorBrand, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return (
    brand.name.toLowerCase().includes(normalizedQuery) ||
    brand.subtitle.toLowerCase().includes(normalizedQuery) ||
    brand.category.toLowerCase().includes(normalizedQuery)
  );
}

export default function SearchBrandScreen() {
  const navigation = useNavigation<SearchBrandNavigation>();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [sortMode, setSortMode] = useState<SortMode>('A-Z');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const brands = useMemo(() => {
    const filtered = creatorBrands.filter(
      (brand) =>
        matchesBrandSearch(brand, query) &&
        (category === ALL || brand.subtitle === category),
    );

    return [...filtered].sort((first, second) =>
      sortMode === 'A-Z' ? first.name.localeCompare(second.name) : second.name.localeCompare(first.name),
    );
  }, [category, query, sortMode]);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('CreatorHome');
  }, [navigation]);

  const handleCampaignPress = useCallback(() => {
    navigation.navigate('SearchCampaign');
  }, [navigation]);

  const handleBrandPress = useCallback(
    (brandName: string) => {
      try {
        navigation.navigate('CreatorTabs', { screen: 'CreatorCampaignTab', params: { brandName } });
      } catch {
        Alert.alert('Brand selected', brandName);
      }
    },
    [navigation],
  );

  const renderBrand = useCallback(
    ({ item }: { item: CreatorBrand }) => <MemoizedBrandListItem brand={item} onPress={handleBrandPress} />,
    [handleBrandPress],
  );

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={handleBackPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Filter category" activeOpacity={0.82} onPress={() => setCategoryModalVisible(true)} style={styles.iconButton}>
            <MaterialCommunityIcons name="filter-variant" size={22} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Sort brands" activeOpacity={0.82} onPress={() => setSortModalVisible(true)} style={styles.iconButton}>
            <MaterialCommunityIcons name="sort-alphabetical-ascending" size={22} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={brands}
        keyExtractor={(item) => item.id}
        renderItem={renderBrand}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingHorizontal: getResponsivePadding(width) }]}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search category, ideas, topics, anything..."
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.chips}>
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} style={[styles.modeChip, styles.activeModeChip]}>
                <Text style={[styles.modeChipText, styles.activeModeChipText]}>Brand</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={handleCampaignPress} style={styles.modeChip}>
                <Text style={styles.modeChipText}>Campaign</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No brands found</Text>
            <Text style={styles.emptyCopy}>Try another keyword, category, or sort option.</Text>
          </View>
        }
      />

      <OptionModal
        title="Filter by category"
        visible={categoryModalVisible}
        options={categoryOptions}
        activeOption={category}
        onClose={() => setCategoryModalVisible(false)}
        onSelect={(option) => {
          setCategory(option);
          setCategoryModalVisible(false);
        }}
      />
      <OptionModal
        title="Sort brands"
        visible={sortModalVisible}
        options={sortOptions}
        activeOption={sortMode}
        onClose={() => setSortModalVisible(false)}
        onSelect={(option) => {
          setSortMode(option as SortMode);
          setSortModalVisible(false);
        }}
      />
    </AppScreen>
  );
}

function OptionModal({
  title,
  visible,
  options,
  activeOption,
  onClose,
  onSelect,
}: {
  title: string;
  visible: boolean;
  options: readonly string[];
  activeOption: string;
  onClose: () => void;
  onSelect: (option: string) => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((option) => {
            const active = option === activeOption;

            return (
              <TouchableOpacity key={option} accessibilityRole="button" activeOpacity={0.82} onPress={() => onSelect(option)} style={[styles.optionRow, active && styles.activeOptionRow]}>
                <Text style={[styles.optionText, active && styles.activeOptionText]}>{option}</Text>
                {active ? <MaterialCommunityIcons name="check" size={18} color={colors.black} /> : null}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  list: {
    flexGrow: 1,
    paddingBottom: tabBarHeight + spacing.xxl,
    alignItems: 'center',
  },
  listHeader: {
    width: '100%',
    maxWidth: maxContentWidth,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  searchBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.text,
    fontSize: typography.small,
    paddingVertical: 0,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modeChip: {
    minHeight: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  activeModeChip: {
    backgroundColor: colors.gold,
  },
  modeChipText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  activeModeChipText: {
    color: colors.black,
    fontWeight: fontWeight.heavy,
  },
  gap: {
    height: spacing.md,
  },
  emptyState: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.xxl,
    marginTop: spacing.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  emptyCopy: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
    padding: spacing.md,
  },
  modalCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    marginBottom: spacing.sm,
  },
  optionRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  activeOptionRow: {
    backgroundColor: colors.goldSoft,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  activeOptionText: {
    fontWeight: fontWeight.heavy,
  },
});
