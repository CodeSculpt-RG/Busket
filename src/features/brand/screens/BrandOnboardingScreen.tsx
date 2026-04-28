import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { setBrandProfile } from '../../../app/store/brand.store';
import BrandFormInput from '../components/BrandFormInput';
import BrandFormSelect from '../components/BrandFormSelect';
import BrandUploadLogoCard from '../components/BrandUploadLogoCard';
import KeyboardAwareScreen from '../../../shared/components/KeyboardAwareScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { BUSINESS_CATEGORIES } from '../../../shared/constants/businessCategories';
import { INDIA_STATES_AND_UTS } from '../../../shared/constants/indiaLocations';
import { pickImage } from '../../../shared/services/mediaPicker';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import type { PickedMediaAsset } from '../../../shared/types/media';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const websitePattern =
  /^https?:\/\/([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

const trimValue = (value: string) => value.trim();

const isValidEmail = (value: string) => emailPattern.test(trimValue(value).toLowerCase());

const normalizeWebsiteUrl = (value: string) => {
  const trimmed = trimValue(value);

  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const isValidWebsiteUrl = (value: string) => {
  const normalized = normalizeWebsiteUrl(value);

  if (!normalized || /\s/.test(normalized)) {
    return false;
  }

  return websitePattern.test(normalized);
};

const normalizeGstin = (value: string) => value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 15);

const isValidGstin = (value: string) => gstinPattern.test(normalizeGstin(value));

type BrandForm = {
  businessName: string;
  pocName: string;
  businessEmail: string;
  website: string;
  state: string;
  gstin: string;
  businessCategory: string;
};

type BrandFormField = keyof BrandForm;

const initialTouched: Record<BrandFormField, boolean> = {
  businessName: false,
  pocName: false,
  businessEmail: false,
  website: false,
  state: false,
  gstin: false,
  businessCategory: false,
};

export default function BrandOnboardingScreen() {
  const [form, setForm] = useState<BrandForm>({
    businessName: '',
    pocName: '',
    businessEmail: '',
    website: '',
    state: '',
    gstin: '',
    businessCategory: '',
  });
  const [touched, setTouched] = useState<Record<BrandFormField, boolean>>(initialTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [logo, setLogo] = useState<PickedMediaAsset | undefined>();
  const [uploadError, setUploadError] = useState('');

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<BrandFormField, string>> = {};

    if (trimValue(form.businessName).length < 2) {
      nextErrors.businessName = 'Enter a valid business name.';
    }

    if (trimValue(form.pocName).length < 2) {
      nextErrors.pocName = 'Enter the POC full name.';
    }

    if (!isValidEmail(form.businessEmail)) {
      nextErrors.businessEmail = 'Enter a valid business email.';
    }

    if (!isValidWebsiteUrl(form.website)) {
      nextErrors.website = 'Enter a valid website link.';
    }

    if (!form.state) {
      nextErrors.state = 'Select your business state.';
    }

    if (!isValidGstin(form.gstin)) {
      nextErrors.gstin = 'Enter a valid 15-character GSTIN.';
    }

    if (!form.businessCategory) {
      nextErrors.businessCategory = 'Select your business category.';
    }

    return nextErrors;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const showError = (key: BrandFormField) => (touched[key] || submitAttempted ? errors[key] : undefined);

  const updateField = (key: BrandFormField, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const markTouched = (key: BrandFormField) => {
    setTouched((current) => ({ ...current, [key]: true }));
  };

  const handlePickLogo = async () => {
    const result = await pickImage();

    if (result.asset) {
      setLogo(result.asset);
      setUploadError('');
      return;
    }

    if (result.error) {
      setUploadError(result.error);
    }
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    setTouched({
      businessName: true,
      pocName: true,
      businessEmail: true,
      website: true,
      state: true,
      gstin: true,
      businessCategory: true,
    });

    if (!isValid) {
      return;
    }

    setBrandProfile({
      businessName: form.businessName.trim(),
      pocName: form.pocName.trim(),
      businessEmail: form.businessEmail.trim().toLowerCase(),
      website: normalizeWebsiteUrl(form.website),
      state: form.state,
      gstin: normalizeGstin(form.gstin),
      businessCategory: form.businessCategory,
      logoUri: logo?.uri,
    });
  };

  return (
    <KeyboardAwareScreen
      style={styles.screen}
      contentContainerStyle={styles.scroll}
      stickyFooter={<PrimaryButton title="Submit" onPress={handleSubmit} disabled={!isValid} style={styles.footerButton} />}
    >
      <ResponsiveContainer maxWidth={620}>
        <Text style={styles.title}>Business Details</Text>
        <Text style={styles.subtitle}>Add your business information to start running creator campaigns.</Text>
        <BrandUploadLogoCard asset={logo} error={uploadError} onPress={handlePickLogo} />

        <View style={styles.form}>
          <BrandFormInput
            label="Business Name"
            value={form.businessName}
            onBlur={() => markTouched('businessName')}
            onChangeText={(value) => updateField('businessName', value)}
            placeholder="Enter business name"
            returnKeyType="next"
            errorText={showError('businessName')}
          />
          <BrandFormInput
            label="POC Full Name"
            value={form.pocName}
            onBlur={() => markTouched('pocName')}
            onChangeText={(value) => updateField('pocName', value)}
            placeholder="Enter POC full name"
            returnKeyType="next"
            textContentType="name"
            errorText={showError('pocName')}
          />
          <BrandFormInput
            label="Business Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={form.businessEmail}
            onBlur={() => {
              markTouched('businessEmail');
              updateField('businessEmail', form.businessEmail.trim().toLowerCase());
            }}
            onChangeText={(value) => updateField('businessEmail', value.replace(/\s/g, '').toLowerCase())}
            placeholder="Enter business email"
            returnKeyType="next"
            textContentType="emailAddress"
            errorText={showError('businessEmail')}
          />
          <BrandFormInput
            label="Website"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            value={form.website}
            onBlur={() => {
              markTouched('website');
              updateField('website', form.website.trim());
            }}
            onChangeText={(value) => updateField('website', value)}
            placeholder="Enter your business website link"
            returnKeyType="next"
            textContentType="URL"
            errorText={showError('website')}
          />
          <BrandFormSelect
            label="Address / State"
            value={form.state}
            options={INDIA_STATES_AND_UTS}
            placeholder="Select your business state"
            onChange={(value) => {
              markTouched('state');
              updateField('state', value);
            }}
            errorText={showError('state')}
          />
          <BrandFormInput
            label="GSTIN"
            autoCapitalize="characters"
            autoCorrect={false}
            value={form.gstin}
            maxLength={15}
            onBlur={() => markTouched('gstin')}
            onChangeText={(value) => updateField('gstin', normalizeGstin(value))}
            placeholder="Enter GSTIN"
            returnKeyType="next"
            errorText={showError('gstin')}
          />
          <BrandFormSelect
            label="Business Category"
            value={form.businessCategory}
            options={BUSINESS_CATEGORIES}
            placeholder="Select your business category"
            onChange={(value) => {
              markTouched('businessCategory');
              updateField('businessCategory', value);
            }}
            errorText={showError('businessCategory')}
          />
        </View>
      </ResponsiveContainer>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  scroll: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    lineHeight: 19,
  },
  form: {
    marginTop: spacing.sm,
  },
  footerButton: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
});
