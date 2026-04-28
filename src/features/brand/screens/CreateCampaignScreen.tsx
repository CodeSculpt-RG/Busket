import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { BrandCampaignFormParams, BrandStackParamList } from '../../../app/navigation/types';
import KeyboardAwareScreen from '../../../shared/components/KeyboardAwareScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

const isValidWebsite = (value: string) => {
  const trimmed = value.trim();
  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return /^https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?$/i.test(normalized);
};

export default function CreateCampaignScreen() {
  const navigation = useNavigation<NavigationProp<BrandStackParamList>>();
  const [form, setForm] = useState<BrandCampaignFormParams>({
    name: '',
    category: '',
    brief: '',
    payout: '',
    startDate: '',
    endDate: '',
    productLink: '',
    brandName: 'Busket Brand',
  });

  const isValid = useMemo(
    () =>
      Boolean(form.name.trim()) &&
      Boolean(form.category.trim()) &&
      Boolean(form.brief.trim()) &&
      Boolean(form.payout.trim()) &&
      Boolean(form.startDate.trim()) &&
      Boolean(form.endDate.trim()) &&
      isValidWebsite(form.productLink),
    [form],
  );

  const update = (key: keyof BrandCampaignFormParams, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handlePreview = () => {
    if (!isValid) {
      return;
    }

    navigation.navigate('CampaignPreview', {
      campaign: {
        ...form,
        productLink: /^https?:\/\//i.test(form.productLink.trim()) ? form.productLink.trim() : `https://${form.productLink.trim()}`,
      },
    });
  };

  return (
    <KeyboardAwareScreen
      style={styles.screen}
      contentContainerStyle={styles.scroll}
      stickyFooter={<PrimaryButton title="Preview Campaign" onPress={handlePreview} disabled={!isValid} style={styles.footerButton} />}
    >
      <ResponsiveContainer maxWidth={620}>
        <Text style={styles.title}>Create Campaign</Text>
        <View style={styles.card}>
          <Field label="Campaign Name" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Enter campaign name" />
          <Field label="Campaign Category" value={form.category} onChangeText={(value) => update('category', value)} placeholder="Beauty, Fitness, Tech..." />
          <Field label="Campaign Brief" value={form.brief} onChangeText={(value) => update('brief', value)} placeholder="Describe the campaign brief" multiline />
          <Field label="Payout Per Video" value={form.payout} onChangeText={(value) => update('payout', value)} placeholder="INR 5,000" keyboardType="default" />
          <Field label="Start Date" value={form.startDate} onChangeText={(value) => update('startDate', value)} placeholder="dd/mm/yyyy" />
          <Field label="End Date" value={form.endDate} onChangeText={(value) => update('endDate', value)} placeholder="dd/mm/yyyy" />
          <Field label="Product Link" value={form.productLink} onChangeText={(value) => update('productLink', value)} placeholder="https://example.com" keyboardType="url" autoCapitalize="none" autoCorrect={false} />
          {form.productLink.trim() && !isValidWebsite(form.productLink) ? <Text style={styles.error}>Enter a valid website link.</Text> : null}
        </View>
      </ResponsiveContainer>
    </KeyboardAwareScreen>
  );
}

function Field({
  label,
  multiline,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'url';
  autoCapitalize?: 'none';
  autoCorrect?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.multilineInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  scroll: { paddingTop: spacing.xl, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
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
  field: { marginTop: spacing.md },
  label: {
    marginBottom: spacing.xs,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: typography.small,
    paddingHorizontal: spacing.md,
  },
  multilineInput: {
    minHeight: 96,
    paddingTop: spacing.md,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  footerButton: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
});
