import React, { useCallback, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View, type TextInputProps } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import { updateCreatorProfile, useCreatorProfile } from '../../../app/store/creator.store';
import AppFormInput from '../../../shared/components/AppFormInput';
import AppSelect from '../../../shared/components/AppSelect';
import KeyboardAwareScreen from '../../../shared/components/KeyboardAwareScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { creatorCampaigns } from '../../../shared/constants/mockCreatorData';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';

type ApplicationNavigation = NavigationProp<CreatorStackParamList>;
type ApplicationRoute = RouteProp<CreatorStackParamList, 'CampaignApplication'>;

const CATEGORY_OPTIONS = [
  'Fashion',
  'Beauty',
  'Skincare',
  'Fitness',
  'Lifestyle',
  'Food',
  'Travel',
  'Tech',
  'Gaming',
  'Finance',
  'Education',
  'Comedy',
  'Entertainment',
  'Parenting',
  'Health & Wellness',
  'Business',
  'Photography',
  'Art',
  'Music',
  'Sports',
] as const;

const AVAILABILITY_OPTIONS = ['Immediate', 'Within 3 days', 'Within 1 week', 'Flexible'] as const;
const DELIVERABLE_OPTIONS = ['Reel', 'Story', 'Post'] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

interface DeliverableChipProps {
  item: string;
  selected: boolean;
  onPress: (item: string) => void;
}

const DeliverableChip = React.memo(function DeliverableChip({ item, selected, onPress }: DeliverableChipProps) {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      activeOpacity={0.82}
      onPress={handlePress}
      style={[styles.deliverableChip, selected && styles.selectedChip]}
    >
      <Text style={[styles.deliverableText, selected && styles.selectedChipText]}>{item}</Text>
    </TouchableOpacity>
  );
});

interface FieldProps extends TextInputProps {
  label: string;
}

function Field({ label, ...props }: FieldProps) {
  return <AppFormInput label={label} {...props} />;
}

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
}

function SelectField({ label, value, placeholder, onPress }: SelectFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppSelect value={value} placeholder={placeholder} onPress={onPress} />
    </View>
  );
}

interface OptionModalProps {
  visible: boolean;
  title: string;
  options: readonly string[];
  onClose: () => void;
  onSelect: (option: string) => void;
}

function OptionModal({ visible, title, options, onClose, onSelect }: OptionModalProps) {
  const renderOption = useCallback(
    ({ item }: { item: string }) => (
      <Pressable accessibilityRole="button" onPress={() => onSelect(item)} style={styles.optionRow}>
        <Text style={styles.optionText}>{item}</Text>
      </Pressable>
    ),
    [onSelect],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={10}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          <FlatList data={[...options]} keyExtractor={(item) => item} renderItem={renderOption} />
        </View>
      </View>
    </Modal>
  );
}

