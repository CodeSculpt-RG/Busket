import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface KeyboardAwareScreenProps {
  children?: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  keyboardVerticalOffset?: number;
  stickyFooter?: React.ReactNode;
}

export default function KeyboardAwareScreen({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  keyboardVerticalOffset = 0,
  stickyFooter,
}: KeyboardAwareScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, spacing.md);
  const content = (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={[scroll ? styles.scrollInner : styles.fixedInner, contentContainerStyle]}>{children}</View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, style]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.keyboard}
      >
        {scroll ? (
          <ScrollView
            bounces={false}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: stickyFooter ? spacing.lg : bottomPadding }]}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
        {stickyFooter ? <View style={[styles.footer, { paddingBottom: bottomPadding }]}>{stickyFooter}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollInner: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  fixedInner: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
