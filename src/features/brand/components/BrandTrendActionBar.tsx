import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';

interface BrandTrendActionBarProps {
  interested: boolean;
  saved: boolean;
  onInterestedPress: () => void;
  onSavePress: () => void;
  onSharePress: () => void;
}

function BrandTrendActionBar({
  interested,
  saved,
  onInterestedPress,
  onSavePress,
  onSharePress,
}: BrandTrendActionBarProps) {
  return (
    <View style={styles.group}>
      <ActionButton
        active={interested}
        icon={interested ? 'plus-circle' : 'plus'}
        label={interested ? 'Added to inspiration' : 'Add to inspiration'}
        onPress={onInterestedPress}
      />
      <ActionButton
        active={saved}
        icon={saved ? 'bookmark' : 'bookmark-outline'}
        label={saved ? 'Unsave idea' : 'Save idea'}
        onPress={onSavePress}
      />
      <ActionButton icon="share-variant-outline" label="Share idea" onPress={onSharePress} />
    </View>
  );
}

export default React.memo(BrandTrendActionBar);

function ActionButton({
  active = false,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      activeOpacity={0.82}
      onPress={onPress}
      style={[styles.button, active && styles.activeButton]}
    >
      <MaterialCommunityIcons name={icon} size={24} color={active ? colors.black : colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.64)',
  },
  activeButton: {
    backgroundColor: colors.gold,
  },
});
