import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import type { PickedMediaAsset } from '../../../shared/types/media';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface UploadAvatarCardProps {
  image?: ImageSourcePropType;
  asset?: PickedMediaAsset;
  error?: string;
  onPress: () => void;
}

function UploadAvatarCard({ image, asset, error, onPress }: UploadAvatarCardProps) {
  const source = asset ? { uri: asset.uri } : image;

  return (
    <TouchableOpacity activeOpacity={0.84} accessibilityRole="button" onPress={onPress} style={styles.card}>
      {source ? <Image source={source} style={styles.avatar} /> : <View style={styles.avatar} />}
      <Text style={styles.upload}>{asset ? 'CHANGE PHOTO' : '+ UPLOAD'}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </TouchableOpacity>
  );
}

export default React.memo(UploadAvatarCard);

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 240,
    minHeight: 156,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: '#455D42',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.surfaceMuted,
  },
  upload: {
    marginTop: spacing.sm,
    color: colors.white,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.goldSoft,
    fontSize: typography.tiny,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
