import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useOAuth } from '@clerk/clerk-expo';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import SocialAuthButton from './SocialAuthButton';
import TermsConsent from './TermsConsent';
import { setAuthIntent } from '../../../app/store/auth.store';

// Initialize WebBrowser session
WebBrowser.maybeCompleteAuthSession();

export type SocialRole = 'creator' | 'brand';
type SocialProvider = 'google' | 'apple';
type AuthIntent = 'login' | 'register';

interface SocialAuthPanelProps {
  role: SocialRole;
  intent: AuthIntent;
  errorMessage: string;
}

// Hook to warm up the browser for faster OAuth launch on Android
function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }
  }, []);
}

export default function SocialAuthPanel({ role, intent, errorMessage }: SocialAuthPanelProps) {
  useWarmUpBrowser();
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });

  const startOAuth = useCallback(
    async (provider: SocialProvider) => {
      if (!acceptedTerms) return;

      setLoadingProvider(provider);

      try {
        const oauth = provider === 'google' ? googleOAuth : appleOAuth;
        
        // Use a consistent redirect URI that matches the Clerk Dashboard config
        const redirectUrl = makeRedirectUri({
          scheme: 'busket',
        });

        const { createdSessionId, setActive } = await oauth.startOAuthFlow({
          redirectUrl,
          unsafeMetadata: { role },
        });

        if (createdSessionId && setActive) {
          // Set the intent in the store before activating the session
          // so RootNavigator can use it to determine the flow.
          setAuthIntent(intent);
          await setActive({ session: createdSessionId });
        } else {
          // If no session is created, it's likely a user cancellation.
          // We don't show an alert here to avoid annoying the user.
          console.log(`${provider} auth was cancelled or did not produce a session.`);
        }
      } catch (err) {
        console.error('Authentication Error:', err);
        Alert.alert('Authentication Error', errorMessage);
      } finally {
        setLoadingProvider(null);
      }
    },
    [acceptedTerms, appleOAuth, errorMessage, googleOAuth, intent, role],
  );

  return (
    <>
      <TermsConsent accepted={acceptedTerms} onToggle={() => setAcceptedTerms((current) => !current)} />

      <View style={styles.buttonGroup}>
        <SocialAuthButton
          provider="google"
          label={intent === 'register' ? 'Sign up with Google' : 'Continue with Google'}
          disabled={!acceptedTerms}
          loading={loadingProvider === 'google'}
          onPress={() => startOAuth('google')}
        />

        {/* Apple Sign-In is only shown/enabled on iOS as per Apple/Google guidelines */}
        {Platform.OS === 'ios' && (
          <SocialAuthButton
            provider="apple"
            label={intent === 'register' ? 'Sign up with Apple' : 'Continue with Apple'}
            disabled={!acceptedTerms}
            loading={loadingProvider === 'apple'}
            onPress={() => startOAuth('apple')}
          />
        )}
        
        {!acceptedTerms ? (
          <Text style={styles.helper}>Accept Terms & Privacy Policy to continue.</Text>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: spacing.lg,
  },
  helper: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
