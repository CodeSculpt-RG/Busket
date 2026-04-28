import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import AppSelect from './AppSelect';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontWeight, typography } from '../theme/typography';

interface AppMultiSelectProps {
  label: string;
  values: string[];
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  errorText?: string;
  style?: ViewStyle | ViewStyle[];
}

export default function AppMultiSelect({
  label,
  values,
  placeholder,
  onPress,
  disabled = false,
  errorText,
  style,
}: AppMultiSelectProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <AppSelect
        value={values.join(', ')}
        placeholder={placeholder}
        disabled={disabled}
        error={Boolean(errorText)}
        onPress={onPress}
      />
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
