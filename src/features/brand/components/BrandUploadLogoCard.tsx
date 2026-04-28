import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { PickedMediaAsset } from '../../../shared/types/media';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface BrandUploadLogoCardProps {
  onPress?: () => void;
  asset?: PickedMediaAsset;
  error?: string;
}

function BrandUploadLogoCard({ onPress, asset, error }: BrandUploadLogoCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} accessibilityRole="button" onPress={onPress} style={styles.card}>
      {asset ? (
        <Image source={{ uri: asset.uri }} style={styles.preview} />
      ) : (
        <View style={styles.iconBox}>
          <Text style={styles.icon}>+</Text>
        </View>
      )}
      <View style={styles.copy}>
        <Text style={styles.title}>{asset ? 'Logo Selected' : 'Upload Your Logo'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(BrandUploadLogoCard);

const styles = StyleSheet.create({
  card: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.md,
  },
  iconBox: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xs,
    backgroundColor: colors.white,
  },
  icon: {
    color: colors.black,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  preview: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  copy: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
    textTransform: 'uppercase',
  },
  error: {
    marginTop: 1,
    color: colors.goldSoft,
    fontSize: typography.tiny,
    fontWeight: fontWeight.bold,
  },
});
