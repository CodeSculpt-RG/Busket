import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import BottomTabIcon from '../../shared/components/BottomTabIcon';
import { creatorTabs } from '../../shared/constants/creatorTabs';
import { colors } from '../../shared/theme/colors';
import { tabBarHeight } from '../../shared/theme/responsive';
import CampaignDetailsScreen from '../../features/creator/screens/CampaignDetailsScreen';
import CreatorDashboardScreen from '../../features/creator/screens/CreatorDashboardScreen';
import CreatorFaqScreen from '../../features/creator/screens/FaqScreen';
import CreatorKycScreen from '../../features/creator/screens/CreatorKycScreen';
import CreatorProfileScreen from '../../features/creator/screens/CreatorProfileScreen';
import CreatorVideoUploadScreen from '../../features/creator/screens/CreatorVideoUploadScreen';
import EarningsScreen from '../../features/creator/screens/EarningsScreen';
import LearnToEarnScreen from '../../features/creator/screens/LearnToEarnScreen';
import SearchBrandScreen from '../../features/creator/screens/SearchBrandScreen';
import SearchCampaignScreen from '../../features/creator/screens/SearchCampaignScreen';
import TrendFinderScreen from '../../features/creator/screens/TrendFinderScreen';
import NotificationsScreen from '../../features/notifications/screens/NotificationsScreen';
import type { CreatorStackParamList, CreatorTabParamList } from './types';
import CampaignApplicationScreen from '../../features/creator/screens/CampaignApplicationScreen';

const Stack = createNativeStackNavigator<CreatorStackParamList>();
const Tab = createBottomTabNavigator<CreatorTabParamList>();

function CreatorTabs() {
  return (
    <Tab.Navigator
      initialRouteName="CreatorHome"
      screenOptions={({ route }) => {
        const tab = creatorTabs.find((item) => item.name === route.name);
        const focusedRouteName = getFocusedRouteNameFromRoute(route);
        const hideTabBar = focusedRouteName === 'CampaignDetails' || focusedRouteName === 'CampaignApplication';

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: tabBarHeight,
            backgroundColor: colors.black,
            borderTopWidth: 0,
            paddingTop: 7,
            paddingBottom: 7,
            display: hideTabBar ? 'none' : 'flex',
          },
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <BottomTabIcon icon={tab?.icon ?? '?'} label={tab?.label ?? route.name} focused={focused} />
          ),
        };
      }}
    >
      <Tab.Screen name="CreatorFeed" component={TrendFinderScreen} />
      <Tab.Screen name="CreatorCampaignTab" component={SearchCampaignScreen} />
      <Tab.Screen name="CreatorHome" component={CreatorDashboardScreen} />
      <Tab.Screen name="CreatorExplore" component={SearchBrandScreen} />
      <Tab.Screen name="CreatorProfileTab" component={CreatorProfileScreen} />
    </Tab.Navigator>
  );
}

export default function CreatorNavigator() {
  return (
    <Stack.Navigator initialRouteName="CreatorTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreatorTabs" component={CreatorTabs} />
      <Stack.Screen name="CreatorHome" component={CreatorDashboardScreen} />
      <Stack.Screen name="SearchCampaign" component={SearchCampaignScreen} />
      <Stack.Screen name="SearchBrand" component={SearchBrandScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
      <Stack.Screen name="CampaignApplication" component={CampaignApplicationScreen} />
      <Stack.Screen name="TrendFinder" component={TrendFinderScreen} />
      <Stack.Screen name="CreatorKyc" component={CreatorKycScreen} />
      <Stack.Screen name="CreatorEditProfile" component={CreatorKycScreen} />
      <Stack.Screen name="CreatorVideoUpload" component={CreatorVideoUploadScreen} />
      <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
      <Stack.Screen name="Earnings" component={EarningsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="CreatorFaq" component={CreatorFaqScreen} />
      <Stack.Screen name="LearnToEarn" component={LearnToEarnScreen} />
    </Stack.Navigator>
  );
}
