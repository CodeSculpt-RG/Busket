import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { fontWeight, typography } from '../theme/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'dark' | 'gold';
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  tone = 'dark',
  style,
}: PrimaryButtonProps) {
  const isGold = tone === 'gold';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isGold ? styles.goldButton : styles.darkButton,
        pressed && !(disabled || loading) && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGold ? colors.black : colors.white} />
      ) : (
        <Text style={[styles.text, isGold && styles.goldText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: 18,
  },
  darkButton: {
    backgroundColor: colors.black,
  },
  goldButton: {
    backgroundColor: colors.gold,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.86,
  },
  text: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  goldText: {
    color: colors.black,
  },
});
