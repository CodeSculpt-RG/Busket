import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { creatorPreviews } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const fallbackCreator = {
  id: 'creator-fallback',
  name: 'Rahul Nair',
  handle: '@RahulNair11',
  gender: 'Male',
  age: 26,
  avatar: { uri: 'https://picsum.photos/seed/rahul-nair-creator/700/900' },
  followers: '20k',
  youtubeFollowers: '114k',
  rating: '4.3',
  categories: ['Fashion', 'Lifestyle', 'Vlog', 'UGC', 'Cinematic Shoot'],
  bio: "I'm a passionate creator with 2 years of content and social media experience specially in fashion and lifestyle content for brands.",
};

const reels = [
  { id: 'reel-1', title: 'Fashion Reel', image: 'https://picsum.photos/seed/rahul-reel-1/360/640' },
  { id: 'reel-2', title: 'Lifestyle Vlog', image: 'https://picsum.photos/seed/rahul-reel-2/360/640' },
  { id: 'reel-3', title: 'UGC Shoot', image: 'https://picsum.photos/seed/rahul-reel-3/360/640' },
];

const commercials = [
  { id: 'commercial-1', label: 'Price Per Reel', value: '$ 500' },
  { id: 'commercial-2', label: 'Price Per Story', value: '$ 300' },
  { id: 'commercial-3', label: '30 Days Usage Rights', value: '$ 200' },
];

