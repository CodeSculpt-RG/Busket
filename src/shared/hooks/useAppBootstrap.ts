import { useCallback, useEffect, useState } from 'react';
import { finishAuthBootstrap, replaceAuthSession, type AuthSnapshot } from '../../app/store/auth.store';
import { replaceBrandState } from '../../app/store/brand.store';
import { replaceCreatorState } from '../../app/store/creator.store';
import { sessionService } from '../services/sessionService';

type BootstrapState =
  | { status: 'loading'; error: null }
  | { status: 'ready'; error: null }
  | { status: 'error'; error: string };

const guestAuth: AuthSnapshot = {
  isBootstrapping: false,
  isAuthenticated: false,
  role: null,
  user: null,
};

export const useAppBootstrap = () => {
  const [state, setState] = useState<BootstrapState>({ status: 'loading', error: null });

  const bootstrap = useCallback(async () => {
    setState({ status: 'loading', error: null });
    const result = await sessionService.restore();

    if (result.status === 'authenticated') {
      replaceAuthSession({
        ...result.session.auth,
        isBootstrapping: false,
      });
      replaceCreatorState({
        isAuthenticated: result.session.auth.role === 'creator',
        onboarding: result.session.creatorOnboarding ?? {
          kycCompleted: Boolean(result.session.creatorProfile),
          videoStepCompleted: result.session.creatorVideos.length > 0,
        },
        profile: result.session.creatorProfile,
        videos: result.session.creatorVideos,
      });
      replaceBrandState({
        onboardingCompleted: Boolean(result.session.brandOnboardingCompleted),
        profile: result.session.brandProfile ?? null,
      });
      setState({ status: 'ready', error: null });
      finishAuthBootstrap();
      return;
    }

    if (result.status === 'error') {
      finishAuthBootstrap();
      setState({ status: 'error', error: result.error });
      return;
    }

    replaceAuthSession(guestAuth);
    replaceCreatorState({
      isAuthenticated: false,
      onboarding: {
        kycCompleted: false,
        videoStepCompleted: false,
      },
      profile: null,
      videos: [],
    });
    replaceBrandState({
      onboardingCompleted: false,
      profile: null,
    });
    setState({ status: 'ready', error: null });
    finishAuthBootstrap();
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return {
    ...state,
    retry: bootstrap,
  };
};
