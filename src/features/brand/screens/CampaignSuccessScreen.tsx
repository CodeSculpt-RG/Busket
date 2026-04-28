import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { BrandStackParamList } from '../../../app/navigation/types';
import AppScreen from '../../../shared/components/AppScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function CampaignSuccessScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const route = useRoute<RouteProp<BrandStackParamList, 'CampaignSuccess'>>();

  const handleGoToCampaigns = () => {
    navigation.navigate('BrandCampaigns', {
      createdCampaign: route.params.campaign,
    });
  };

  return (
    <AppScreen style={styles.screen} bottomInset={false}>
      <ResponsiveContainer maxWidth={520} style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="check" size={42} color={colors.black} />
          </View>
          <Text style={styles.title}>Campaign Created Successfully</Text>
          <Text style={styles.subtitle}>Your campaign is now ready to receive creator applications.</Text>
          <PrimaryButton title="Go to Campaigns" onPress={handleGoToCampaigns} style={styles.button} />
        </View>
      </ResponsiveContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: spacing.xxl,
  },
  iconCircle: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },
  title: {
    marginTop: spacing.xl,
    color: colors.text,
    fontSize: typography.heading,
    lineHeight: 30,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 19,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: spacing.xl,
  },
});
