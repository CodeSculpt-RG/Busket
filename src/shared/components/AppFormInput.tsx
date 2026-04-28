import React from 'react';
import { StyleSheet, Text, View, type TextInputProps, type ViewStyle } from 'react-native';
import AppInput from './AppInput';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontWeight, typography } from '../theme/typography';

interface AppFormInputProps extends TextInputProps {
  label: string;
  errorText?: string;
  containerStyle?: ViewStyle | ViewStyle[];
}

export default function AppFormInput({ label, errorText, containerStyle, ...props }: AppFormInputProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <AppInput {...props} error={Boolean(errorText)} />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 7,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.bold,
  },
});
