import React from 'react';
import { StyleSheet, TextInput, type TextInputProps, type ViewStyle, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface AppInputProps extends TextInputProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  error?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
}

export default function AppInput({ left, right, error = false, style, containerStyle, multiline, ...props }: AppInputProps) {
  return (
    <View style={[styles.wrapper, multiline && styles.multilineWrapper, error && styles.error, containerStyle]}>
      {left}
      <TextInput
        placeholderTextColor={colors.muted}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
        style={[styles.input, multiline && styles.multilineInput, style]}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    minHeight: 92,
    paddingTop: spacing.sm,
  },
  error: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  multilineInput: {
    minHeight: 72,
    paddingTop: spacing.xs,
  },
});
