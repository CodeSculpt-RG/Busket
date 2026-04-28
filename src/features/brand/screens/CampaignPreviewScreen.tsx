import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandCampaignFlowCampaign, BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function CampaignPreviewScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'CampaignPreview'>>();
  const campaign = route.params.campaign;

  const handlePublish = () => {
    const publishedCampaign: BrandCampaignFlowCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      status: 'active',
    };

    navigation.navigate('CampaignSuccess', { campaign: publishedCampaign });
  };

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <ResponsiveContainer maxWidth={620}>
          <Text style={styles.title}>Campaign Preview</Text>
          <View style={styles.card}>
            <PreviewRow label="Campaign name" value={campaign.name} />
            <PreviewRow label="Category" value={campaign.category} />
            <PreviewRow label="Brief" value={campaign.brief} />
            <PreviewRow label="Payout" value={campaign.payout} />
            <PreviewRow label="Start date" value={campaign.startDate} />
            <PreviewRow label="End date" value={campaign.endDate} />
            <PreviewRow label="Product link" value={campaign.productLink} />
          </View>
          <PrimaryButton title="Publish Campaign" onPress={handlePublish} style={styles.button} />
        </ResponsiveContainer>
      </ScrollView>
    </AppScreen>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  scroll: { paddingTop: spacing.xl, paddingBottom: 110 },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  card: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  value: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.semibold,
  },
  button: {
    marginTop: spacing.xl,
  },
});
