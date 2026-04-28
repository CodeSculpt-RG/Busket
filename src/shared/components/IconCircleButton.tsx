import React from 'react';
import { StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fontWeight, typography } from '../theme/typography';

interface IconCircleButtonProps {
  icon: string;
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  dark?: boolean;
}

export default function IconCircleButton({ icon, onPress, label, style, dark = false }: IconCircleButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, dark && styles.dark, style]}
    >
      <Text style={[styles.icon, dark && styles.darkIcon]}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  dark: {
    backgroundColor: colors.black,
  },
  icon: {
    color: colors.black,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.bold,
  },
  darkIcon: {
    color: colors.white,
  },
});
