import React, { useCallback, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type FaqNavigation = NavigationProp<CreatorStackParamList>;

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'apply',
    question: 'How do I apply for a campaign?',
    answer: 'Open a campaign, review the requirements and brief, then tap Apply Now. Fill the application form with your creator details and submit it for brand review.',
  },
  {
    id: 'portfolio',
    question: 'How do I upload my portfolio videos?',
    answer: 'During creator setup, upload your best sample videos. You can update your creator details from Profile whenever you want to refresh your portfolio.',
  },
  {
    id: 'payouts',
    question: 'How are payouts processed?',
    answer: 'Payouts are processed after the brand approves your deliverables and the campaign requirements are completed. You can track payout-related details from the Payment section.',
  },
  {
    id: 'profile',
    question: 'How do I update my creator profile?',
    answer: 'Go to Profile and tap Edit Creator Profile. Your KYC details, city, languages, profile photo, and content categories can be updated there.',
  },
  {
    id: 'content',
    question: 'What type of content can I create?',
    answer: 'Each campaign brief lists the expected deliverables such as Reel, Story, or Post. Always follow the campaign brief and brand guidelines before publishing.',
  },
];

export default function FaqScreen() {
  const navigation = useNavigation<FaqNavigation>();
  const [openIds, setOpenIds] = useState<string[]>(['apply']);

  const toggleItem = useCallback((id: string) => {
    setOpenIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }, []);

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ResponsiveContainer>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="frequently-asked-questions" size={46} color={colors.black} />
            </View>
            <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
            <Text style={styles.heroCopy}>Quick answers for creator campaigns, profile setup, and payouts.</Text>
          </View>

          <View style={styles.list}>
            {FAQ_ITEMS.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                open={openIds.includes(item.id)}
                onPress={() => toggleItem(item.id)}
              />
            ))}
          </View>
        </ResponsiveContainer>
      </ScrollView>
    </AppScreen>
  );
}

interface FaqAccordionItemProps {
  item: FaqItem;
  open: boolean;
  onPress: () => void;
}

function FaqAccordionItem({ item, open, onPress }: FaqAccordionItemProps) {
  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity accessibilityRole="button" activeOpacity={0.78} onPress={onPress} style={styles.questionRow}>
        <Text style={styles.question}>{item.question}</Text>
        <MaterialCommunityIcons name={open ? 'minus-circle-outline' : 'plus-circle-outline'} size={22} color={colors.black} />
      </TouchableOpacity>
      {open ? <Text style={styles.answer}>{item.answer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    backgroundColor: colors.background,
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
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  heroIcon: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 46,
    backgroundColor: colors.goldSoft,
  },
  heroTitle: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  heroCopy: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  list: {
    marginTop: spacing.lg,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  questionRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  question: {
    flex: 1,
    paddingRight: spacing.md,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  answer: {
    color: colors.mutedDark,
    fontSize: typography.small,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
