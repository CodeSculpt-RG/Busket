import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, type GestureResponderHandlers } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { VideoSource } from 'expo-video';
import TrendActionBar from './TrendActionBar';
import TrendOverlayLabel from './TrendOverlayLabel';
import type { TrendCardItem } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface TrendFinderCardProps {
  item: TrendCardItem;
  active: boolean;
  width: number;
  height: number;
  interested: boolean;
  saved: boolean;
  playbackEnabled: boolean;
  gestureHandlers?: GestureResponderHandlers;
  onInterestedPress: () => void;
  onSavePress: () => void;
  onSharePress: () => void;
}

function TrendFinderCard({
  item,
  active,
  width,
  height,
  interested,
  saved,
  playbackEnabled,
  gestureHandlers,
  onInterestedPress,
  onSavePress,
  onSharePress,
}: TrendFinderCardProps) {
  return (
    <View {...gestureHandlers} style={[styles.card, { width, height }]}>
      <ImageBackground source={item.fallbackImage} style={styles.media} imageStyle={styles.mediaImage}>
        {active && item.mediaType === 'video' ? (
          <TrendVideoSurface source={item.mediaSource as VideoSource} playbackEnabled={playbackEnabled} />
        ) : null}
        <View style={styles.scrim} />

        <View style={styles.copy}>
          <Text style={styles.category}>{item.category}</Text>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
        </View>

        {item.annotations.map((annotation) => (
          <TrendOverlayLabel key={annotation.id} annotation={annotation} />
        ))}

        {active ? (
          <TrendActionBar
            interested={interested}
            saved={saved}
            onInterestedPress={onInterestedPress}
            onSavePress={onSavePress}
            onSharePress={onSharePress}
          />
        ) : null}
      </ImageBackground>
    </View>
  );
}

export default React.memo(TrendFinderCard);

function TrendVideoSurface({ source, playbackEnabled }: { source: VideoSource; playbackEnabled: boolean }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const mountedRef = useRef(true);
  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // The native player may already be released during fast card transitions.
      }
      mountedRef.current = false;
    };
  }, [player]);

  useEffect(() => {
    if (!mountedRef.current || videoFailed) {
      return;
    }

    try {
      const result = (playbackEnabled ? player.play() : player.pause()) as unknown;
      if (result && typeof (result as Promise<void>).catch === 'function') {
        (result as Promise<void>).catch(() => {
          if (mountedRef.current) {
            setVideoFailed(true);
          }
        });
      }
    } catch {
      setVideoFailed(true);
    }
  }, [playbackEnabled, player, videoFailed]);

  if (videoFailed) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Preview unavailable</Text>
      </View>
    );
  }

  return (
    <VideoView
      player={player}
      nativeControls={false}
      contentFit="cover"
      fullscreenOptions={{ enable: false }}
      onFirstFrameRender={() => {
        if (mountedRef.current) {
          setVideoReady(true);
        }
      }}
      style={[styles.video, videoReady && styles.videoReady]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    backgroundColor: colors.charcoal,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  media: {
    flex: 1,
    overflow: 'hidden',
  },
  mediaImage: {
    borderRadius: radius.xl,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  videoReady: {
    opacity: 1,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  fallbackText: {
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  copy: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    top: spacing.lg,
  },
  category: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.white,
    fontSize: typography.heading,
    lineHeight: 29,
    fontWeight: fontWeight.heavy,
  },
});
