import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CampaignMediaAsset } from '../../../app/store/brandCampaign.store';
import { pickImage } from '../../../shared/services/mediaPicker';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignImageUploaderProps {
  label: string;
  assets: CampaignMediaAsset[];
  multiple?: boolean;
  onChange: (assets: CampaignMediaAsset[]) => void;
}

export default function CampaignImageUploader({ label, assets, multiple = false, onChange }: CampaignImageUploaderProps) {
  const [error, setError] = React.useState('');

  const handlePick = async () => {
    const result = await pickImage();

    if (result.asset) {
      setError('');
      const nextAsset = { uri: result.asset.uri, fileName: result.asset.fileName };
      onChange(multiple ? [...assets, nextAsset] : [nextAsset]);
      return;
    }

    if (result.error) {
      setError(result.error);
    }
  };

  const removeAsset = (uri: string) => {
    onChange(assets.filter((asset) => asset.uri !== uri));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.82} onPress={handlePick} style={styles.uploadBox}>
        <MaterialCommunityIcons name="image-plus" size={24} color={colors.black} />
        <Text style={styles.uploadText}>{assets.length ? 'Add / Replace Image' : 'Upload Image'}</Text>
      </TouchableOpacity>
      {assets.length ? (
        <View style={styles.previewRow}>
          {assets.map((asset) => (
            <View key={asset.uri} style={styles.previewWrap}>
              <Image source={{ uri: asset.uri }} style={styles.preview} />
              <TouchableOpacity accessibilityRole="button" activeOpacity={0.78} onPress={() => removeAsset(asset.uri)} style={styles.removeButton}>
                <MaterialCommunityIcons name="close" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginTop: spacing.md },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  uploadBox: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  uploadText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  previewWrap: {
    position: 'relative',
  },
  preview: {
    width: 78,
    height: 78,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.black,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.medium,
  },
});
