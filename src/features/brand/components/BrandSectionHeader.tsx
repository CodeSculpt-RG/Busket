import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

function BrandSectionHeader({ title, actionLabel, onActionPress }: BrandSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity accessibilityRole="button" activeOpacity={0.75} onPress={onActionPress} style={styles.actionButton}>
          <Text style={styles.action}>{actionLabel}</Text>
          <MaterialCommunityIcons name="chevron-right" size={16} color={colors.goldDark} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default React.memo(BrandSectionHeader);

const styles = StyleSheet.create({
  row: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  actionButton: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
  },
  action: {
    color: colors.goldDark,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
});
