import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreatorNavigator from './CreatorNavigator';
import AuthNavigator from './AuthNavigator';
import BrandNavigator from './BrandNavigator';
import type { RootStackParamList } from './types';
import { clearAuthSession, replaceAuthSession, useAuthState, type AuthRole } from '../store/auth.store';
import { useCreatorState } from '../store/creator.store';
import { useBrandState } from '../store/brand.store';
import AppStateView from '../../shared/components/AppStateView';
import { useAppBootstrap } from '../../shared/hooks/useAppBootstrap';
import CreatorKycScreen from '../../features/creator/screens/CreatorKycScreen';
import CreatorVideoUploadScreen from '../../features/creator/screens/CreatorVideoUploadScreen';
import BrandOnboardingScreen from '../../features/brand/screens/BrandOnboardingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

function getActiveRouteName(state: ReturnType<typeof navigationRef.getRootState> | undefined): string | undefined {
  if (!state) {
    return undefined;
  }

  const route = state.routes[state.index ?? 0];

  if (!route) {
    return undefined;
  }

  if (route.state) {
    return getActiveRouteName(route.state as ReturnType<typeof navigationRef.getRootState>);
  }

  return route.name;
}

function useCreatorAndroidBackHandler(enabled: boolean, onboarding: { kycCompleted: boolean; videoStepCompleted: boolean }) {
  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigationRef.isReady()) {
        return false;
      }

      const activeRouteName = getActiveRouteName(navigationRef.getRootState());

      // If we are at the root of any onboarding screen, exit the app instead of going "back" to nothing/Auth
      if (activeRouteName === 'CreatorHome' || activeRouteName === 'CreatorKyc' || activeRouteName === 'CreatorVideoUpload') {
        BackHandler.exitApp();
        return true;
      }

      // If onboarding is not complete, we don't want to reset to 'Creator' (which is the Tabs navigator)
      // because that route doesn't exist in the stack yet.
      if (!onboarding.kycCompleted || !onboarding.videoStepCompleted) {
        return false; // Let default back behavior happen or stay on screen
      }

      // For users who have completed onboarding, ensure back press always takes them to Home
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Creator',
              params: {
                screen: 'CreatorTabs',
                params: {
                  screen: 'CreatorHome',
                },
              },
            },
          ],
        }),
      );

      return true;
    });

    return () => subscription.remove();
  }, [enabled, onboarding.kycCompleted, onboarding.videoStepCompleted]);
}

function getClerkRole(user: ReturnType<typeof useUser>['user']): Exclude<AuthRole, null> | null {
  const publicRole = user?.publicMetadata?.role;
  const unsafeRole = user?.unsafeMetadata?.role;
  const role = publicRole ?? unsafeRole;

  return role === 'creator' || role === 'brand' ? role : null;
}

function getPrimaryEmail(user: ReturnType<typeof useUser>['user']) {
  return user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? '';
}

function getAuthProvider(user: ReturnType<typeof useUser>['user']) {
  const provider = user?.externalAccounts?.[0]?.provider;
  return provider?.includes('apple') ? 'apple' : 'google';
}

export default function RootNavigator() {
  const bootstrap = useAppBootstrap();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const authState = useAuthState();
  const creatorState = useCreatorState();
  const brandState = useBrandState();
  const role = getClerkRole(user);

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded || bootstrap.status !== 'ready') {
      return;
    }

    if (!isSignedIn || !user || !role) {
      if (authState.isAuthenticated) {
        clearAuthSession();
      }
      return;
    }

    const currentRole = getClerkRole(user) || 'creator';

    replaceAuthSession({
      isBootstrapping: false,
      isAuthenticated: true,
      role: currentRole,
      user: {
        id: user.id,
        name: user.fullName || user.firstName || 'Busket User',
        email: getPrimaryEmail(user),
        provider: getAuthProvider(user),
        role: currentRole as 'creator' | 'brand',
      },
    });
  }, [authState.isAuthenticated, bootstrap.status, isAuthLoaded, isSignedIn, isUserLoaded, role, user]);

  const signedIn = Boolean(isSignedIn);
  const isCreatorSession = bootstrap.status === 'ready' && signedIn && role === 'creator';
  const isBrandSession =
    bootstrap.status === 'ready' &&
    signedIn &&
    role === 'brand' &&
    brandState.onboardingCompleted;

  useCreatorAndroidBackHandler(isCreatorSession, creatorState.onboarding);

  if (bootstrap.status === 'loading' || authState.isBootstrapping || !isAuthLoaded || !isUserLoaded) {
    return <AppStateView loading title="Opening Busket" message="Restoring your session securely." />;
  }

  if (bootstrap.status === 'error') {
    return (
      <AppStateView
        title="Could not open Busket"
        message={bootstrap.error ?? 'Please check your connection and try again.'}
        actionLabel="Retry"
        onActionPress={bootstrap.retry}
      />
    );
  }

  const renderCreatorFlow = () => {
    const { onboarding } = creatorState;
    const isRegister = authState.authIntent === 'register';

    // If it's a login, skip KYC and Video Upload
    if (!isRegister) {
      return <Stack.Screen name="Creator" component={CreatorNavigator} />;
    }

    if (!onboarding.kycCompleted) {
      return <Stack.Screen name="CreatorKyc" component={CreatorKycScreen} />;
    }

    if (!onboarding.videoStepCompleted) {
      return <Stack.Screen name="CreatorVideoUpload" component={CreatorVideoUploadScreen} />;
    }

    return <Stack.Screen name="Creator" component={CreatorNavigator} />;
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!signedIn || !role ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : isCreatorSession ? (
          renderCreatorFlow()
        ) : signedIn && role === 'brand' && !brandState.onboardingCompleted && authState.authIntent === 'register' ? (
          <Stack.Screen name="BrandOnboarding" component={BrandOnboardingScreen} />
        ) : isBrandSession || (signedIn && role === 'brand') ? (
          <Stack.Screen name="Brand" component={BrandNavigator} />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
