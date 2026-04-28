import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import type { CampaignBrief } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CampaignBriefCardProps {
  brief: CampaignBrief;
  applied: boolean;
  onApplyPress: () => void;
}

function CampaignBriefCard({ brief, applied, onApplyPress }: CampaignBriefCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Campaign Brief</Text>
      <Text style={styles.body}>{brief.intro}</Text>
      <Text style={styles.body}>
        <Text style={styles.strong}>Coupon Code: </Text>
        {brief.couponCode}
      </Text>
      <Text style={styles.body}>
        Use it on {brief.website} to {brief.offerText}
      </Text>
      <Text style={styles.subTitle}>Campaign Guidelines</Text>
      {brief.guidelines.map((guideline, index) => (
        <View key={`${guideline}-${index}`} style={styles.guidelineRow}>
          <Text style={styles.bullet}>{index + 1}</Text>
          <Text style={styles.guideline}>{guideline}</Text>
        </View>
      ))}

      <PrimaryButton
        title={applied ? 'Applied' : 'Apply Now!'}
        tone="gold"
        disabled={applied}
        onPress={onApplyPress}
        style={styles.applyButton}
      />
    </View>
  );
}

export default React.memo(CampaignBriefCard);

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#FFE6B7',
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.bold,
  },
  subTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.heavy,
  },
  body: {
    marginTop: 5,
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: fontWeight.medium,
  },
  strong: {
    fontWeight: fontWeight.heavy,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  bullet: {
    width: 18,
    height: 18,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: typography.tiny,
    lineHeight: 18,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  guideline: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: fontWeight.medium,
  },
  applyButton: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 270,
    marginTop: spacing.lg,
    borderRadius: radius.pill,
  },
});
