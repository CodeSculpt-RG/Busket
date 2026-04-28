import { useSyncExternalStore } from 'react';
import {
  clearCreatorState,
  getCreatorState,
  setCreatorAuthenticated,
  setCreatorPersistenceHandler,
} from './creator.store';
import { apiClient } from '../../shared/services/apiClient';
import { sessionService } from '../../shared/services/sessionService';
import { getBrandState, resetBrand, setBrandPersistenceHandler } from './brand.store';

export type AuthRole = 'creator' | 'brand' | null;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'apple';
  role: 'creator' | 'brand';
};

export type AuthSnapshot = {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  role: AuthRole;
  user: AuthUser | null;
  authIntent: 'login' | 'register' | null;
  accessToken?: string;
  expiresAt?: string;
};

export type AuthState = AuthSnapshot & {
  finishBootstrap: () => void;
  loginWithSocial: (user: AuthUser, intent: 'login' | 'register') => void;
  logout: () => void;
};

let authState: AuthSnapshot = {
  isBootstrapping: true,
  isAuthenticated: false,
  role: null,
  user: null,
  authIntent: null,
};

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const setAuthSession = (nextState: AuthSnapshot) => {
  authState = nextState;
  setCreatorAuthenticated(nextState.isAuthenticated && nextState.role === 'creator');
  emit();

  void sessionService.persist({
    auth: authState,
    brandOnboardingCompleted: getBrandState().onboardingCompleted,
    brandProfile: getBrandState().profile,
    creatorOnboarding: getCreatorState().onboarding,
    creatorProfile: getCreatorState().profile,
    creatorVideos: getCreatorState().videos,
  });
};

export const setAuthIntent = (intent: 'login' | 'register' | null) => {
  authState = { ...authState, authIntent: intent };
  emit();
};

export const replaceAuthSession = (nextState: Omit<AuthSnapshot, 'authIntent'> & { authIntent?: 'login' | 'register' | null }) => {
  authState = {
    ...nextState,
    authIntent: nextState.authIntent ?? authState.authIntent ?? 'login',
  };
  setCreatorAuthenticated(nextState.isAuthenticated && nextState.role === 'creator');
  emit();
};

export const finishAuthBootstrap = () => {
  authState = {
    ...authState,
    isBootstrapping: false,
  };
  emit();
};

export const clearAuthSession = () => {
  authState = {
    isBootstrapping: false,
    isAuthenticated: false,
    role: null,
    user: null,
    authIntent: null,
  };
  clearCreatorState();
  resetBrand();
  emit();
  void sessionService.clear();
};

export const getAuthState = () => authState;

export const authStore: AuthState = {
  get isAuthenticated() {
    return authState.isAuthenticated;
  },
  get role() {
    return authState.role;
  },
  get user() {
    return authState.user;
  },
  get isBootstrapping() {
    return authState.isBootstrapping;
  },
  get authIntent() {
    return authState.authIntent;
  },
  finishBootstrap: finishAuthBootstrap,
  loginWithSocial: (user: AuthUser, intent: 'login' | 'register') => {
    setAuthSession({ isBootstrapping: false, isAuthenticated: true, role: user.role, user, authIntent: intent });
  },
  logout: clearAuthSession,
};

export const useAuthState = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => authState,
    () => authState,
  );

apiClient.onUnauthorized(clearAuthSession);

setCreatorPersistenceHandler((creatorState) => {
  if (!authState.isAuthenticated) {
    return;
  }

  void sessionService.persist({
    auth: authState,
    brandOnboardingCompleted: getBrandState().onboardingCompleted,
    brandProfile: getBrandState().profile,
    creatorOnboarding: creatorState.onboarding,
    creatorProfile: creatorState.profile,
    creatorVideos: creatorState.videos,
  });
});

setBrandPersistenceHandler((brandState) => {
  if (!authState.isAuthenticated) {
    return;
  }

  void sessionService.persist({
    auth: authState,
    brandOnboardingCompleted: brandState.onboardingCompleted,
    brandProfile: brandState.profile,
    creatorOnboarding: getCreatorState().onboarding,
    creatorProfile: getCreatorState().profile,
    creatorVideos: getCreatorState().videos,
  });
});
