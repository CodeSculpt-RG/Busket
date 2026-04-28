import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BrandTrendAnnotation } from '../../../shared/constants/mockBrandData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandTrendOverlayLabelProps {
  annotation: BrandTrendAnnotation;
}

function BrandTrendOverlayLabel({ annotation }: BrandTrendOverlayLabelProps) {
  const isRightAligned = annotation.align === 'right';

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          top: `${annotation.top}%`,
          left: `${annotation.left}%`,
          alignItems: isRightAligned ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View style={styles.line} />
      <View style={styles.label}>
        <Text numberOfLines={1} style={styles.text}>{annotation.label}</Text>
      </View>
    </View>
  );
}

export default React.memo(BrandTrendOverlayLabel);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    maxWidth: '46%',
  },
  line: {
    width: 34,
    height: 1,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.84)',
  },
  label: {
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.90)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
});
