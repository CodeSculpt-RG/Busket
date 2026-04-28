import React, { useCallback, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import CampaignBriefCard from '../components/CampaignBriefCard';
import CampaignHeaderCard from '../components/CampaignHeaderCard';
import ProductScroller from '../components/ProductScroller';
import RequirementsTable from '../components/RequirementsTable';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import {
  creatorCampaignDetailsById,
  creatorCampaigns,
  creatorProducts,
  creatorRequirements,
  type CreatorCampaignDetails,
} from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type CampaignDetailsNavigation = NavigationProp<CreatorStackParamList>;

const fallbackDetails: CreatorCampaignDetails = {
  requirements: creatorRequirements,
  products: creatorProducts,
  brief: {
    couponCode: 'LSCREATOR2K',
    website: 'www.layerstory.com',
    offerText: 'order products worth INR 2000, absolutely free.',
    intro: 'Choose a campaign product, create your own script, and share clean raw content for brand approval.',
    guidelines: [
      'Choose and order any product that fits your content style.',
      'Create your own script and share it with the team for approval.',
      'Shoot raw content in natural light with clear product visibility.',
      'The team will handle editing and final delivery formatting.',
      'Post the final approved video on your collab account.',
      'Keep the content live for the required campaign duration.',
    ],
  },
};

export default function CampaignDetailsScreen() {
  const navigation = useNavigation<CampaignDetailsNavigation>();
  const route = useRoute<RouteProp<CreatorStackParamList, 'CampaignDetails'>>();
  const [applied] = useState(false);
  const campaign = useMemo(
    () => creatorCampaigns.find((item) => item.id === route.params?.campaignId) ?? creatorCampaigns[0],
    [route.params?.campaignId],
  );
  const details = creatorCampaignDetailsById[campaign.id] ?? fallbackDetails;

  const handleShare = useCallback(async () => {
    await Share.share({
      title: campaign.name,
      message: `${campaign.name} by ${campaign.brand}\n${campaign.payout}\nCreate content for this Busket campaign.\nOpen in Busket: busket://creator/campaign/${campaign.id}`,
    });
  }, [campaign]);

  const handleApply = useCallback(() => {
    navigation.navigate('CampaignApplication', {
      campaignId: campaign.id,
      campaignTitle: campaign.name,
      brandName: campaign.brand,
      payoutText: campaign.payout,
    });
  }, [campaign, navigation]);

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Details</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Share campaign" activeOpacity={0.82} onPress={handleShare} style={styles.iconButton}>
          <MaterialCommunityIcons name="share-variant-outline" size={21} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ResponsiveContainer>
          <CampaignHeaderCard campaign={campaign} />
          <RequirementsTable rows={details.requirements} />
          <ProductScroller products={details.products} />
          <CampaignBriefCard brief={details.brief} applied={applied} onApplyPress={handleApply} />
        </ResponsiveContainer>
      </ScrollView>
    </AppScreen>
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
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
