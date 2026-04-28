import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AppInput from '../../../shared/components/AppInput';
import { colors } from '../../../shared/theme/colors';
import { fontWeight, typography } from '../../../shared/theme/typography';
import SectionLabel from './SectionLabel';

interface FormTextInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
}

export default function FormTextInput({ label, value, placeholder, onChangeText, keyboardType = 'default' }: FormTextInputProps) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <AppInput value={value} placeholder={placeholder} onChangeText={onChangeText} keyboardType={keyboardType} />
    </>
  );
}
