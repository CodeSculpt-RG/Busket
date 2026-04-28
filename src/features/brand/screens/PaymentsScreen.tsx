import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const invoices = [
  { id: 'pay-1', title: 'Creator payouts reserved', amount: 'INR 36,000' },
  { id: 'pay-2', title: 'Campaign spend this month', amount: 'INR 82,500' },
  { id: 'pay-3', title: 'Pending approvals', amount: 'INR 14,000' },
];

export default function PaymentsScreen() {
  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.content}>
        <Text style={styles.title}>Payments</Text>
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowAmount}>{item.amount}</Text>
            </View>
          )}
        />
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
  list: {
    paddingTop: spacing.lg,
  },
  row: {
    minHeight: 62,
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  rowTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  rowAmount: {
    marginTop: spacing.xs,
    color: colors.goldDark,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
});
