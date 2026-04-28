import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRoot from './src/app/AppRoot';
import ClerkProvider from './src/app/providers/ClerkProvider';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider>
          <AppRoot />
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
