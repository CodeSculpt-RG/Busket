import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandHeaderProps {
  name: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function BrandHeader({ name, onNotificationPress, onProfilePress }: BrandHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.kicker}>Welcome Back</Text>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity accessibilityRole="button" onPress={onNotificationPress} style={styles.iconButton}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={onProfilePress} style={styles.avatar}>
          <Text style={styles.avatarText}>B</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.white,
  },
  kicker: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  title: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
  avatarText: {
    color: colors.gold,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
});
