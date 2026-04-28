import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface BrandShortcutCardProps {
  title: string;
  icon: IconName;
  accentColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

function BrandShortcutCard({ title, icon, accentColor = colors.gold, onPress, style }: BrandShortcutCardProps) {
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.84} onPress={onPress} style={[styles.card, style]}>
      <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
        <MaterialCommunityIcons name={icon} size={30} color={colors.black} />
      </View>
      <Text numberOfLines={2} style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(BrandShortcutCard);

const styles = StyleSheet.create({
  card: {
    width: 116,
    minHeight: 124,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  iconCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 17,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
});
