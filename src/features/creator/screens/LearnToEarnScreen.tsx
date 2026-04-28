import React, { useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type LearnNavigation = NavigationProp<CreatorStackParamList>;

const lessons = [
  { id: 'brief', title: 'Read the brief like a creator lead', time: '6 min', icon: 'file-document-outline' },
  { id: 'pitch', title: 'Write applications brands trust', time: '8 min', icon: 'message-text-outline' },
  { id: 'ugc', title: 'Shoot UGC that converts', time: '11 min', icon: 'video-outline' },
  { id: 'payout', title: 'Track work, approvals, and payout hygiene', time: '5 min', icon: 'wallet-outline' },
];

export default function LearnToEarnScreen() {
  const navigation = useNavigation<LearnNavigation>();

  const handleFindCampaigns = useCallback(() => {
    navigation.navigate('CreatorTabs', { screen: 'CreatorCampaignTab' });
  }, [navigation]);

  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Learn to Earn</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Creator Navigator</Text>
          <Text style={styles.title}>Build better campaign work, then turn it into repeatable income.</Text>
          <PrimaryButton title="Find Campaigns" onPress={handleFindCampaigns} tone="gold" style={styles.cta} />
        </View>

        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.lesson}>
              <View style={styles.lessonIcon}>
                <MaterialCommunityIcons name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={22} color={colors.black} />
              </View>
              <View style={styles.lessonCopy}>
                <Text style={styles.lessonTitle}>{item.title}</Text>
                <Text style={styles.lessonTime}>{item.time}</Text>
              </View>
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
  hero: {
    borderRadius: radius.lg,
    backgroundColor: colors.black,
    marginTop: spacing.md,
    padding: spacing.xl,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  title: {
    marginTop: spacing.sm,
    color: colors.white,
    fontSize: typography.heading,
    lineHeight: 30,
    fontWeight: fontWeight.heavy,
  },
  cta: {
    marginTop: spacing.xl,
  },
  list: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  lesson: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  lessonIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    marginRight: spacing.md,
  },
  lessonCopy: {
    flex: 1,
  },
  lessonTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  lessonTime: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
});
