import React from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { ClerkProvider as ExpoClerkProvider } from '@clerk/clerk-expo';
import AppStateView from '../../shared/components/AppStateView';

// High-level browser session completion check
WebBrowser.maybeCompleteAuthSession();

// Load publishable key with fallback
const publishableKey = 
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 
  Constants.expoConfig?.extra?.clerkPublishableKey;

// Token cache using SecureStore for permanent sessions
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

interface ClerkProviderProps {
  children: React.ReactNode;
}

export default function ClerkProvider({ children }: ClerkProviderProps) {
  if (!publishableKey) {
    console.error('Clerk Publishable Key is missing. Check your .env or app.config.js');
    return (
      <AppStateView
        title="Clerk configuration missing"
        message="Please add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment variables."
      />
    );
  }

  return (
    <ExpoClerkProvider 
      publishableKey={publishableKey} 
      tokenCache={tokenCache}
    >
      {children}
    </ExpoClerkProvider>
  );
}
