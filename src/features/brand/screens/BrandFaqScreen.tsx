import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const faqs = [
  {
    question: 'How do I create a campaign?',
    answer: 'Open Campaign Management, choose Create Campaign, add the brief, payout, timeline, and submit it for review.',
  },
  {
    question: 'How do I review applicants?',
    answer: 'Use the Applicants section to see creator profiles, shortlist creators, and contact the ones that fit your brief.',
  },
  {
    question: 'How are campaign payments handled?',
    answer: 'Campaign budgets are reserved before launch and creator payouts are released after agreed deliverables are approved.',
  },
  {
    question: 'Can I edit a campaign after publishing?',
    answer: 'Draft campaigns can be edited any time. Published campaigns can be updated for minor details before creators are assigned.',
  },
  {
    question: 'How do I contact creators?',
    answer: 'Open an applicant or creator profile and use Contact to send a collaboration request from Busket.',
  },
];

export default function BrandFaqScreen() {
  const [openQuestion, setOpenQuestion] = useState(faqs[0]?.question ?? '');

  return (
    <AppScreen style={styles.screen}>
      <ResponsiveContainer style={styles.container}>
        <Text style={styles.headerTitle}>FAQ</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {faqs.map((faq) => {
            const expanded = openQuestion === faq.question;

            return (
              <Pressable
                key={faq.question}
                accessibilityRole="button"
                onPress={() => setOpenQuestion(expanded ? '' : faq.question)}
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              >
                <View style={styles.questionRow}>
                  <Text style={styles.question}>{faq.question}</Text>
                  <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color={colors.black} />
                </View>
                {expanded ? <Text style={styles.answer}>{faq.answer}</Text> : null}
              </Pressable>
            );
          })}
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
  item: {
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  question: {
    flex: 1,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  answer: {
    marginTop: spacing.md,
    color: colors.mutedDark,
    fontSize: typography.body,
    fontWeight: fontWeight.medium,
    lineHeight: 21,
  },
});
