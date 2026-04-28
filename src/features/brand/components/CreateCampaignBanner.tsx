import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface CreateCampaignBannerProps {
  onCreatePress: () => void;
}

export default function CreateCampaignBanner({ onCreatePress }: CreateCampaignBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="account-heart-outline" size={34} color={colors.white} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Ready to Collaborate?</Text>
        <Text style={styles.subtitle}>Create a campaign and start connecting with influencers.</Text>
        <PrimaryButton title="Create Campaign" onPress={onCreatePress} tone="gold" style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: '#7657E8',
    padding: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.white,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
  button: {
    alignSelf: 'flex-start',
    minWidth: 160,
    marginTop: spacing.md,
  },
});
