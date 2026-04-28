import { useSyncExternalStore } from 'react';
import type { PickedMediaAsset } from '../../shared/types/media';

export type CreatorProfile = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  languages: string[];
  categories: string[];
  gender: string;
  dob: string;
  avatarUri?: string;
  followers?: number;
  instagramHandle?: string;
};

export type CreatorVideoMetadata = {
  slotId: number;
  uri: string;
  name: string;
  type?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type CreatorOnboardingState = {
  kycCompleted: boolean;
  videoStepCompleted: boolean;
};

export type CreatorState = {
  isAuthenticated: boolean;
  onboarding: CreatorOnboardingState;
  kycCompleted: boolean;
  videoStepCompleted: boolean;
  profile: CreatorProfile | null;
  videos: CreatorVideoMetadata[];
  completeKyc: () => void;
  completeVideoStep: () => void;
  resetCreator: () => void;
  setKycCompleted: (completed: boolean) => void;
  setVideoStepCompleted: (completed: boolean) => void;
  setProfile: (data: CreatorProfile) => void;
  updateProfile: (data: Partial<CreatorProfile>) => void;
  setVideos: (videos: CreatorVideoMetadata[]) => void;
  saveVideoAsset: (slotId: number, asset: PickedMediaAsset, name: string) => void;
  removeVideo: (slotId: number) => void;
  logout: () => void;
};

type CreatorSnapshot = Pick<CreatorState, 'isAuthenticated' | 'onboarding' | 'profile' | 'videos'>;

let creatorState: CreatorSnapshot = {
  isAuthenticated: false,
  onboarding: {
    kycCompleted: false,
    videoStepCompleted: false,
  },
  profile: null,
  videos: [],
};
let persistenceHandler: ((state: CreatorSnapshot) => void) | null = null;

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const getCreatorState = () => creatorState;

export const setCreatorPersistenceHandler = (handler: ((state: CreatorSnapshot) => void) | null) => {
  persistenceHandler = handler;
};

const persistCreatorState = () => {
  persistenceHandler?.(creatorState);
};

export const replaceCreatorState = (nextState: CreatorSnapshot) => {
  creatorState = nextState;
  emit();
};

export const setCreatorAuthenticated = (isAuthenticated: boolean) => {
  creatorState = {
    ...creatorState,
    isAuthenticated,
  };
  emit();
  persistCreatorState();
};

export const setCreatorKycCompleted = (kycCompleted: boolean) => {
  creatorState = {
    ...creatorState,
    onboarding: {
      ...creatorState.onboarding,
      kycCompleted,
    },
  };
  emit();
  persistCreatorState();
};

export const completeCreatorKyc = () => {
  setCreatorKycCompleted(true);
};

export const setCreatorVideoStepCompleted = (videoStepCompleted: boolean) => {
  creatorState = {
    ...creatorState,
    onboarding: {
      ...creatorState.onboarding,
      videoStepCompleted,
    },
  };
  emit();
  persistCreatorState();
};

export const completeCreatorVideoStep = () => {
  setCreatorVideoStepCompleted(true);
};

export const setCreatorProfile = (profile: CreatorProfile) => {
  creatorState = {
    ...creatorState,
    isAuthenticated: true,
    onboarding: {
      ...creatorState.onboarding,
      kycCompleted: true,
    },
    profile,
  };
  emit();
  persistCreatorState();
};

export const updateCreatorProfile = (profile: Partial<CreatorProfile>) => {
  if (!creatorState.profile) {
    return;
  }

  creatorState = {
    ...creatorState,
    profile: {
      ...creatorState.profile,
      ...profile,
    },
  };
  emit();
  persistCreatorState();
};

export const setCreatorVideos = (videos: CreatorVideoMetadata[]) => {
  creatorState = {
    ...creatorState,
    videos,
  };
  emit();
  persistCreatorState();
};

export const saveCreatorVideoAsset = (slotId: number, asset: PickedMediaAsset, name: string) => {
  const metadata: CreatorVideoMetadata = {
    slotId,
    uri: asset.uri,
    name,
    type: asset.mimeType,
    width: asset.width,
    height: asset.height,
    duration: asset.duration,
  };
  const nextVideos = creatorState.videos.filter((video) => video.slotId !== slotId);

  setCreatorVideos([...nextVideos, metadata].sort((first, second) => first.slotId - second.slotId));
};

export const removeCreatorVideo = (slotId: number) => {
  setCreatorVideos(creatorState.videos.filter((video) => video.slotId !== slotId));
};

export const clearCreatorState = () => {
  creatorState = {
    isAuthenticated: false,
    onboarding: {
      kycCompleted: false,
      videoStepCompleted: false,
    },
    profile: null,
    videos: [],
  };
  emit();
};

export const creatorStore: CreatorState = {
  get isAuthenticated() {
    return creatorState.isAuthenticated;
  },
  get onboarding() {
    return creatorState.onboarding;
  },
  get kycCompleted() {
    return creatorState.onboarding.kycCompleted;
  },
  get videoStepCompleted() {
    return creatorState.onboarding.videoStepCompleted;
  },
  get profile() {
    return creatorState.profile;
  },
  get videos() {
    return creatorState.videos;
  },
  completeKyc: completeCreatorKyc,
  completeVideoStep: completeCreatorVideoStep,
  resetCreator: clearCreatorState,
  setKycCompleted: setCreatorKycCompleted,
  setVideoStepCompleted: setCreatorVideoStepCompleted,
  setProfile: setCreatorProfile,
  updateProfile: updateCreatorProfile,
  setVideos: setCreatorVideos,
  saveVideoAsset: saveCreatorVideoAsset,
  removeVideo: removeCreatorVideo,
  logout: clearCreatorState,
};

export const useCreatorState = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => creatorState,
    () => creatorState,
  );

export const useCreatorProfile = () => useCreatorState().profile;
