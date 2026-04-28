import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { CreatorCampaign } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

interface HorizontalCampaignCardProps {
  campaign: CreatorCampaign;
  onPress: (campaignId: string) => void;
}

function HorizontalCampaignCard({ campaign, onPress }: HorizontalCampaignCardProps) {
  const handlePress = React.useCallback(() => {
    onPress(campaign.id);
  }, [campaign.id, onPress]);

  return (
    <TouchableOpacity activeOpacity={0.82} onPress={handlePress}>
      <ImageBackground source={campaign.image} style={styles.card} imageStyle={styles.image}>
        <Text style={styles.title}>{campaign.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export default React.memo(HorizontalCampaignCard);

const styles = StyleSheet.create({
  card: {
    width: 98,
    height: 98,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.sm,
  },
  image: {
    borderRadius: radius.sm,
  },
  title: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
    backgroundColor: colors.overlay,
    padding: 5,
  },
});