export default function CreatorProfilePreviewScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'CreatorProfilePreview'>>();
  const { width } = useWindowDimensions();
  const [saved, setSaved] = useState(false);
  const [modalCopy, setModalCopy] = useState('');

  const creator = useMemo(() => {
    const matched = creatorPreviews.find((item) => item.id === route.params?.creatorId);
    const categories = route.params?.categories ?? matched?.categories ?? fallbackCreator.categories;

    return {
      id: route.params?.creatorId ?? matched?.id ?? fallbackCreator.id,
      name: route.params?.creatorName ?? matched?.name ?? fallbackCreator.name,
      handle: route.params?.creatorHandle ?? matched?.handle ?? fallbackCreator.handle,
      gender: matched?.gender ?? fallbackCreator.gender,
      age: matched?.age ?? fallbackCreator.age,
      avatar: route.params?.avatar ? { uri: route.params.avatar } : matched?.avatar ?? fallbackCreator.avatar,
      followers: route.params?.followers ?? matched?.followers ?? fallbackCreator.followers,
      youtubeFollowers: matched?.youtubeFollowers ?? fallbackCreator.youtubeFollowers,
      rating: route.params?.rating ?? matched?.rating ?? fallbackCreator.rating,
      categories,
      bio: matched?.bio ?? fallbackCreator.bio,
    };
  }, [route.params]);

  const reelWidth = Math.min(124, Math.max(96, (width - spacing.screen * 2 - spacing.md * 2) / 3));
  const commercialCardWidth = width >= 620 ? '31.5%' : '48%';

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BrandTabs');
  }, [navigation]);

  const handleViewAllReels = useCallback(() => {
    setModalCopy(`${creator.name}'s full reel library will open here.`);
  }, [creator.name]);

  const handleViewAllCommercials = useCallback(() => {
    setModalCopy(`${creator.name}'s complete rate card is available for outreach.`);
  }, [creator.name]);

  const handleReject = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    Alert.alert('Creator rejected', 'This creator has been skipped.');
  }, [navigation]);

  const handleContact = useCallback(() => {
    setModalCopy(`Contact request sent to ${creator.name}.`);
  }, [creator.name]);

  const handleSave = useCallback(() => {
    setSaved((current) => !current);
  }, []);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={handleBack} style={styles.headerButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ResponsiveContainer maxWidth={680}>
          <View style={styles.identity}>
            <Image source={creator.avatar} resizeMode="cover" style={styles.avatar} />
            <View style={styles.identityCopy}>
              <Text numberOfLines={1} style={styles.name}>{creator.name}</Text>
              <Text numberOfLines={1} style={styles.handle}>{creator.handle}</Text>
              <Text style={styles.meta}>{creator.gender} | {creator.age}</Text>
              <Text numberOfLines={3} style={styles.categories}>{creator.categories.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <Stat icon="instagram" value={creator.followers} label="Instagram" />
              <Stat icon="youtube" value={creator.youtubeFollowers} label="YouTube" />
              <Stat icon="star" value={creator.rating} label="Star Rating" />
            </View>
            <View style={styles.divider} />
            <Text style={styles.bio}>{creator.bio}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Show Reels</Text>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.76} onPress={handleViewAllReels}>
              <Text style={styles.viewAll}>View All &gt;</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={reels}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reelList}
            renderItem={({ item }) => (
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={() => setModalCopy(item.title)} style={[styles.reelCard, { width: reelWidth }]}>
                <Image source={{ uri: item.image }} style={styles.reelImage} />
                <View style={styles.reelOverlay}>
                  <MaterialCommunityIcons name="play-circle" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Commercials</Text>
            <TouchableOpacity accessibilityRole="button" activeOpacity={0.76} onPress={handleViewAllCommercials}>
              <Text style={styles.viewAll}>View All &gt;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.commercialGrid}>
            {commercials.map((item) => (
              <View key={item.id} style={[styles.commercialCard, { width: commercialCardWidth }]}>
                <Text numberOfLines={2} style={styles.commercialLabel}>{item.label}</Text>
                <Text style={styles.commercialValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <RoundAction icon="close" onPress={handleReject} />
            <RoundAction icon="account-plus-outline" onPress={handleContact} />
            <RoundAction icon={saved ? 'bookmark' : 'bookmark-outline'} onPress={handleSave} active={saved} />
          </View>
        </ResponsiveContainer>
      </ScrollView>

      <Modal visible={Boolean(modalCopy)} transparent animationType="fade" onRequestClose={() => setModalCopy('')}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalCopy('')} />
          <View style={styles.modalCard}>
            <MaterialCommunityIcons name="account-star-outline" size={34} color={colors.gold} />
            <Text style={styles.modalTitle}>Creator action</Text>
            <Text style={styles.modalCopy}>{modalCopy}</Text>
            <PrimaryButton title="Done" onPress={() => setModalCopy('')} style={styles.modalButton} />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  value: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <MaterialCommunityIcons name={icon} size={19} color={colors.white} />
      <Text style={styles.statValue}>{value}</Text>
      <Text numberOfLines={2} style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RoundAction({
  icon,
  active = false,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={onPress} style={[styles.roundAction, active && styles.roundActionActive]}>
      <MaterialCommunityIcons name={icon} size={26} color={colors.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  headerButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: { width: 38 },
  scroll: {
    paddingBottom: tabBarHeight + spacing.xxl,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  avatar: {
    width: 126,
    height: 148,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.text,
    fontSize: typography.heading,
    lineHeight: 29,
    fontWeight: fontWeight.heavy,
  },
  handle: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  meta: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
  },
  categories: {
    marginTop: spacing.sm,
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
  },
  statsCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  statValue: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  statLabel: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.tiny,
    lineHeight: 13,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.28)',
    marginVertical: spacing.md,
  },
  bio: {
    color: colors.white,
    fontSize: typography.small,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
  },
  sectionHeader: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  viewAll: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  reelList: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  reelCard: {
    height: 172,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  reelImage: {
    width: '100%',
    height: '100%',
  },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  commercialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  commercialCard: {
    minHeight: 84,
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    backgroundColor: '#EDEDED',
    padding: spacing.md,
  },
  commercialLabel: {
    color: colors.mutedDark,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: fontWeight.bold,
  },
  commercialValue: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  roundAction: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: '#DCDCDC',
  },
  roundActionActive: {
    backgroundColor: colors.gold,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    padding: spacing.screen,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  modalTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  modalCopy: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 19,
    textAlign: 'center',
  },
  modalButton: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
