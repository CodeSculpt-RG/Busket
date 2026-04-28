import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { PickMediaResult, PickedMediaAsset, PickedMediaKind } from '../types/media';

const mapAsset = (asset: ImagePicker.ImagePickerAsset, kind: PickedMediaKind): PickedMediaAsset => ({
  uri: asset.uri,
  kind,
  fileName: asset.fileName ?? undefined,
  mimeType: asset.mimeType ?? undefined,
  width: asset.width,
  height: asset.height,
  duration: asset.duration ?? undefined,
});

const ensurePermission = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
};

export const pickImage = async (): Promise<PickMediaResult> => {
  try {
    const granted = await ensurePermission();

    if (!granted) {
      Alert.alert('Permission needed', 'Please allow photo access to choose an image.');
      return { error: 'Media permission denied' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.82,
    });

    if (result.canceled) {
      return { cancelled: true };
    }

    return { asset: mapAsset(result.assets[0], 'image') };
  } catch {
    return { error: 'Could not open image picker' };
  }
};

export const pickVideo = async (): Promise<PickMediaResult> => {
  try {
    const granted = await ensurePermission();

    if (!granted) {
      Alert.alert('Permission needed', 'Please allow media access to choose a video.');
      return { error: 'Media permission denied' };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ['videos'],
      quality: 0.75,
      videoMaxDuration: 90,
    });

    if (result.canceled) {
      return { cancelled: true };
    }

    return { asset: mapAsset(result.assets[0], 'video') };
  } catch {
    return { error: 'Could not open video picker' };
  }
};
