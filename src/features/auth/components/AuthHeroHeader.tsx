import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { verticalScale } from '../../../shared/theme/responsive';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface AuthHeroHeaderProps {
  eyebrow: string;
  title: string;
  tone?: 'creator' | 'growth';
  onBackPress?: () => void;
}

export default function AuthHeroHeader({ eyebrow, title, tone = 'creator', onBackPress }: AuthHeroHeaderProps) {
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(238, Math.min(verticalScale(315), height * 0.38));

  return (
    <View style={[styles.hero, { height: heroHeight }, tone === 'growth' && styles.growthHero]}>
      <View style={styles.curveTop} />
      <View style={styles.curveBottomLeft} />
      <View style={styles.curveBottomRight} />

      {onBackPress ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.8}
          onPress={onBackPress}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
      ) : null}

      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    backgroundColor: colors.teal,
  },
  growthHero: {
    backgroundColor: '#FFC448',
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    zIndex: 10,
  },
  curveTop: {
    position: 'absolute',
    top: -105,
    right: -80,
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  curveBottomLeft: {
    position: 'absolute',
    left: -52,
    bottom: -40,
    width: 220,
    height: 160,
    borderRadius: 110,
    backgroundColor: colors.background,
  },
  curveBottomRight: {
    position: 'absolute',
    right: -54,
    bottom: -34,
    width: 210,
    height: 140,
    borderRadius: 105,
    backgroundColor: colors.background,
  },
  copy: {
    position: 'absolute',
    left: 38,
    right: 24,
    bottom: 98,
  },
  eyebrow: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.semibold,
  },
  title: {
    marginTop: 2,
    color: colors.white,
    fontSize: typography.heading,
    fontWeight: fontWeight.heavy,
    letterSpacing: 0,
  },
});
