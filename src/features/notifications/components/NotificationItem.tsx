import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CreatorNotification } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface NotificationItemProps {
  notification: CreatorNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.marker} />
      <View style={styles.copy}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.body}>{notification.body}</Text>
      </View>
      <Text style={styles.time}>{notification.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  copy: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  body: {
    marginTop: 2,
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 13,
  },
  time: {
    width: 74,
    color: colors.mutedDark,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'right',
  },
});
