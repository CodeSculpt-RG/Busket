import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AppScreen from './AppScreen';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fontWeight, typography } from '../theme/typography';

interface AppStateViewProps {
  title: string;
  message?: string;
  actionLabel?: string;
  loading?: boolean;
  onActionPress?: () => void;
}

export default function AppStateView({ title, message, actionLabel, loading = false, onActionPress }: AppStateViewProps) {
  return (
    <AppScreen style={styles.screen}>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={colors.gold} size="large" /> : null}
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {actionLabel && onActionPress ? (
          <PrimaryButton title={actionLabel} onPress={onActionPress} tone="gold" style={styles.button} />
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: fontWeight.medium,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 240,
    marginTop: spacing.xl,
  },
});
