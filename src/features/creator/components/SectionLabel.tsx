import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    marginTop: 12,
    marginBottom: 7,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
});
