import React from 'react';
import { StyleSheet, Text, type TextInputProps, View } from 'react-native';
import AppInput from '../../../shared/components/AppInput';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignFormInputProps extends TextInputProps {
  label: string;
  errorText?: string;
}

export default function CampaignFormInput({ label, errorText, multiline, ...props }: CampaignFormInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppInput {...props} multiline={multiline} error={Boolean(errorText)} />
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
  },
});
