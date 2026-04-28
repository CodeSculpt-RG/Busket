import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import type { TrendAnnotation } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface TrendOverlayLabelProps {
  annotation: TrendAnnotation;
}

function TrendOverlayLabel({ annotation }: TrendOverlayLabelProps) {
  const anchorStyle: ViewStyle = {
    top: `${annotation.top}%`,
    left: `${annotation.left}%`,
  };
  const alignRight = annotation.align === 'right';

  return (
    <View pointerEvents="none" style={[styles.anchor, anchorStyle]}>
      <View style={[styles.connector, alignRight && styles.connectorRight]} />
      <View style={[styles.dot, alignRight && styles.dotRight]} />
      <View style={[styles.pill, alignRight && styles.pillRight]}>
        <Text numberOfLines={1} style={styles.label}>
          {annotation.label}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(TrendOverlayLabel);

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    width: 142,
  },
  connector: {
    width: 28,
    height: 1,
    marginLeft: 7,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  connectorRight: {
    alignSelf: 'flex-end',
    marginLeft: 0,
    marginRight: 7,
  },
  dot: {
    position: 'absolute',
    top: -3,
    left: 0,
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  dotRight: {
    left: undefined,
    right: 0,
  },
  pill: {
    alignSelf: 'flex-start',
    maxWidth: 132,
    marginTop: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(16,16,16,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillRight: {
    alignSelf: 'flex-end',
  },
  label: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
});
