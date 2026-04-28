import React, { useCallback, useMemo, useState } from 'react';
import { ImageBackground, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import { creatorPreviews } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function CreatorDiscoveryScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [contactVisible, setContactVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const creators = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return creatorPreviews;
    }

    return creatorPreviews.filter(
      (creator) =>
        creator.name.toLowerCase().includes(normalized) ||
        creator.handle.toLowerCase().includes(normalized) ||
        creator.categories.some((category) => category.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const creator = creators[activeIndex % Math.max(creators.length, 1)];
  const saved = Boolean(creator && savedIds.includes(creator.id));

  const nextCreator = useCallback(() => {
    setActiveIndex((current) => (creators.length ? (current + 1) % creators.length : 0));
  }, [creators.length]);

  const toggleSave = useCallback(() => {
    if (!creator) {
      return;
    }
    setSavedIds((current) => (current.includes(creator.id) ? current.filter((id) => id !== creator.id) : [...current, creator.id]));
  }, [creator]);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search creators" placeholderTextColor={colors.muted} style={styles.searchInput} />
        </View>
        <TouchableOpacity accessibilityRole="button" onPress={() => setFilterVisible(true)} style={styles.iconButton}>
          <MaterialCommunityIcons name="tune-variant" size={20} color={colors.black} />
        </TouchableOpacity>
      </View>

      {creator ? (
        <View style={styles.stage}>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('CreatorProfilePreview', { creatorId: creator.id })} style={styles.card}>
            <ImageBackground source={creator.avatar} style={styles.media} imageStyle={styles.mediaImage}>
              <View style={styles.scrim} />
              <View style={styles.chips}>
                {creator.categories.map((category) => (
                  <Text key={category} style={styles.chip}>{category}</Text>
                ))}
              </View>
              <View style={styles.creatorCopy}>
                <Text style={styles.creatorName}>{creator.name}</Text>
                <Text style={styles.handle}>{creator.handle}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>IG {creator.followers}</Text>
                  <Text style={styles.stat}>YT {creator.youtubeFollowers}</Text>
                  <Text style={styles.stat}>ER {creator.engagement}</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          <View style={styles.actions}>
            <RoundAction icon="close" tone="dark" onPress={nextCreator} />
            <RoundAction icon="account-plus-outline" tone="gold" onPress={() => setContactVisible(true)} />
            <RoundAction icon={saved ? 'bookmark' : 'bookmark-outline'} tone="dark" onPress={toggleSave} />
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No creators found</Text>
          <Text style={styles.emptyCopy}>Try another search term or clear filters.</Text>
        </View>
      )}

      <Modal visible={contactVisible} transparent animationType="fade" onRequestClose={() => setContactVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialCommunityIcons name="account-check-outline" size={34} color={colors.gold} />
            <Text style={styles.modalTitle}>Creator added</Text>
            <Text style={styles.modalCopy}>{creator?.name} has been added to your outreach shortlist.</Text>
            <PrimaryButton title="Done" onPress={() => setContactVisible(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>

      <Modal visible={filterVisible} transparent animationType="fade" onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialCommunityIcons name="filter-outline" size={34} color={colors.gold} />
            <Text style={styles.modalTitle}>Creator filters</Text>
            <Text style={styles.modalCopy}>Use search for category, handle, or name. Advanced filters are ready for backend facets.</Text>
            <PrimaryButton title="Close" onPress={() => setFilterVisible(false)} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

function RoundAction({
  icon,
  tone,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tone: 'gold' | 'dark';
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.84} accessibilityRole="button" onPress={onPress} style={[styles.roundAction, tone === 'gold' && styles.goldAction]}>
      <MaterialCommunityIcons name={icon} size={26} color={tone === 'gold' ? colors.black : colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.screen, backgroundColor: colors.white },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  searchBox: { flex: 1, minHeight: 42, flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, backgroundColor: colors.surfaceMuted, paddingHorizontal: spacing.md },
  searchInput: { flex: 1, color: colors.text, fontSize: typography.small, marginLeft: spacing.sm },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.screen },
  card: { width: '100%', maxWidth: 520, flex: 1, maxHeight: 660, overflow: 'hidden', borderRadius: radius.lg, backgroundColor: colors.black },
  media: { flex: 1, justifyContent: 'space-between' },
  mediaImage: { borderRadius: radius.lg },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, padding: spacing.lg },
  chip: { overflow: 'hidden', borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.84)', color: colors.black, fontSize: typography.caption, fontWeight: fontWeight.bold, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  creatorCopy: { padding: spacing.lg },
  creatorName: { color: colors.white, fontSize: typography.heading, fontWeight: fontWeight.heavy },
  handle: { marginTop: spacing.xs, color: colors.white, fontSize: typography.small, fontWeight: fontWeight.bold },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  stat: { color: colors.white, fontSize: typography.caption, fontWeight: fontWeight.bold },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, marginTop: -26 },
  roundAction: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 28, backgroundColor: colors.black },
  goldAction: { backgroundColor: colors.gold },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyTitle: { color: colors.text, fontSize: typography.bodyLarge, fontWeight: fontWeight.heavy },
  emptyCopy: { marginTop: spacing.xs, color: colors.muted, fontSize: typography.small, textAlign: 'center' },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.screen },
  modalCard: { width: '100%', maxWidth: 420, alignItems: 'center', borderRadius: radius.lg, backgroundColor: colors.white, padding: spacing.xxl },
  modalTitle: { marginTop: spacing.sm, color: colors.text, fontSize: typography.title, fontWeight: fontWeight.heavy },
  modalCopy: { marginTop: spacing.sm, color: colors.muted, fontSize: typography.small, lineHeight: 19, textAlign: 'center' },
  modalButton: { alignSelf: 'stretch', marginTop: spacing.xl },
});
