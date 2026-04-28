import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function ContractsScreen() {
  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.content}>
        <Text style={styles.title}>Contracts</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Creator agreements</Text>
          <Text style={styles.body}>Approved campaign contracts and brand usage rights will appear here.</Text>
        </View>
      </ResponsiveContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  card: {
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  body: {
    marginTop: spacing.sm,
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
  },
});
