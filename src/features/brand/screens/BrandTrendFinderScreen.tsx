import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import {
  Animated,
  PanResponder,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import BrandTrendCard from '../components/BrandTrendCard';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppInput from '../../../shared/components/AppInput';
import AppScreen from '../../../shared/components/AppScreen';
import { brandTrendDeck, type BrandTrendCardItem } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { tabBarHeight } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const SWIPE_THRESHOLD = 92;
const STACK_PREVIEW_OFFSET = 14;

function filterDeck(items: BrandTrendCardItem[], query: string) {
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

export default function BrandTrendFinderScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const pan = useRef(new Animated.ValueXY()).current;
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [interestedIds, setInterestedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedback, setFeedback] = useState('');

  const filteredDeck = useMemo(() => filterDeck(brandTrendDeck, query), [query]);
  const remainingDeck = useMemo(
    () => filteredDeck.filter((item) => !dismissedIds.includes(item.id)),
    [dismissedIds, filteredDeck],
  );
  const activeCard = remainingDeck[0];
  const nextCard = remainingDeck[1];
  const cardWidth = Math.min(width - spacing.screen * 2, 620);
  const availableHeight = height - tabBarHeight - 166;
  const cardHeight = Math.max(420, Math.min(availableHeight, 690));
  const playbackEnabled = Boolean(isFocused && activeCard && !isTransitioning);

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const interestedOpacity = pan.x.interpolate({
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
      setIsTransitioning(false);
      pan.setValue({ x: 0, y: 0 });
    }, 160);

    return () => clearTimeout(timeoutId);
  }, [pan, searchText]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setFeedback(''), 1300);
    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const markInterested = useCallback((item: BrandTrendCardItem) => {
    setInterestedIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
    setFeedback('Added to inspiration');
  }, []);

  const goToNextCard = useCallback(
    (direction: 'left' | 'right', item?: BrandTrendCardItem) => {
      if (!item || isTransitioning) {
        return;
      }

      if (direction === 'right') {
        markInterested(item);
      } else {
        setFeedback('Skipped');
      }

      const toValue = direction === 'right' ? width * 1.2 : -width * 1.2;
      setIsTransitioning(true);

      Animated.timing(pan, {
        toValue: { x: toValue, y: 18 },
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        setDismissedIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
        requestAnimationFrame(() => setIsTransitioning(false));
      });
    },
    [isTransitioning, markInterested, pan, width],
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

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BrandTabs');
  }, [navigation]);

  const toggleInterested = useCallback((item: BrandTrendCardItem) => {
    setInterestedIds((current) => {
      const exists = current.includes(item.id);
      setFeedback(exists ? 'Removed from inspiration' : 'Added to inspiration');
      return exists ? current.filter((id) => id !== item.id) : [...current, item.id];
    });
  }, []);

  const toggleSaved = useCallback((item: BrandTrendCardItem) => {
    setSavedIds((current) => {
      const exists = current.includes(item.id);
      setFeedback(exists ? 'Removed bookmark' : 'Saved idea');
      return exists ? current.filter((id) => id !== item.id) : [...current, item.id];
    });
  }, []);

  const handleShare = useCallback(async (item: BrandTrendCardItem) => {
    try {
      if (Platform.OS === 'web') {
        const webNavigator = (globalThis as { navigator?: { share?: (data: { title: string; text: string }) => Promise<void> } }).navigator;

        if (webNavigator?.share) {
          await webNavigator.share({ title: item.title, text: item.shareMessage });
          setFeedback('Shared');
          return;
        }

        setFeedback('Share this idea from your browser menu');
        return;
      }

      await Share.share({
        title: item.title,
        message: item.shareMessage,
      });
      setFeedback('Shared');
    } catch {
      setFeedback('Share unavailable');
    }
  }, []);

  const handleReset = useCallback(() => {
    setDismissedIds([]);
    pan.setValue({ x: 0, y: 0 });
    setFeedback('Feed reset');
  }, [pan]);

  const handleClearSearch = useCallback(() => {
    setSearchText('');
    setQuery('');
    setDismissedIds([]);
    pan.setValue({ x: 0, y: 0 });
  }, [pan]);

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
          onChangeText={setSearchText}
          placeholder="Search category, ideas, topics, anything..."
          left={<MaterialCommunityIcons name="magnify" size={19} color={colors.muted} style={styles.searchIcon} />}
          containerStyle={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <View style={styles.deck}>
        {activeCard ? (
          <View style={[styles.cardStage, { width: cardWidth, height: cardHeight }]}>
            {nextCard ? (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.cardLayer,
                  {
                    transform: [{ translateY: nextCardTranslateY }, { scale: nextCardScale }],
                  },
                ]}
              >
                <BrandTrendCard
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
              <BrandTrendCard
                key={activeCard.id}
                item={activeCard}
                active
                playbackEnabled={playbackEnabled}
                width={cardWidth}
                height={cardHeight}
                interested={interestedIds.includes(activeCard.id)}
                saved={savedIds.includes(activeCard.id)}
                gestureHandlers={panResponder.panHandlers}
                onInterestedPress={() => toggleInterested(activeCard)}
                onSavePress={() => toggleSaved(activeCard)}
                onSharePress={() => handleShare(activeCard)}
              />
              <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.interestedHint, { opacity: interestedOpacity }]}>
                <Text style={styles.swipeHintText}>INTERESTED</Text>
              </Animated.View>
              <Animated.View pointerEvents="none" style={[styles.swipeHint, styles.skipHint, { opacity: skipOpacity }]}>
                <Text style={[styles.swipeHintText, styles.skipHintText]}>SKIP</Text>
              </Animated.View>
            </Animated.View>
          </View>
        ) : (
          <View style={[styles.emptyState, { width: cardWidth }]}>
            <MaterialCommunityIcons name="compass-off-outline" size={36} color={colors.muted} />
            <Text style={styles.emptyTitle}>{filteredDeck.length ? 'All caught up' : 'No trends found'}</Text>
            <Text style={styles.emptyCopy}>
              {filteredDeck.length ? 'Reset the feed to review these ideas again.' : 'Try a different topic, category, or idea.'}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.82}
              onPress={filteredDeck.length ? handleReset : handleClearSearch}
              style={styles.resetButton}
            >
              <Text style={styles.resetText}>{filteredDeck.length ? 'Reset Feed' : 'Clear Search'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {feedback ? (
          <View pointerEvents="none" style={styles.feedback}>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        ) : null}
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
    paddingBottom: tabBarHeight + spacing.md,
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
  interestedHint: {
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
  resetButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  resetText: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
  },
  feedback: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: tabBarHeight + spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.68)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  feedbackText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
});
