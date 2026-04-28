import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { fontWeight, typography } from '../theme/typography';

interface AppSelectProps {
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  error?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export default function AppSelect({ value, placeholder, onPress, disabled = false, error = false, style }: AppSelectProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.select, disabled && styles.disabled, error && styles.error, style]}
    >
      <Text numberOfLines={2} style={[styles.value, !value && styles.placeholder, disabled && styles.disabledText]}>
        {value || placeholder}
      </Text>
      <View style={styles.chevronBox}>
        <Text style={[styles.chevron, disabled && styles.disabledText]}>v</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  select: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  disabled: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.68,
  },
  error: {
    borderColor: colors.error,
  },
  value: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
  placeholder: {
    color: colors.muted,
  },
  disabledText: {
    color: colors.muted,
  },
  chevronBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
});
