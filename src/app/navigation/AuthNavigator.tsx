import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrandOnboardingScreen from '../../features/brand/screens/BrandOnboardingScreen';
import BrandSignInScreen from '../../features/auth/screens/BrandSignInScreen';
import BrandSignUpScreen from '../../features/auth/screens/BrandSignUpScreen';
import CreatorSignInScreen from '../../features/auth/screens/CreatorSignInScreen';
import CreatorSignUpScreen from '../../features/auth/screens/CreatorSignUpScreen';
import RoleSelectionScreen from '../../features/auth/screens/RoleSelectionScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="RoleSelection" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="BrandSignIn" component={BrandSignInScreen} />
      <Stack.Screen name="BrandSignUp" component={BrandSignUpScreen} />
      <Stack.Screen name="CreatorSignIn" component={CreatorSignInScreen} />
      <Stack.Screen name="CreatorSignUp" component={CreatorSignUpScreen} />
      <Stack.Screen name="BrandOnboarding" component={BrandOnboardingScreen} />
    </Stack.Navigator>
  );
}
