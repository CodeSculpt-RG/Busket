import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import AuthFooterText from '../components/AuthFooterText';
import AuthHeroHeader from '../components/AuthHeroHeader';
import SocialAuthPanel from '../components/SocialAuthPanel';
import type { AuthStackParamList } from '../../../app/navigation/types';
import KeyboardAwareScreen from '../../../shared/components/KeyboardAwareScreen';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

export default function BrandSignUpScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <KeyboardAwareScreen style={styles.container} contentContainerStyle={styles.content}>
      <AuthHeroHeader eyebrow="Heya Brand!" title="READY TO GROW" />

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Signup account</Text>
        <Text style={styles.helper}>Register your brand profile and get started.</Text>

        <SocialAuthPanel role="brand" intent="register" errorMessage="Could not create account with social account. Please try again." />

        <AuthFooterText
          prefix="Already have an account?"
          action="Log In!"
          onPress={() => navigation.navigate('BrandSignIn')}
          style={styles.footer}
        />
      </View>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    paddingHorizontal: 36,
    paddingTop: 28,
  },
  content: {
    paddingBottom: 48,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  helper: {
    marginTop: 3,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  footer: {
    marginTop: spacing.lg,
  },
});
