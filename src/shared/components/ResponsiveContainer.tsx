import React from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { getResponsivePadding, maxContentWidth } from '../theme/responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  maxWidth?: number;
  padded?: boolean;
}

export default function ResponsiveContainer({ children, style, maxWidth = maxContentWidth, padded = true }: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.outer, padded && { paddingHorizontal: getResponsivePadding(width) }]}>
      <View style={[styles.inner, { maxWidth }, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
});
