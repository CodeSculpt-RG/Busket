import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface TrendLabelProps {
  label: string;
  style: ViewStyle;
}

export default function TrendLabel({ label, style }: TrendLabelProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.medium,
  },
  line: {
    width: 1,
    height: 86,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginTop: 4,
  },
});
