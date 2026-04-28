import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CreatorHeaderProps {
  name: string;
  profileImage?: ImageSourcePropType;
  onSearchPress: () => void;
  onNotificationPress: () => void;
  onProfilePress?: () => void;
}

export default function CreatorHeader({ name, profileImage, onSearchPress, onNotificationPress, onProfilePress }: CreatorHeaderProps) {
  return (
    <View style={styles.header}>
      {profileImage ? (
        <TouchableOpacity activeOpacity={0.78} accessibilityRole="button" onPress={onProfilePress} style={styles.avatarButton}>
          <Image source={profileImage} style={styles.avatar} />
        </TouchableOpacity>
      ) : null}
      <View style={styles.copy}>
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.actions}>
        <HeaderIconButton icon="magnify" label="Search" onPress={onSearchPress} />
        <HeaderIconButton icon="bell-outline" label="Notifications" onPress={onNotificationPress} />
      </View>
    </View>
  );
}

interface HeaderIconButtonProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}

function HeaderIconButton({ icon, label, onPress }: HeaderIconButtonProps) {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.82} onPress={onPress} style={styles.iconButton}>
      <MaterialCommunityIcons name={icon} size={21} color={colors.black} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  avatarButton: {
    marginRight: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  copy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  greeting: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  name: {
    marginTop: 2,
    color: colors.mutedDark,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.surfaceMuted,
    backgroundColor: colors.white,
  },
});
