import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fontWeight, typography } from '../theme/typography';

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'caption' | 'body' | 'title' | 'heading';
  weight?: keyof typeof fontWeight;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export default function AppText({
  children,
  variant = 'body',
  weight = 'regular',
  color = colors.text,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text {...props} style={[styles.base, styles[variant], { color, fontWeight: fontWeight[weight] }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
  caption: {
    fontSize: typography.caption,
    lineHeight: 13,
  },
  body: {
    fontSize: typography.body,
    lineHeight: 19,
  },
  title: {
    fontSize: typography.title,
    lineHeight: 25,
  },
  heading: {
    fontSize: typography.heading,
    lineHeight: 30,
  },
});
