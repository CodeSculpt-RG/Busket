import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import UploadAvatarCard from '../components/UploadAvatarCard';
import type { CreatorStackParamList } from '../../../app/navigation/types';
import { useAuthState } from '../../../app/store/auth.store';
import { completeCreatorKyc, setCreatorProfile, useCreatorProfile } from '../../../app/store/creator.store';
import AppFormInput from '../../../shared/components/AppFormInput';
import AppMultiSelect from '../../../shared/components/AppMultiSelect';
import KeyboardAwareScreen from '../../../shared/components/KeyboardAwareScreen';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import ResponsiveContainer from '../../../shared/components/ResponsiveContainer';
import { INDIA_STATES_AND_UTS, INDIA_STATE_CITY_MAP } from '../../../shared/constants/indiaLocations';
import { pickImage } from '../../../shared/services/mediaPicker';
import { colors } from '../../../shared/theme/colors';
import { radius } from '../../../shared/theme/radius';
import { spacing } from '../../../shared/theme/spacing';
import { fontWeight, typography } from '../../../shared/theme/typography';
import type { PickedMediaAsset } from '../../../shared/types/media';

type KycNavigation = NavigationProp<CreatorStackParamList>;

const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Odia',
  'Assamese',
  'Urdu',
] as const;

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

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

type SelectTarget = 'languages' | 'state' | 'city' | 'gender' | 'categories' | null;

function formatList(values: string[]) {
  return values.join(', ');
}

function getStartOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function formatDob(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatDobInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length > 4) {
    return `${day}/${month}/${year}`;
  }

  if (digits.length > 2) {
    return `${day}/${month}`;
  }

  return day;
}

function parseDob(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day ||
    isBeforeMinimumDate(parsedDate) ||
    isFutureDate(parsedDate)
  ) {
    return null;
  }

  return parsedDate;
}

function isFutureDate(date: Date) {
  return date.getTime() > getStartOfToday().getTime();
}

function isBeforeMinimumDate(date: Date) {
  return date.getFullYear() < 1900;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function getCalendarDates(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const days: Array<Date | null> = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getDefaultDobMonth() {
  const today = getStartOfToday();
  return new Date(today.getFullYear() - 18, today.getMonth(), 1);
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

interface LabeledTextInputProps extends TextInputProps {
  label: string;
}

function LabeledTextInput({ label, style, ...props }: LabeledTextInputProps) {
  return <AppFormInput label={label} {...props} style={style} />;
}

interface LabeledSelectProps {
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onPress: () => void;
}

function LabeledSelect({ label, value, placeholder, disabled = false, onPress }: LabeledSelectProps) {
  return (
    <AppMultiSelect
      label={label}
      values={value ? [value] : []}
      placeholder={placeholder}
      disabled={disabled}
      onPress={onPress}
      style={styles.compactField}
    />
  );
}

interface LabeledDobInputProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChangeText: (value: string) => void;
  onOpenCalendar: () => void;
}

function LabeledDobInput({ label, value, placeholder, error, onChangeText, onOpenCalendar }: LabeledDobInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.selectBox, error && styles.errorSelect]}>
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={10}
          returnKeyType="done"
          onChangeText={onChangeText}
          style={styles.dobInput}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Open date picker" onPress={onOpenCalendar} hitSlop={10} style={styles.calendarButton}>
          <MaterialCommunityIcons name="calendar-month-outline" size={21} color={colors.black} />
        </Pressable>
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </>
  );
}

interface OptionModalProps {
  visible: boolean;
  title: string;
  options: readonly string[];
  selectedValues: string[];
  multiple?: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
}

function OptionModal({ visible, title, options, selectedValues, multiple = false, onClose, onSelect }: OptionModalProps) {
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

          <FlatList
            data={options}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            style={styles.optionList}
            renderItem={({ item }) => {
              const selected = selectedValues.includes(item);

              return (
                <Pressable
                  accessibilityRole={multiple ? 'checkbox' : 'button'}
                  accessibilityState={{ selected, checked: multiple ? selected : undefined }}
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [styles.optionRow, selected && styles.optionRowSelected, pressed && styles.optionRowPressed]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                  <View style={[styles.checkCircle, selected && styles.checkCircleSelected]} />
                </Pressable>
              );
            }}
          />

          {multiple ? <PrimaryButton title="Done" onPress={onClose} style={styles.doneButton} /> : null}
        </View>
      </View>
    </Modal>
  );
}

