import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface ShortcutActionCardProps {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: (id: string) => void;
}

function ShortcutActionCard({ id, title, icon, onPress }: ShortcutActionCardProps) {
  const handlePress = React.useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.82} onPress={handlePress} style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={icon} size={31} color={colors.black} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(ShortcutActionCard);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 94,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.4,
    borderColor: colors.black,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    lineHeight: 14,
    textAlign: 'center',
  },
});
