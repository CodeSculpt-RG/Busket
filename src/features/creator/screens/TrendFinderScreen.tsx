import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import {
  Animated,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import TrendFinderCard from '../components/TrendFinderCard';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import AppInput from '../../../shared/components/AppInput';
import AppScreen from '../../../shared/components/AppScreen';
import { trendFinderDeck, type TrendCardItem } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type TrendNavigation = NavigationProp<CreatorStackParamList>;

const SWIPE_THRESHOLD = 92;
const STACK_PREVIEW_OFFSET = 14;

function filterDeck(items: TrendCardItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return items;
  }

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.annotations.some((annotation) => annotation.label.toLowerCase().includes(normalizedQuery)),
  );
}

export default function TrendFinderScreen() {
  const navigation = useNavigation<TrendNavigation>();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY()).current;
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const filteredDeck = useMemo(() => filterDeck(trendFinderDeck, query), [query]);
  const activeCard = filteredDeck[activeIndex % Math.max(filteredDeck.length, 1)];
  const nextCard = filteredDeck[(activeIndex + 1) % Math.max(filteredDeck.length, 1)];
  const cardWidth = Math.min(width - spacing.screen * 2, 620);
  const availableHeight = height - tabBarHeight - 166;
  const cardHeight = Math.max(420, Math.min(availableHeight, 690));
  const playbackEnabled = Boolean(isFocused && activeCard && !isTransitioning);

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const keepOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardScale = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.96, 1],
    extrapolate: 'clamp',
  });

  const nextCardTranslateY = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0, STACK_PREVIEW_OFFSET, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(searchText);
      setActiveIndex(0);
      setIsTransitioning(false);
      pan.setValue({ x: 0, y: 0 });
    }, 160);

    return () => clearTimeout(timeoutId);
  }, [pan, searchText]);

  const goToNextCard = useCallback(
    (direction: 'left' | 'right', item?: TrendCardItem) => {
      if (direction === 'right' && item) {
        setInterestedIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
      }

      const toValue = direction === 'right' ? width * 1.2 : -width * 1.2;
      setIsTransitioning(true);

      Animated.timing(pan, {
        toValue: { x: toValue, y: 18 },
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        setActiveIndex((current) => (filteredDeck.length ? (current + 1) % filteredDeck.length : 0));
        requestAnimationFrame(() => setIsTransitioning(false));
      });
    },
    [filteredDeck.length, pan, width],
  );

  const resetCardPosition = useCallback(() => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 6,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [pan]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 18 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_, gesture) => {
          pan.setValue({ x: gesture.dx, y: gesture.dy * 0.12 });
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            goToNextCard('right', activeCard);
            return;
          }

          if (gesture.dx < -SWIPE_THRESHOLD) {
            goToNextCard('left', activeCard);
            return;
          }

          resetCardPosition();
        },
      }),
    [activeCard, goToNextCard, pan, resetCardPosition],
  );

  const handleQueryChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const toggleInterested = useCallback((id: string) => {
    setInterestedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  const handleShare = useCallback(async (item: TrendCardItem) => {
    try {
      await Share.share({
        title: item.title,
        message: item.shareMessage,
      });
    } catch {
      // Native share can be unavailable in simulators; the button still remains safe.
    }
  }, []);

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('CreatorHome');
  }, [navigation]);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.8}
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Find Trending Content</Text>
          <View style={styles.headerSpacer} />
        </View>

        <AppInput
          value={searchText}
          onChangeText={handleQueryChange}
          placeholder="Search category, ideas, topics, anything..."
          left={<MaterialCommunityIcons name="magnify" size={19} color={colors.muted} style={styles.searchIcon} />}
          containerStyle={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View style={styles.deck}>
        {activeCard ? (
          <View style={[styles.cardStage, { width: cardWidth, height: cardHeight }]}>
            {nextCard && filteredDeck.length > 1 ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.cardLayer,
                  {
                    transform: [{ translateY: nextCardTranslateY }, { scale: nextCardScale }],
                  },
                ]}
              >
                <TrendFinderCard
                  item={nextCard}
                  active={false}
                  playbackEnabled={false}
                  width={cardWidth}
                  height={cardHeight}
                  interested={interestedIds.includes(nextCard.id)}
                  saved={savedIds.includes(nextCard.id)}
                  onInterestedPress={() => undefined}
                  onSavePress={() => undefined}
                  onSharePress={() => undefined}
                />
              </Animated.View>
            ) : null}

            <Animated.View
              style={[
                styles.cardLayer,
                {
                  transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
                },
              ]}
            >
              <TrendFinderCard
                key={activeCard.id}
                item={activeCard}
                active
                playbackEnabled={playbackEnabled}
                width={cardWidth}
                height={cardHeight}
                interested={interestedIds.includes(activeCard.id)}
                saved={savedIds.includes(activeCard.id)}
                gestureHandlers={panResponder.panHandlers}
                onInterestedPress={() => toggleInterested(activeCard.id)}
                onSavePress={() => toggleSaved(activeCard.id)}
                onSharePress={() => handleShare(activeCard)}
              />
              <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.keepHint, { opacity: keepOpacity }]}>
                <Text style={styles.swipeHintText}>KEEP</Text>
              </Animated.View>
              <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.skipHint, { opacity: skipOpacity }]}>
                <Text style={[styles.swipeHintText, styles.skipHintText]}>SKIP</Text>
              </Animated.View>
            </Animated.View>
          </View>
        ) : (
          <View style={[styles.emptyState, { width: cardWidth }]}>
            <MaterialCommunityIcons name="compass-off-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No trends found</Text>
            <Text style={styles.emptyCopy}>Try a different topic or category.</Text>
          </View>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  titleRow: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  disabledBackButton: {
    opacity: 0,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  searchInput: {
    borderRadius: radius.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  cardStage: {
    position: 'relative',
  },
  cardLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  swipeHint: {
    position: 'absolute',
    top: spacing.xl,
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  keepHint: {
    right: spacing.xl,
    borderColor: colors.gold,
    transform: [{ rotate: '10deg' }],
  },
  skipHint: {
    left: spacing.xl,
    borderColor: colors.white,
    transform: [{ rotate: '-10deg' }],
  },
  swipeHintText: {
    color: colors.gold,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  skipHintText: {
    color: colors.white,
  },
  emptyState: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  emptyCopy: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
