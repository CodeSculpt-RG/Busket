import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { fontWeight, typography } from '../theme/typography';

interface BottomTabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

export default function BottomTabIcon({ icon, label, focused }: BottomTabIconProps) {
  const isVectorIcon = icon.includes('-') || icon.length > 2;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBadge, focused && styles.activeBadge]}>
        {isVectorIcon ? (
          <MaterialCommunityIcons
            name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
            size={22}
            color={focused ? colors.black : colors.surfaceMuted}
          />
        ) : (
          <Text style={[styles.icon, focused && styles.activeIcon]}>{icon}</Text>
        )}
      </View>
      <Text style={[styles.label, focused && styles.active]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    gap: 3,
  },
  iconBadge: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeBadge: {
    backgroundColor: colors.gold,
  },
  icon: {
    color: colors.surfaceMuted,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: fontWeight.bold,
  },
  label: {
    color: colors.surfaceMuted,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
  },
  active: {
    color: colors.gold,
  },
  activeIcon: {
    color: colors.black,
  },
});
