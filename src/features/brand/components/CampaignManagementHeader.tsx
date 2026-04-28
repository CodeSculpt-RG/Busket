import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignManagementHeaderProps {
  title: string;
  onBackPress: () => void;
  right?: React.ReactNode;
}

export default function CampaignManagementHeader({ title, onBackPress, right }: CampaignManagementHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={onBackPress} style={styles.iconButton}>
        <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
      </TouchableOpacity>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  right: {
    width: 38,
    alignItems: 'flex-end',
  },
});
