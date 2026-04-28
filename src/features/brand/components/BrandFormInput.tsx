import React from 'react';
import { StyleSheet, Text, type TextInputProps, View } from 'react-native';
import AppInput from '../../../shared/components/AppInput';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandFormInputProps extends TextInputProps {
  label: string;
  error?: boolean;
  errorText?: string;
}

export default function BrandFormInput({ label, style, error = false, errorText, ...props }: BrandFormInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppInput {...props} error={error || Boolean(errorText)} style={style} />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
    lineHeight: 14,
  },
});
