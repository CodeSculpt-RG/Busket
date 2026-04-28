import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type SocialProvider = 'google' | 'apple';

interface SocialAuthButtonProps {
  provider: SocialProvider;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'outline' | 'solid';
}

export default function SocialAuthButton({
  provider,
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'outline',
}: SocialAuthButtonProps) {
  const isApple = provider === 'apple';
  
  const buttonStyle = [
    styles.button,
    variant === 'solid' ? (isApple ? styles.appleSolid : styles.googleSolid) : styles.outline,
    disabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    variant === 'solid' ? styles.textLight : styles.textDark,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? colors.white : colors.text} />
      ) : (
        <View style={styles.content}>
          <MaterialCommunityIcons
            name={provider === 'google' ? 'google' : 'apple'}
            size={22}
            color={disabled ? colors.muted : variant === 'solid' ? colors.white : colors.text}
            style={styles.icon}
          />
          <Text style={[textStyle, disabled && styles.disabledText]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
    width: '100%',
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Light slate border for premium look
  },
  disabled: {
    opacity: 0.48,
  },
  disabledText: {
    color: colors.muted,
  },
  googleSolid: {
    backgroundColor: '#4285F4',
  },
  appleSolid: {
    backgroundColor: colors.black,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  textDark: {
    color: colors.text,
  },
  textLight: {
    color: colors.white,
  },
});
