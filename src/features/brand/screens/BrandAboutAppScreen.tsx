import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function BrandAboutAppScreen() {
  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.container}>
        <Text style={styles.headerTitle}>About App</Text>
        <View style={styles.card}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="basket-outline" size={34} color={colors.black} />
          </View>
          <Text style={styles.appName}>Busket</Text>
          <Text style={styles.description}>
            Busket helps brands discover trained creators, launch campaigns, review applicants, and manage creator collaborations.
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Support</Text>
            <Text style={styles.infoValue}>support@busket.in</Text>
          </View>
        </View>
      </ResponsiveContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  container: { flex: 1, paddingTop: spacing.xl },
  headerTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
  },
  appName: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: fontWeight.heavy,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.mutedDark,
    fontSize: typography.body,
    fontWeight: fontWeight.medium,
    lineHeight: 21,
    textAlign: 'center',
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  infoValue: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    textAlign: 'right',
  },
});
