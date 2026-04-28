import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import VideoUploadCard from '../components/VideoUploadCard';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import {
  saveCreatorVideoAsset,
  removeCreatorVideo,
  setCreatorVideos,
  completeCreatorVideoStep,
  useCreatorState,
  type CreatorVideoMetadata,
} from '../../../app/store/creator.store';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import SecondaryButton from '../../../shared/components/SecondaryButton';
import { pickVideo } from '../../../shared/services/mediaPicker';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import type { PickedMediaAsset } from '../../../shared/types/media';

type VideoSlot = {
  id: number;
  uri?: string;
  name?: string;
  type?: string;
  asset?: PickedMediaAsset;
};

type VideoUploadNavigation = NavigationProp<CreatorStackParamList>;

const TOTAL_UPLOAD_SLOTS = 6;
const GRID_GAP = spacing.md;

const createVideoSlots = (savedVideos: CreatorVideoMetadata[] = []): VideoSlot[] =>
  Array.from({ length: TOTAL_UPLOAD_SLOTS }, (_, index) => {
    const slotId = index + 1;
    const savedVideo = savedVideos.find((video) => video.slotId === slotId);

    return {
      id: slotId,
      uri: savedVideo?.uri,
      name: savedVideo?.name,
      type: savedVideo?.type,
      asset: savedVideo
        ? {
            uri: savedVideo.uri,
            kind: 'video',
            fileName: savedVideo.name,
            mimeType: savedVideo.type,
            width: savedVideo.width,
            height: savedVideo.height,
            duration: savedVideo.duration,
          }
        : undefined,
    };
  });

function getVideoName(asset: PickedMediaAsset, slotId: number) {
  const uriName = asset.uri.split('/').pop();
  return asset.fileName || uriName || `Video ${slotId}`;
}

export default function CreatorVideoUploadScreen() {
  const navigation = useNavigation<VideoUploadNavigation>();
  const creatorState = useCreatorState();
  const { width } = useWindowDimensions();
  const [selectedSlotId, setSelectedSlotId] = useState(1);
  const [videoSlots, setVideoSlots] = useState<VideoSlot[]>(() => createVideoSlots(creatorState.videos));
  const [error, setError] = useState('');

  const cardWidth = useMemo(() => {
    const horizontalPadding = width >= 768 ? spacing.xxxl * 2 : spacing.screen * 2;
    const availableWidth = Math.min(width - horizontalPadding, 620);
    return Math.floor((availableWidth - GRID_GAP) / 2);
  }, [width]);

  const uploadedVideos = useMemo(() => videoSlots.filter((slot) => Boolean(slot.uri)), [videoSlots]);
  const hasMinimumVideos = uploadedVideos.length >= 1;

  const handlePickVideo = useCallback(async (slotId: number) => {
    setSelectedSlotId(slotId);

    const result = await pickVideo();

    if (result.asset) {
      const nextAsset = result.asset;

      setVideoSlots((current) =>
        current.map((slot) =>
          slot.id === slotId
            ? {
                ...slot,
                uri: nextAsset.uri,
                name: getVideoName(nextAsset, slotId),
                type: nextAsset.mimeType,
                asset: nextAsset,
              }
            : slot,
        ),
      );
      saveCreatorVideoAsset(slotId, nextAsset, getVideoName(nextAsset, slotId));
      setError('');
      return;
    }

    if (result.error) {
      setError(result.error);
    }
  }, []);

  const finalizeOnboarding = useCallback(() => {
    completeCreatorVideoStep();
  }, []);

  const persistSelectedVideos = useCallback(() => {
    setCreatorVideos(
      uploadedVideos.map((slot) => ({
        slotId: slot.id,
        uri: slot.uri ?? '',
        name: slot.name ?? `Video ${slot.id}`,
        type: slot.type,
        width: slot.asset?.width,
        height: slot.asset?.height,
        duration: slot.asset?.duration,
      })),
    );
  }, [uploadedVideos]);

  const handleSubmit = useCallback(() => {
    if (!hasMinimumVideos) {
      setError('Upload at least 1 video to continue');
      return;
    }

    persistSelectedVideos();
    finalizeOnboarding();
  }, [hasMinimumVideos, finalizeOnboarding, persistSelectedVideos]);

  const handleSkip = useCallback(() => {
    if (!hasMinimumVideos) {
      setError('Upload at least 1 video to continue');
      return;
    }

    persistSelectedVideos();
    finalizeOnboarding();
  }, [finalizeOnboarding, hasMinimumVideos, persistSelectedVideos]);

  const handleRemoveVideo = useCallback((slotId: number) => {
    setVideoSlots((current) =>
      current.map((slot) =>
        slot.id === slotId
          ? {
              id: slot.id,
            }
          : slot,
      ),
    );
    removeCreatorVideo(slotId);
    setError('');
  }, []);

  return (
    <AppScreen scroll style={styles.screen} contentStyle={styles.scrollContent}>
      <ResponsiveContainer maxWidth={620} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upload Your Best Video!</Text>
          <Text style={styles.subtitle}>Please upload your best UGC/AD videos.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {!hasMinimumVideos ? <Text style={styles.helper}>Upload at least 1 video to continue</Text> : null}
        </View>

        <View style={styles.grid}>
          {videoSlots.map((slot) => (
            <VideoUploadCard
              key={slot.id}
              selected={selectedSlotId === slot.id}
              asset={slot.asset}
              fileName={slot.name}
              onPress={() => handlePickVideo(slot.id)}
              onRemove={slot.asset ? () => handleRemoveVideo(slot.id) : undefined}
              style={[styles.card, { width: cardWidth }]}
            />
          ))}
        </View>

        <PrimaryButton
          title={hasMinimumVideos ? `Continue with ${uploadedVideos.length} video${uploadedVideos.length > 1 ? 's' : ''}` : 'Submit'}
          onPress={handleSubmit}
          disabled={!hasMinimumVideos}
          style={styles.submit}
        />
        {hasMinimumVideos ? <SecondaryButton title="Skip for now" onPress={handleSkip} style={styles.skipButton} /> : null}
      </ResponsiveContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: spacing.huge,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'flex-start',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  helper: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  card: {
    maxWidth: 292,
    minWidth: 132,
  },
  submit: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    marginTop: spacing.xxl,
  },
  skipButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 260,
    marginTop: spacing.md,
  },
});
