import React from 'react';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface AppScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  bottomInset?: boolean;
}

export default function AppScreen({ children, scroll = false, style, contentStyle, bottomInset = true }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = bottomInset ? Math.max(insets.bottom, spacing.md) : 0;

  if (scroll) {
    return (
      <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, style]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }, contentStyle]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, style]}>
      <View style={[styles.content, { paddingBottom: bottomPadding }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
