import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { PickedMediaAsset } from '../../../shared/types/media';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight } from '../../../shared/theme/typography';

interface VideoUploadCardProps {
  selected: boolean;
  asset?: PickedMediaAsset;
  fileName?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  onRemove?: () => void;
}

function VideoUploadCard({ selected, asset, fileName, style, onPress, onRemove }: VideoUploadCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.selected, pressed && styles.pressed, style]}
    >
      {asset ? (
        <View style={styles.uploadedState}>
          {onRemove ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Remove video" onPress={onRemove} hitSlop={8} style={styles.removeButton}>
              <Text style={styles.removeText}>x</Text>
            </Pressable>
          ) : null}
          <View style={styles.playCircle}>
            <View style={styles.playIcon} />
          </View>
          <Text style={styles.uploadedTitle}>Video selected</Text>
          <Text numberOfLines={2} style={styles.fileName}>
            {fileName}
          </Text>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.phone}>
            <View style={styles.camera} />
            <Text style={styles.plus}>+</Text>
            <View style={styles.slot} />
            <Text style={styles.controls}>Upload</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default React.memo(VideoUploadCard);

const styles = StyleSheet.create({
  card: {
    aspectRatio: 0.78,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.sm,
  },
  selected: {
    borderColor: colors.gold,
  },
  pressed: {
    opacity: 0.82,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: '72%',
    height: '82%',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: colors.black,
    borderRadius: radius.sm,
    paddingTop: 11,
  },
  camera: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: colors.black,
  },
  plus: {
    color: colors.black,
    fontSize: 50,
    fontWeight: fontWeight.heavy,
    lineHeight: 70,
  },
  slot: {
    width: '72%',
    height: 16,
    borderWidth: 4,
    borderColor: colors.black,
    borderRadius: 3,
  },
  controls: {
    marginTop: 11,
    color: colors.black,
    fontSize: 13,
    fontWeight: fontWeight.heavy,
  },
  uploadedState: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: colors.black,
    zIndex: 2,
  },
  removeText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: fontWeight.heavy,
    lineHeight: 18,
  },
  playCircle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.black,
    paddingLeft: 3,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  uploadedTitle: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 13,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  fileName: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 11,
    fontWeight: fontWeight.bold,
    lineHeight: 14,
    textAlign: 'center',
  },
});
