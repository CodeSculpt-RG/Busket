import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';

interface BrandFloatingActionGroupProps {
  onAddPress?: () => void;
  onBookmarkPress?: () => void;
  onSharePress?: () => void;
}

export default function BrandFloatingActionGroup({ onAddPress, onBookmarkPress, onSharePress }: BrandFloatingActionGroupProps) {
  return (
    <View style={styles.group}>
      <ActionButton icon="plus" label="Add idea" onPress={onAddPress} />
      <ActionButton icon="bookmark-outline" label="Save idea" onPress={onBookmarkPress} />
      <ActionButton icon="share-variant-outline" label="Share idea" onPress={onSharePress} />
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.82} onPress={onPress} style={styles.button}>
      <MaterialCommunityIcons name={icon} size={23} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
});
