import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type EarningsNavigation = NavigationProp<CreatorStackParamList>;

const payouts = [
  { id: 'earn-1', title: 'Morning Skincare Launch', amount: 'INR 3,000', status: 'Ready' },
  { id: 'earn-2', title: 'Desk Setup Reel', amount: 'INR 1,200', status: 'Processing' },
  { id: 'earn-3', title: 'Festival Static Post', amount: 'INR 900', status: 'Paid' },
];

export default function EarningsScreen() {
  const navigation = useNavigation<EarningsNavigation>();

  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.82}
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Earnings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summary}>
          <Text style={styles.label}>Available Earnings</Text>
          <Text style={styles.amount}>INR 5,100</Text>
          <Text style={styles.meta}>Next payout cycle: Friday</Text>
        </View>
        <FlatList
          data={payouts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowStatus}>{item.status}</Text>
              </View>
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
    paddingTop: spacing.sm,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  summary: {
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    padding: spacing.xl,
  },
  label: {
    color: colors.gold,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  amount: {
    marginTop: spacing.sm,
    color: colors.white,
    fontSize: typography.hero,
    fontWeight: fontWeight.heavy,
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.surfaceMuted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  list: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  rowCopy: {
    flex: 1,
    paddingRight: spacing.md,
  },
  rowTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  rowStatus: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  rowAmount: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
});