export default function CampaignApplicationScreen() {
  const navigation = useNavigation<ApplicationNavigation>();
  const route = useRoute<ApplicationRoute>();
  const creatorProfile = useCreatorProfile();
  const creatorCategories = creatorProfile?.categories ?? [];
  const campaign = useMemo(
    () => creatorCampaigns.find((item) => item.id === route.params.campaignId),
    [route.params.campaignId],
  );
  const [fullName, setFullName] = useState(creatorProfile?.fullName ?? '');
  const [email, setEmail] = useState(creatorProfile?.email ?? '');
  const [phone, setPhone] = useState(creatorProfile?.phone ?? '');
  const [city, setCity] = useState(creatorProfile?.city ?? '');
  const [category, setCategory] = useState(creatorCategories[0] ?? '');
  const [instagram, setInstagram] = useState(creatorProfile?.instagramHandle ?? '');
  const [followers, setFollowers] = useState(creatorProfile?.followers ? String(creatorProfile.followers) : '');
  const [portfolio, setPortfolio] = useState('');
  const [fitReason, setFitReason] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [consent, setConsent] = useState(false);
  const [activeModal, setActiveModal] = useState<'category' | 'availability' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(
    () =>
      fullName.trim().length > 2 &&
      isValidEmail(email) &&
      phone.replace(/\D/g, '').length >= 10 &&
      Boolean(category) &&
      followers.replace(/\D/g, '').length > 0 &&
      fitReason.trim().length > 0 &&
      deliverables.length > 0 &&
      Boolean(availability) &&
      consent,
    [availability, category, consent, deliverables.length, email, fitReason, followers, fullName, phone],
  );

  const categoryOptions = useMemo(
    () => (creatorCategories.length > 0 ? creatorCategories : CATEGORY_OPTIONS),
    [creatorCategories],
  );

  const handleSubmit = useCallback(() => {
    if (!isValid) {
      return;
    }

    updateCreatorProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      instagramHandle: instagram.trim() || undefined,
      followers: Number(followers),
      categories: category ? [category, ...creatorCategories.filter((item) => item !== category)] : creatorCategories,
    });
    setSubmitted(true);
  }, [category, city, creatorCategories, email, fitReason, followers, fullName, instagram, isValid, phone]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCategorySelect = useCallback((option: string) => {
    setCategory(option);
    setActiveModal(null);
  }, []);

  const handleAvailabilitySelect = useCallback((option: string) => {
    setAvailability(option);
    setActiveModal(null);
  }, []);

  const handleOpenCategory = useCallback(() => {
    setActiveModal('category');
  }, []);

  const handleOpenAvailability = useCallback(() => {
    setActiveModal('availability');
  }, []);

  const handleDeliverablePress = useCallback((item: string) => {
    setDeliverables((current) => toggleValue(current, item));
  }, []);

  const handleConsentPress = useCallback(() => {
    setConsent((current) => !current);
  }, []);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value.trim().toLowerCase());
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value.replace(/[^\d+ ]/g, ''));
  }, []);

  const handleFollowersChange = useCallback((value: string) => {
    setFollowers(value.replace(/\D/g, ''));
  }, []);

  const renderDeliverable = useCallback(
    ({ item }: { item: string }) => (
      <DeliverableChip item={item} selected={deliverables.includes(item)} onPress={handleDeliverablePress} />
    ),
    [deliverables, handleDeliverablePress],
  );

  return (
    <KeyboardAwareScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
      stickyFooter={
        <PrimaryButton
          title={submitted ? 'Application Submitted' : 'Submit Application'}
          tone="gold"
          disabled={!isValid || submitted}
          onPress={handleSubmit}
        />
      }
    >
      <ResponsiveContainer maxWidth={620}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" activeOpacity={0.82} onPress={handleBackPress} style={styles.iconButton}>
            <MaterialCommunityIcons name="arrow-left" size={23} color={colors.black} />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Apply for Campaign</Text>
            <Text numberOfLines={1} style={styles.subtitle}>{route.params.campaignTitle}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summaryCard}>
          {campaign ? <Image source={campaign.image} style={styles.summaryImage} /> : null}
          <View style={styles.summaryCopy}>
            <Text numberOfLines={1} style={styles.summaryTitle}>{route.params.campaignTitle}</Text>
            <Text numberOfLines={1} style={styles.summaryBrand}>By {route.params.brandName}</Text>
            {route.params.payoutText ? <Text numberOfLines={1} style={styles.summaryPayout}>{route.params.payoutText}</Text> : null}
          </View>
        </View>

        {submitted ? (
          <View style={styles.successCard}>
            <MaterialCommunityIcons name="check-circle" size={34} color={colors.success} />
            <Text style={styles.successTitle}>Application submitted successfully</Text>
            <Text style={styles.successCopy}>The brand will review your application and contact you if shortlisted.</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Field label="Full Name" value={fullName} placeholder="Enter your full name" autoCapitalize="words" onChangeText={setFullName} />
          <Field label="Email" value={email} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" onChangeText={handleEmailChange} />
          <Field label="Phone Number" value={phone} placeholder="Enter your phone number" keyboardType="phone-pad" maxLength={15} onChangeText={handlePhoneChange} />
          <Field label="City" value={city} placeholder="Enter your city" autoCapitalize="words" onChangeText={setCity} />
          <SelectField label="Content Category" value={category} placeholder="Select your content category" onPress={handleOpenCategory} />
          <Field label="Instagram Handle" value={instagram} placeholder="Enter your Instagram username" autoCapitalize="none" onChangeText={setInstagram} />
          <Field label="Followers Count" value={followers} placeholder="Enter your followers count" keyboardType="number-pad" onChangeText={handleFollowersChange} />
          <Field label="Portfolio / Profile Link" value={portfolio} placeholder="Paste your portfolio or profile link" keyboardType="url" autoCapitalize="none" onChangeText={setPortfolio} />
          <Field
            label="Why are you a good fit for this campaign?"
            value={fitReason}
            placeholder="Tell the brand why you are the right creator for this campaign"
            multiline
            onChangeText={setFitReason}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Preferred Deliverables</Text>
            <FlatList
              horizontal
              data={[...DELIVERABLE_OPTIONS]}
              keyExtractor={(item) => item}
              renderItem={renderDeliverable}
              contentContainerStyle={styles.deliverables}
              scrollEnabled={false}
            />
          </View>

          <SelectField label="Availability" value={availability} placeholder="Select your availability" onPress={handleOpenAvailability} />

          <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked: consent }} activeOpacity={0.82} onPress={handleConsentPress} style={styles.consentRow}>
            <View style={[styles.checkbox, consent && styles.checkedBox]}>
              {consent ? <MaterialCommunityIcons name="check" size={16} color={colors.black} /> : null}
            </View>
            <Text style={styles.consentText}>
              I confirm that the information provided is correct and I am ready to collaborate on this campaign.
            </Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>

      <OptionModal
        visible={activeModal === 'category'}
        title="Content Category"
        options={categoryOptions}
        onClose={() => setActiveModal(null)}
        onSelect={handleCategorySelect}
      />
      <OptionModal
        visible={activeModal === 'availability'}
        title="Availability"
        options={AVAILABILITY_OPTIONS}
        onClose={() => setActiveModal(null)}
        onSelect={handleAvailabilitySelect}
      />
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  headerCopy: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 38,
  },
  summaryCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  summaryImage: {
    width: 62,
    height: 62,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  summaryBrand: {
    marginTop: 2,
    color: colors.mutedDark,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  summaryPayout: {
    marginTop: 4,
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
  },
  successCard: {
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  successTitle: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
  },
  successCopy: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: radius.md,
    backgroundColor: '#FFE6B7',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: 7,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  selectBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  selectText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  placeholder: {
    color: colors.muted,
  },
  deliverables: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  deliverableChip: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  selectedChip: {
    backgroundColor: colors.gold,
  },
  deliverableText: {
    color: colors.black,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  selectedChipText: {
    fontWeight: fontWeight.heavy,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: radius.xs,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  checkedBox: {
    backgroundColor: colors.gold,
  },
  consentText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 16,
    fontWeight: fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  closeText: {
    color: colors.mutedDark,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  optionRow: {
    minHeight: 46,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.semibold,
  },
});
