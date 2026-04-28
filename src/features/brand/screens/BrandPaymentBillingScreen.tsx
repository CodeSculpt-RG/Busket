import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const billingRows = [
  { id: 'method', title: 'Payment method', subtitle: 'No card or UPI mandate added', icon: 'credit-card-outline' },
  { id: 'invoice', title: 'Invoices', subtitle: 'No invoices generated yet', icon: 'file-document-outline' },
  { id: 'payouts', title: 'Creator payouts', subtitle: 'Released after campaign approval', icon: 'cash-fast' },
];

export default function BrandPaymentBillingScreen() {
  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.container}>
        <Text style={styles.headerTitle}>Payment & Billing</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Wallet balance</Text>
            <Text style={styles.summaryAmount}>INR 0</Text>
            <Text style={styles.summaryText}>Add funds when you are ready to launch paid creator campaigns.</Text>
          </View>

          <View style={styles.rowsCard}>
            {billingRows.map((row, index) => (
              <View key={row.id} style={[styles.billingRow, index < billingRows.length - 1 && styles.rowBorder]}>
                <View style={styles.rowIcon}>
                  <MaterialCommunityIcons name={row.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={22} color={colors.black} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="receipt-text-outline" size={30} color={colors.goldDark} />
            <Text style={styles.emptyTitle}>No billing activity yet</Text>
            <Text style={styles.emptyText}>Campaign invoices and payment history will appear here.</Text>
          </View>
        </ScrollView>
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
  content: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
  },
  summaryCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    padding: spacing.xl,
  },
  summaryLabel: {
    color: colors.gold,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  summaryAmount: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.hero,
    fontWeight: fontWeight.heavy,
  },
  summaryText: {
    marginTop: spacing.sm,
    color: colors.textInverse,
    fontSize: typography.body,
    fontWeight: fontWeight.medium,
  },
  rowsCard: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billingRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
  },
  rowCopy: { flex: 1, minWidth: 0 },
  rowTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  rowSubtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});
