import { useSyncExternalStore } from 'react';
import type { PickedMediaAsset } from '../../shared/types/media';

export type BrandProfile = {
  id?: string;
  businessName: string;
  pocName: string;
  businessEmail: string;
  website: string;
  state: string;
  gstin: string;
  businessCategory: string;
  logoUri?: string;
};

export type BrandState = {
  onboardingCompleted: boolean;
  profile: BrandProfile | null;
  setProfile: (data: BrandProfile) => void;
  updateProfile: (data: Partial<BrandProfile>) => void;
  completeOnboarding: () => void;
  resetBrand: () => void;
  saveLogoAsset: (asset: PickedMediaAsset) => void;
};

type BrandSnapshot = Pick<BrandState, 'onboardingCompleted' | 'profile'>;

let brandState: BrandSnapshot = {
  onboardingCompleted: false,
  profile: null,
};

let persistenceHandler: ((state: BrandSnapshot) => void) | null = null;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const persistBrandState = () => {
  persistenceHandler?.(brandState);
};

export const getBrandState = () => brandState;

export const setBrandPersistenceHandler = (handler: ((state: BrandSnapshot) => void) | null) => {
  persistenceHandler = handler;
};

export const replaceBrandState = (nextState: BrandSnapshot) => {
  brandState = nextState;
  emit();
};

export const setBrandProfile = (profile: BrandProfile) => {
  brandState = {
    onboardingCompleted: true,
    profile,
  };
  emit();
  persistBrandState();
};

export const updateBrandProfile = (profile: Partial<BrandProfile>) => {
  if (!brandState.profile) {
    return;
  }

  brandState = {
    ...brandState,
    profile: {
      ...brandState.profile,
      ...profile,
    },
  };
  emit();
  persistBrandState();
};

export const completeBrandOnboarding = () => {
  brandState = {
    ...brandState,
    onboardingCompleted: true,
  };
  emit();
  persistBrandState();
};

export const resetBrand = () => {
  brandState = {
    onboardingCompleted: false,
    profile: null,
  };
  emit();
};

export const saveBrandLogoAsset = (asset: PickedMediaAsset) => {
  updateBrandProfile({ logoUri: asset.uri });
};

export const brandStore: BrandState = {
  get onboardingCompleted() {
    return brandState.onboardingCompleted;
  },
  get profile() {
    return brandState.profile;
  },
  setProfile: setBrandProfile,
  updateProfile: updateBrandProfile,
  completeOnboarding: completeBrandOnboarding,
  resetBrand,
  saveLogoAsset: saveBrandLogoAsset,
};

export const useBrandState = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => brandState,
    () => brandState,
  );

export const useBrandProfile = () => useBrandState().profile;
