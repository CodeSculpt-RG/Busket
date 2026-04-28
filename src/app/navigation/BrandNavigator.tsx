import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabIcon from '../../shared/components/BottomTabIcon';
import { brandTabs } from '../../shared/constants/brandTabs';
import { colors } from '../../shared/theme/colors';
import { tabBarHeight } from '../../shared/theme/responsive';
import BrandCampaignDetailsScreen from '../../features/brand/screens/BrandCampaignDetailsScreen';
import BrandCampaignsScreen from '../../features/brand/screens/BrandCampaignsScreen';
import BrandAboutAppScreen from '../../features/brand/screens/BrandAboutAppScreen';
import BrandDashboardScreen from '../../features/brand/screens/BrandDashboardScreen';
import BrandFaqScreen from '../../features/brand/screens/BrandFaqScreen';
import BrandNotificationsScreen from '../../features/brand/screens/BrandNotificationsScreen';
import BrandOnboardingScreen from '../../features/brand/screens/BrandOnboardingScreen';
import BrandPaymentBillingScreen from '../../features/brand/screens/BrandPaymentBillingScreen';
import BrandProfileScreen from '../../features/brand/screens/BrandProfileScreen';
import BrandTrendFinderScreen from '../../features/brand/screens/BrandTrendFinderScreen';
import CampaignApplicantsScreen from '../../features/brand/screens/CampaignApplicantsScreen';
import CampaignPreviewScreen from '../../features/brand/screens/CampaignPreviewScreen';
import CampaignSuccessScreen from '../../features/brand/screens/CampaignSuccessScreen';
import ContractsScreen from '../../features/brand/screens/ContractsScreen';
import CreateCampaignScreen from '../../features/brand/screens/CreateCampaignScreen';
import CreatorDiscoveryScreen from '../../features/brand/screens/CreatorDiscoveryScreen';
import CreatorProfilePreviewScreen from '../../features/brand/screens/CreatorProfilePreviewScreen';
import PaymentsScreen from '../../features/brand/screens/PaymentsScreen';
import type { BrandStackParamList, BrandTabParamList } from './types';

const Stack = createNativeStackNavigator<BrandStackParamList>();
const Tab = createBottomTabNavigator<BrandTabParamList>();

function BrandTabs() {
  return (
    <Tab.Navigator
      initialRouteName="BrandHome"
      screenOptions={({ route }) => {
        const tab = brandTabs.find((item) => item.name === route.name);

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: tabBarHeight,
            backgroundColor: colors.black,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <BottomTabIcon icon={tab?.icon ?? '?'} label={tab?.label ?? route.name} focused={focused} />
          ),
        };
      }}
    >
      <Tab.Screen name="BrandFeed" component={BrandTrendFinderScreen} />
      <Tab.Screen name="BrandCampaignTab" component={BrandCampaignsScreen} />
      <Tab.Screen name="BrandHome" component={BrandDashboardScreen} />
      <Tab.Screen name="BrandExplore" component={CreatorDiscoveryScreen} />
      <Tab.Screen name="BrandProfileTab" component={BrandProfileScreen} />
    </Tab.Navigator>
  );
}

export default function BrandNavigator() {
  return (
    <Stack.Navigator initialRouteName="BrandTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BrandOnboarding" component={BrandOnboardingScreen} />
      <Stack.Screen name="BrandTabs" component={BrandTabs} />
      <Stack.Screen name="BrandDashboard" component={BrandDashboardScreen} />
      <Stack.Screen name="BrandNotifications" component={BrandNotificationsScreen} />
      <Stack.Screen name="BrandTrendFinder" component={BrandTrendFinderScreen} />
      <Stack.Screen name="BrandCampaigns" component={BrandCampaignsScreen} />
      <Stack.Screen name="BrandCampaignCreate" component={CreateCampaignScreen} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
      <Stack.Screen name="CampaignPreview" component={CampaignPreviewScreen} />
      <Stack.Screen name="CampaignSuccess" component={CampaignSuccessScreen} />
      <Stack.Screen name="BrandCampaignDetails" component={BrandCampaignDetailsScreen} />
      <Stack.Screen name="CampaignApplicants" component={CampaignApplicantsScreen} />
      <Stack.Screen name="CreatorDiscovery" component={CreatorDiscoveryScreen} />
      <Stack.Screen name="CreatorProfilePreview" component={CreatorProfilePreviewScreen} />
      <Stack.Screen name="BrandProfile" component={BrandProfileScreen} />
      <Stack.Screen name="BrandPaymentBilling" component={BrandPaymentBillingScreen} />
      <Stack.Screen name="BrandFaq" component={BrandFaqScreen} />
      <Stack.Screen name="BrandAboutApp" component={BrandAboutAppScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Contracts" component={ContractsScreen} />
    </Stack.Navigator>
  );
}
