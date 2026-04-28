import React from 'react';
import { StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { fontWeight, typography } from '../theme/typography';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function SecondaryButton({ title, onPress, style }: SecondaryButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.md,
    paddingHorizontal: 18,
  },
  text: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
});