interface DobCalendarModalProps {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function DobCalendarModal({ visible, value, onClose, onSelect }: DobCalendarModalProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => value ?? getDefaultDobMonth());

  const days = useMemo(() => getCalendarDates(visibleMonth), [visibleMonth]);
  const today = getStartOfToday();
  const canGoNext = addMonths(visibleMonth, 1).getTime() <= new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  useEffect(() => {
    if (visible) {
      setVisibleMonth(value ?? getDefaultDobMonth());
    }
  }, [value, visible]);

  const handleSelectDate = useCallback(
    (date: Date) => {
      if (isFutureDate(date) || isBeforeMinimumDate(date)) {
        return;
      }

      onSelect(date);
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.calendarSheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Date Of Birth</Text>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={10}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.calendarNav}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setVisibleMonth((current) => addMonths(current, -1))}
              hitSlop={10}
              style={styles.calendarNavButton}
            >
              <Text style={styles.calendarNavText}>{'<'}</Text>
            </Pressable>
            <Text style={styles.monthTitle}>{getMonthLabel(visibleMonth)}</Text>
            <Pressable
              accessibilityRole="button"
              disabled={!canGoNext}
              onPress={() => setVisibleMonth((current) => addMonths(current, 1))}
              hitSlop={10}
              style={[styles.calendarNavButton, !canGoNext && styles.disabledCalendarNav]}
            >
              <Text style={[styles.calendarNavText, !canGoNext && styles.disabledText]}>{'>'}</Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEKDAYS.map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekday}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((date, index) => {
              const disabled = !date || isFutureDate(date) || isBeforeMinimumDate(date);
              const selected =
                Boolean(date && value) &&
                date?.getFullYear() === value?.getFullYear() &&
                date?.getMonth() === value?.getMonth() &&
                date?.getDate() === value?.getDate();

              return (
                <Pressable
                  key={date ? date.toISOString() : `empty-${index}`}
                  accessibilityRole="button"
                  disabled={disabled}
                  onPress={() => date && handleSelectDate(date)}
                  style={({ pressed }) => [
                    styles.dayCell,
                    selected && styles.selectedDayCell,
                    disabled && styles.disabledDayCell,
                    pressed && !disabled && styles.optionRowPressed,
                  ]}
                >
                  <Text style={[styles.dayText, selected && styles.selectedDayText, disabled && styles.disabledText]}>
                    {date ? date.getDate() : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CreatorKycScreen() {
  const navigation = useNavigation<KycNavigation>();
  const authState = useAuthState();
  const existingProfile = useCreatorProfile();
  const [name, setName] = useState(existingProfile?.fullName ?? authState.user?.name ?? '');
  const [phone, setPhone] = useState(existingProfile?.phone ?? '');
  const [languages, setLanguages] = useState<string[]>(existingProfile?.languages ?? []);
  const [state, setState] = useState(existingProfile?.state ?? '');
  const [city, setCity] = useState(existingProfile?.city ?? '');
  const [gender, setGender] = useState(existingProfile?.gender ?? '');
  const [dob, setDob] = useState(existingProfile?.dob ?? '');
  const [dobDate, setDobDate] = useState<Date | null>(() => (existingProfile?.dob ? parseDob(existingProfile.dob) : null));
  const [dobError, setDobError] = useState('');
  const [categories, setCategories] = useState<string[]>(existingProfile?.categories ?? []);
  const [avatar, setAvatar] = useState<PickedMediaAsset | undefined>(
    existingProfile?.avatarUri ? { uri: existingProfile.avatarUri, kind: 'image' } : undefined,
  );
  const [uploadError, setUploadError] = useState('');
  const [activeSelect, setActiveSelect] = useState<SelectTarget>(null);
  const [showDobPicker, setShowDobPicker] = useState(false);

  const cityOptions = useMemo(
    () => (state && state in INDIA_STATE_CITY_MAP ? INDIA_STATE_CITY_MAP[state as keyof typeof INDIA_STATE_CITY_MAP] : []),
    [state],
  );

  const complete = useMemo(
    () =>
      name.trim().length > 2 &&
      languages.length > 0 &&
      phone.length === 10 &&
      Boolean(state) &&
      Boolean(city) &&
      Boolean(gender) &&
      Boolean(dobDate) &&
      !dobError &&
      categories.length > 0,
    [categories.length, city, dobDate, dobError, gender, languages.length, name, phone.length, state],
  );

  const modalConfig = useMemo(() => {
    switch (activeSelect) {
      case 'languages':
        return {
          title: 'Languages',
          options: LANGUAGE_OPTIONS,
          selectedValues: languages,
          multiple: true,
        };
      case 'state':
        return {
          title: 'State',
          options: INDIA_STATES_AND_UTS,
          selectedValues: state ? [state] : [],
          multiple: false,
        };
      case 'city':
        return {
          title: 'City',
          options: cityOptions,
          selectedValues: city ? [city] : [],
          multiple: false,
        };
      case 'gender':
        return {
          title: 'Gender',
          options: GENDER_OPTIONS,
          selectedValues: gender ? [gender] : [],
          multiple: false,
        };
      case 'categories':
        return {
          title: 'Categories',
          options: CATEGORY_OPTIONS,
          selectedValues: categories,
          multiple: true,
        };
      default:
        return null;
    }
  }, [activeSelect, categories, city, cityOptions, gender, languages, state]);

  const handleAvatarPress = useCallback(async () => {
    const result = await pickImage();

    if (result.asset) {
      setAvatar(result.asset);
      setUploadError('');
      return;
    }

    if (result.error) {
      setUploadError(result.error);
    }
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      switch (activeSelect) {
        case 'languages':
          setLanguages((current) => toggleValue(current, value));
          break;
        case 'state':
          setState((current) => {
            if (current !== value) {
              setCity('');
            }

            return value;
          });
          setActiveSelect(null);
          break;
        case 'city':
          setCity(value);
          setActiveSelect(null);
          break;
        case 'gender':
          setGender(value);
          setActiveSelect(null);
          break;
        case 'categories':
          setCategories((current) => toggleValue(current, value));
          break;
        default:
          break;
      }
    },
    [activeSelect],
  );

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(value.replace(/\D/g, '').slice(0, 10));
  }, []);

  const handleDobChange = useCallback((value: string) => {
    const formattedValue = formatDobInput(value);
    setDob(formattedValue);

    if (!formattedValue) {
      setDobDate(null);
      setDobError('');
      return;
    }

    if (formattedValue.length < 10) {
      setDobDate(null);
      setDobError('');
      return;
    }

    const parsedDate = parseDob(formattedValue);
    setDobDate(parsedDate);
    setDobError(parsedDate ? '' : 'Enter a valid date that is not in the future.');
  }, []);

  const handleCalendarSelect = useCallback((date: Date) => {
    const formattedDate = formatDob(date);
    setDob(formattedDate);
    setDobDate(date);
    setDobError('');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!complete || !dobDate) {
      return;
    }

    setCreatorProfile({
      fullName: name.trim(),
      email: existingProfile?.email ?? authState.user?.email ?? '',
      phone,
      languages,
      state,
      city,
      gender,
      dob: formatDob(dobDate),
      categories,
      avatarUri: avatar?.uri,
    });
    completeCreatorKyc();

    if (existingProfile) {
      navigation.navigate('CreatorTabs', { screen: 'CreatorProfileTab' });
      return;
    }
  }, [authState.user?.email, avatar?.uri, categories, city, complete, dobDate, existingProfile, gender, languages, name, navigation, phone, state]);

  return (
    <KeyboardAwareScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
      stickyFooter={<PrimaryButton title="Continue" onPress={handleSubmit} disabled={!complete} />}
    >
      <ResponsiveContainer maxWidth={520}>
        <UploadAvatarCard
          asset={avatar}
          error={uploadError}
          image={avatar?.uri ? { uri: avatar.uri } : undefined}
          onPress={handleAvatarPress}
        />

        <Text style={styles.title}>Creator KYC Details</Text>
        <Text style={styles.subtitle}>Please fill all details carefully to get approved.</Text>

        <LabeledTextInput
          label="Creator Name"
          value={name}
          placeholder="Enter Your Full Name"
          autoCapitalize="words"
          returnKeyType="next"
          onChangeText={setName}
        />
        <LabeledSelect
          label="Languages"
          value={formatList(languages)}
          placeholder="Please select all the languages you can speak"
          onPress={() => setActiveSelect('languages')}
        />
        <LabeledTextInput
          label="Phone Number"
          value={phone}
          placeholder="Enter your phone number"
          keyboardType="number-pad"
          maxLength={10}
          autoCorrect={false}
          textContentType="telephoneNumber"
          returnKeyType="next"
          onChangeText={handlePhoneChange}
        />
        <LabeledSelect
          label="State"
          value={state}
          placeholder="Select your state"
          onPress={() => setActiveSelect('state')}
        />
        <LabeledSelect
          label="City"
          value={city}
          placeholder="Select your city"
          disabled={!state}
          onPress={() => setActiveSelect('city')}
        />
        <LabeledSelect
          label="Gender"
          value={gender}
          placeholder="Select Your Gender"
          onPress={() => setActiveSelect('gender')}
        />
        <LabeledDobInput
          label="Date Of Birth"
          value={dob}
          placeholder="Please Select your Date of Birth"
          error={dobError}
          onChangeText={handleDobChange}
          onOpenCalendar={() => setShowDobPicker(true)}
        />
        <LabeledSelect
          label="Categories"
          value={formatList(categories)}
          placeholder="Select your content categories"
          onPress={() => setActiveSelect('categories')}
        />
      </ResponsiveContainer>

      {modalConfig ? (
        <OptionModal
          visible={Boolean(activeSelect)}
          title={modalConfig.title}
          options={modalConfig.options}
          selectedValues={modalConfig.selectedValues}
          multiple={modalConfig.multiple}
          onClose={() => setActiveSelect(null)}
          onSelect={handleSelect}
        />
      ) : null}
      <DobCalendarModal
        visible={showDobPicker}
        value={dobDate}
        onClose={() => setShowDobPicker(false)}
        onSelect={handleCalendarSelect}
      />
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    marginTop: spacing.xl,
    color: colors.text,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: spacing.sm,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.medium,
  },
  label: {
    marginTop: 12,
    marginBottom: 7,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.bold,
  },
  compactField: {
    marginBottom: 0,
  },
  inputBox: {
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  textInput: {
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  selectBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
  },
  disabledSelect: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.68,
  },
  selectValue: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
  placeholder: {
    color: colors.muted,
  },
  disabledText: {
    color: colors.muted,
  },
  chevronBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: fontWeight.heavy,
  },
  dobInput: {
    flex: 1,
    minHeight: 46,
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  calendarButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    marginLeft: spacing.sm,
  },
  errorSelect: {
    borderColor: colors.error,
  },
  fieldError: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.tiny,
    fontWeight: fontWeight.bold,
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
  optionList: {
    marginHorizontal: -spacing.xs,
  },
  optionRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  optionRowSelected: {
    backgroundColor: colors.surfaceMuted,
  },
  optionRowPressed: {
    opacity: 0.75,
  },
  optionText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.medium,
  },
  optionTextSelected: {
    fontWeight: fontWeight.bold,
  },
  checkCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    marginLeft: spacing.md,
  },
  checkCircleSelected: {
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  doneButton: {
    marginTop: spacing.md,
  },
  calendarSheet: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  calendarNav: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  disabledCalendarNav: {
    opacity: 0.42,
  },
  calendarNavText: {
    color: colors.black,
    fontSize: typography.bodyLarge,
    fontWeight: fontWeight.heavy,
  },
  monthTitle: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeight.heavy,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekday: {
    flex: 1,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  selectedDayCell: {
    backgroundColor: colors.gold,
  },
  disabledDayCell: {
    opacity: 0.34,
  },
  dayText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeight.semibold,
  },
  selectedDayText: {
    color: colors.black,
    fontWeight: fontWeight.heavy,
  },
});
