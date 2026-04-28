import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';

interface TrendActionBarProps {
  interested: boolean;
  saved: boolean;
  onInterestedPress: () => void;
  onSavePress: () => void;
  onSharePress: () => void;
}

export default function TrendActionBar({
  interested,
  saved,
  onInterestedPress,
  onSavePress,
  onSharePress,
}: TrendActionBarProps) {
  return (
    <View style={styles.row}>
      <ActionButton
        icon={interested ? 'check' : 'plus'}
        active={interested}
        label={interested ? 'Added to shortlist' : 'Add to shortlist'}
        onPress={onInterestedPress}
      />
      <ActionButton
        icon={saved ? 'bookmark' : 'bookmark-outline'}
        active={saved}
        prominent
        label={saved ? 'Saved idea' : 'Save idea'}
        onPress={onSavePress}
      />
      <ActionButton icon="share-variant-outline" label="Share trend idea" onPress={onSharePress} />
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  active?: boolean;
  prominent?: boolean;
  onPress: () => void;
}

function ActionButton({ icon, label, active = false, prominent = false, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.84}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, prominent && styles.prominentButton, active && styles.activeButton]}
    >
      <MaterialCommunityIcons name={icon} size={prominent ? 30 : 25} color={active ? colors.black : colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  button: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.48)',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  prominentButton: {
    width: 66,
    height: 66,
  },
  activeButton: {
    borderColor: colors.gold,
    backgroundColor: colors.gold,
  },
});
